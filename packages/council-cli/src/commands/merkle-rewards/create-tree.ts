import { OptionGetter, command } from "clide-js";
import colors from "colors";
import MerkleTree from "merkletreejs";
import path from "path";
import signale from "signale";
import {
  Hex,
  encodePacked,
  formatUnits,
  isAddress,
  keccak256,
  parseUnits,
} from "viem";
import { z } from "zod";
import { Address as AddressSchema, DecimalString } from "../../lib/zod.js";
import { JsonStore } from "../../utils/JsonStore.js";
import { isNotEmptyList } from "../../utils/validation/isNotEmptyList.js";
import { isNumberString } from "../../utils/validation/isNumberString.js";
import { validateData } from "../../utils/validation/validateData.js";

export default command({
  description:
    "Create a merkle tree for rewards (e.g., airdrop) from a list of addresses and reward amounts. The output is a JSON file with the merkle root and each leaf by address with it's proof.",

  options: {
    i: {
      alias: ["input", "input-path"],
      description:
        'The path to the json file with the addresses and amounts listed as an array of objects with address and amount properties. The amount property is a decimal string that will be scaled based on the decimals option. For example, [{"address": "0x1234...", "amount": "100.5"}, ...].',
      type: "string",
    },
    a: {
      alias: ["addresses"],
      description:
        "A list of recipient addresses to include in the merkle tree.",
      type: "array",
      customType: "hexArray",
    },
    A: {
      alias: ["amounts"],
      description:
        "A list of amounts to reward each address. Must be same length as addresses.",
      type: "array",
    },
    d: {
      alias: ["decimals", "token-decimals"],
      description:
        "The decimal precision used by the token contract. The amounts will be multiplied by (10 ** decimals). For example, if amount is 100 and decimals is 18, then the result will be 100000000000000000000.",
      type: "number",
      default: 18,
    },
    o: {
      alias: ["out-dir"],
      description:
        "The directory to write the merkle tree info to; relative to the current working directory.",
      type: "string",
    },
  },

  handler: async ({ options, next }) => {
    const leaves = await getLeaves({
      inputsPathGetter: options.inputPath,
      addressesGetter: options.addresses,
      amountsGetter: options.amounts,
    });

    const decimals = await options.decimals();

    const merkleTree = createMerkleTree(leaves, decimals);

    // Sum all the amounts
    const amountTotal = leaves.reduce(
      (sum, { amount }) => sum + parseUnits(amount, decimals),
      0n,
    );

    // Get the total unique addresses
    const allAddresses = leaves.map(({ address }) => address);
    const uniqueAddresses = new Set(allAddresses);

    // Create object entries for each account with the address as the key which
    // is lowercased since object keys are case sensitive.
    const accountsEntries = leaves.map(({ address, amount }) => {
      const proof = merkleTree.getHexProof(
        hashAccount({ address, amount }, decimals),
      );

      return [address.toLowerCase(), { amount, proof }];
    });

    const merkleTreeInfo = {
      root: merkleTree.getHexRoot(),
      rewardsTotal: formatUnits(amountTotal, decimals),
      uniqueAccountsTotal: uniqueAddresses.size,
      accounts: Object.fromEntries(accountsEntries),
    };

    const outDir = await options.outDir({
      prompt: `Enter the path to write the merkle tree info to ${colors.dim(
        "(optional)",
      )}`,
    });

    if (outDir) {
      const store = new JsonStore({
        path: path.dirname(outDir),
        name: path.basename(outDir),
      });

      store.set(merkleTreeInfo);
    }

    console.log("\n");
    signale.success("Merkle tree created successfully!");
    console.log("\n");

    console.log(colors.dim(`${"=".repeat(80)}`));
    console.log(`Merkle root: ${merkleTreeInfo.root}`);
    console.log(colors.dim(`${"-".repeat(80)}`));
    console.log(`Rewards total: ${merkleTreeInfo.rewardsTotal}`);
    console.log(colors.dim(`${"-".repeat(80)}`));
    console.log(`Unique accounts total: ${merkleTreeInfo.uniqueAccountsTotal}`);
    console.log(colors.dim(`${"=".repeat(80)}`));

    next(merkleTreeInfo);
  },
});

