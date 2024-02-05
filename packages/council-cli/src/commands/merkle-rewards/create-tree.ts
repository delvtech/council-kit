import { OptionGetter, command } from "clide-js";
import colors from "colors";
import MerkleTree from "merkletreejs";
import path from "path";
import signale from "signale";
import {
  Address,
  Hex,
  encodePacked,
  formatUnits,
  isAddress,
  keccak256,
  parseUnits,
} from "viem";
import { JsonStore } from "../../utils/config/JsonStore.js";
import { Schema, validateData } from "../../utils/config/validateData.js";
import { isNotEmptyList } from "../../utils/validation/isNotEmptyList.js";
import { isNumberString } from "../../utils/validation/isNumberString.js";

export default command({
  description:
    "Create a merkle tree for rewards (e.g., airdrop) from a list of addresses and reward amounts. The output is a JSON file with the merkle root and each leaf by address with it's proof.",

  options: {
    p: {
      alias: ["accounts-path"],
      description:
        'The path to the json file with the addresses and amounts listed as an array of objects with address and amount properties. The amount property is a decimal string that will be scaled based on the decimals option. For example, [{"address": "0x1234...", "amount": "100.5"}, ...].',
      type: "string",
    },
    a: {
      alias: ["addresses"],
      description:
        "A list of recipient addresses to include in the merkle tree.",
      type: "array",
    },
    m: {
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
      alias: ["out-path"],
      description:
        "The directory to write the merkle tree info to; relative to the current working directory.",
      type: "string",
    },
  },

  handler: async ({ options, next }) => {
    const accounts = await getAccounts({
      accountsPathGetter: options.accountsPath,
      addressesGetter: options.addresses,
      amountsGetter: options.amounts,
    });

    const decimals = await options.decimals();

    const merkleTree = getMerkleTree(accounts, decimals);

    // Sum all the amounts
    const amountTotal = accounts.reduce(
      (sum, { amount }) => sum + parseUnits(amount, decimals),
      BigInt(0),
    );

    // Get the total unique addresses
    const allAddresses = accounts.map(({ address }) => address);
    const uniqueAddresses = new Set(allAddresses);

    // Create object entries for each account with the address as the key which
    // is lowercased since object keys are case sensitive.
    const accountsEntries = accounts.map(({ address, amount }) => {
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

    const outPath = await options.outPath({
      prompt: `Enter the path to write the merkle tree info to ${colors.dim(
        "(optional)",
      )}`,
    });

    if (outPath) {
      const store = new JsonStore({
        path: path.dirname(outPath),
        name: path.basename(outPath),
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

/**
 * A requiredOption wrapper for prompting the user for the accounts to create
 * the merkle tree from.
 */
async function getAccounts({
  accountsPathGetter,
  addressesGetter,
  amountsGetter,
}: {
  accountsPathGetter: OptionGetter<string | undefined>;
  addressesGetter: OptionGetter<string[] | undefined>;
  amountsGetter: OptionGetter<string[] | undefined>;
}): Promise<Account[]> {
  let accounts: Account[] = [];

  let addresses = await addressesGetter();
  let amounts = await amountsGetter();

  // Try to import the accounts from the accounts path if it was passed or
  // prompt the user for the accounts path if no options were passed.
  if (!addresses && !amounts) {
    const possibleAccountsPath = await accountsPathGetter({
      prompt: `Enter the path to the accounts JSON file ${colors.dim(
        "(Leave blank to enter addresses and amounts manually)",
      )}`,
    });

    // Import and validate the accounts from the accounts path
    if (possibleAccountsPath) {
      const fullAccountsPath = path.resolve(
        process.cwd(),
        possibleAccountsPath,
      );

      const { default: importedAccounts } = await import(
        fullAccountsPath
      ).catch((err) => {
        signale.error(err);
        throw new Error(
          `The accounts file at ${fullAccountsPath} could not be found.`,
        );
      });

      // Validate the imported accounts
      validateData(importedAccounts, accountsScema);

      // Add the imported accounts to the accounts array
      accounts = [...accounts, ...importedAccounts];
    }
  }

  // Add accounts from the addresses and amounts options if they were passed or
  // prompt the user for them if accounts is still empty.
  if (
    isNotEmptyList(addresses) ||
    isNotEmptyList(amounts) ||
    !accounts.length
  ) {
    addresses = await addressesGetter({
      prompt: {
        message: "Enter recipient addresses",
        validate: (addresses) => {
          if (!addresses?.length) {
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
      },
    });

    if (!addresses) {
      throw new Error("Addresses are required");
    }

    amounts = await amountsGetter({
      prompt: {
        message: "Enter reward amounts",
        validate: (amounts) => {
          if (!amounts) {
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

    const ensuredAccounts = addresses.map((address, i) => {
      return {
        address: address as `0x${string}`,
        amount: (amounts as `${number}`[])[i],
      };
    });

    // Add the ensured accounts to the accounts array
    return [...accounts, ...ensuredAccounts];
  }

  return accounts;
}

interface Account {
  address: Address;
  amount: `${number}`;
}

const accountsScema: Schema<Account[]> = {
  type: "array",
  items: {
    type: "object",
    properties: {
      address: {
        type: "string",
        pattern: "^0x[a-fA-F0-9]{40}$",
      },
      amount: {
        type: "string",
        pattern: "^(\\d*\\.)?\\d+$",
      },
    },
    required: ["address", "amount"],
  },
};

function getMerkleTree(accounts: Account[], tokenDecimals: number) {
  const leaves = accounts.map((account) => hashAccount(account, tokenDecimals));

  return new MerkleTree.default(
    leaves,
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

function hashAccount({ address, amount }: Account, tokenDecimals: number) {
  const packedData = encodePacked(
    ["address", "uint256"],
    [address, parseUnits(amount, tokenDecimals)],
  );
  return keccak256(packedData);
}