const Leaves = z.array(
  z.object({
    address: AddressSchema,
    amount: DecimalString,
  }),
);
type Leaves = z.infer<typeof Leaves>;

/**
 * A requiredOption wrapper for prompting the user for the leaves to create
 * the merkle tree from.
 */
async function getLeaves({
  inputsPathGetter,
  addressesGetter,
  amountsGetter,
}: {
  inputsPathGetter: OptionGetter<{ type: "string"; customType: "hex" }>;
  addressesGetter: OptionGetter<{ type: "array"; customType: "hexArray" }>;
  amountsGetter: OptionGetter<{ type: "array" }>;
}): Promise<Leaves> {
  const leaves: Leaves = [];

  let addresses = await addressesGetter();
  let amounts = await amountsGetter();

  // Try to import the leaves from the input path if it was passed or prompt
  // the user for the input path if no options were passed.
  if (!addresses && !amounts) {
    const possibleInputPath = await inputsPathGetter({
      prompt: `Enter the path to the leaves JSON file ${colors.dim(
        "(Leave blank to enter addresses and amounts manually)",
      )}`,
    });

    // Import and validate the leaves from the input path
    if (possibleInputPath) {
      const fullInputPath = path.resolve(process.cwd(), possibleInputPath);

      const { default: importedLeafs } = await import(fullInputPath).catch(
        (err) => {
          signale.error(err);
          throw new Error(
            `The leaves file at ${fullInputPath} could not be found.`,
          );
        },
      );

      // Validate the imported leaves
      validateData(importedLeafs, Leaves);

      // Add the imported leaves to the leaves array
      leaves.push(...importedLeafs);
    }
  }

  // Add leaves from the addresses and amounts options if they were passed or
  // prompt the user for them if leaves is still empty.
  if (isNotEmptyList(addresses) || isNotEmptyList(amounts) || !leaves.length) {
    addresses = await addressesGetter({
      prompt: "Enter recipient addresses",
      validate: (addresses) => {
        if (!Array.isArray(addresses) || !addresses?.length) {
          return "Enter valid addresses";
        }

        // Validate the addresses
        for (const address of addresses) {
          if (!isAddress(address)) {
            return `Invalid address: ${address}`;
          }
        }

        return true;
      },
    });

    if (!addresses) {
      throw new Error("Addresses are required");
    }

    amounts = await amountsGetter({
      prompt: "Enter reward amounts",
      validate: (amounts) => {
        if (!amounts || !Array.isArray(amounts)) {
          return "Enter valid amounts";
        }

        // Validate the addresses
        for (const amount of amounts) {
          if (!isNumberString(amount)) {
            return `Invalid amount: ${amount}`;
          }
        }

        return true;
      },
    });

    if (!amounts) {
      throw new Error("Amounts are required");
    }

    // Ensure options are the same length
    if (addresses.length !== amounts.length) {
      throw new Error(
        "The `addresses` and `amounts` options must be the same length.",
      );
    }

    const leavesFromOptions = addresses.map((address, i) => {
      return {
        address,
        amount: (amounts as `${number}`[])[i],
      };
    });

    // Add the manually entered leaves to the leaves array
    leaves.push(...leavesFromOptions);
  }

  return leaves;
}

function createMerkleTree(leaves: Leaves, tokenDecimals: number) {
  const hashedLeaves = leaves.map((leaf) => hashAccount(leaf, tokenDecimals));

  return new MerkleTree.default(
    hashedLeaves,
    (bytes: Hex) => {
      const packedData = encodePacked(["bytes"], [bytes]);
      return keccak256(packedData);
    },
    {
      hashLeaves: false,
      sortPairs: true,
    },
  );
}

function hashAccount(
  { address, amount }: Leaves[number],
  tokenDecimals: number,
) {
  const packedData = encodePacked(
    ["address", "uint256"],
    [address, parseUnits(amount, tokenDecimals)],
  );
  return keccak256(packedData);
}
