import colors from "colors";
import MerkleTree from "merkletreejs";
import path from "path";
import prompts from "prompts";
import signale from "signale";
import { ArrayQuestion, requiredArray } from "src/options/utils/requiredArray";
import { requiredNumber } from "src/options/utils/requiredNumber";
import { requiredOption } from "src/options/utils/requiredOption";
import { formatBigInt } from "src/utils/bigint/formatBigInt";
import { parseBigInt } from "src/utils/bigint/parseBigInt";
import { createCommandModule } from "src/utils/createCommandModule";
import { JSONStore } from "src/utils/JSONStore";
import { Schema, validateData } from "src/utils/validateData";
import { isNotEmptyList } from "src/utils/validation/isNotEmptyList";
import { isNumberString } from "src/utils/validation/isNumberString";
import {
  Address,
  encodePacked,
  Hex,
  isAddress,
  keccak256,
  parseUnits,
} from "viem";

export const { command, describe, builder, handler } = createCommandModule({
  command: "create-tree [OPTIONS]",
  describe:
    "Create a merkle tree for rewards (e.g., airdrop) from a list of addresses and reward amounts. The output is a JSON file with the merkle root and each leaf by address with it's proof.",

  builder: (yargs) => {
    return yargs.options({
      p: {
        alias: ["accounts-path"],
        describe:
          'The path to the json file with the addresses and amounts listed as an array of objects with address and amount properties. The amount property is a decimal string that will be scaled based on the decimals option. For example, [{"address": "0x1234...", "amount": "100.5"}, ...].',
        type: "string",
      },
      a: {
        alias: ["addresses"],
        describe:
          "A list of recipient addresses to include in the merkle tree.",
        type: "array",
        string: true,
      },
      m: {
        alias: ["amounts"],
        describe:
          "A list of amounts to reward each address. Must be same length as addresses.",
        type: "array",
        string: true,
      },
      d: {
        alias: ["decimals", "token-decimals"],
        describe:
          "The decimal precision used by the token contract. The amounts will be multiplied by (10 ** decimals). For example, if amount is 100 and decimals is 18, then the result will be 100000000000000000000.",
        type: "number",
      },
      o: {
        alias: ["out-path"],
        describe:
          "The directory to write the merkle tree info to; relative to the current working directory.",
        type: "string",
      },
    });
  },

  handler: async (args) => {
    const accounts = await requiredAccounts(
      args.accountsPath,
      args.addresses as Address[],
      args.amounts as `${number}`[],
    );

    const decimals = await requiredNumber(args.decimals, {
      name: "decimals",
      message: "Enter decimal precision",
      initial: 18,
    });

    const merkleTree = getMerkleTree(accounts, decimals);

    // Sum all the amounts
    const amountTotal = accounts.reduce(
      (sum, { amount }) => sum + parseBigInt(amount, decimals),
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
      rewardsTotal: formatBigInt(amountTotal),
      uniqueAccountsTotal: uniqueAddresses.size,
      accounts: Object.fromEntries(accountsEntries),
    };

    const outPath = await requiredOption(args.outPath, {
      name: "out-path",
      type: "text",
      message: `Enter the path to write the merkle tree info to ${colors.dim(
        "(optional)",
      )}`,
    });

    if (outPath) {
      const store = new JSONStore({
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
  },
});

/**
 * A requiredOption wrapper for prompting the user for the accounts to create
 * the merkle tree from.
 */
async function requiredAccounts(
  accountsPath?: string,
  addresses?: Address[],
  amounts?: `${number}`[],
): Promise<Account[]> {
  let accounts: Account[] = [];

  // Try to import the accounts from the accounts path if it was passed or
  // prompt the user for the accounts path if no options were passed.
  if (accountsPath || (!addresses && !amounts)) {
    const possibleAccountsPath = await requiredOption(accountsPath, {
      name: "accounts-path",
      type: "text",
      message: `Enter the path to the accounts JSON file ${colors.dim(
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
    const ensuredAddresses = await requiredAddressArray(addresses, {
      name: "addresses",
      message: "Enter recipient addresses",
    });

    const ensuredAmounts = await requiredAmountArray(amounts, {
      name: "amounts",
      message: "Enter reward amounts",
    });

    // Ensure options are the same length
    if (ensuredAddresses.length !== ensuredAmounts.length) {
      throw new Error(
        "The `addresses` and `amounts` options must be the same length.",
      );
    }

    const ensuredAccounts = ensuredAddresses.map((address, i) => {
      return {
        address,
        amount: ensuredAmounts[i],
      };
    });

    // Add the ensured accounts to the accounts array
    accounts = [...accounts, ...ensuredAccounts];
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

function requiredAddressArray(
  value: Address[] | undefined,
  question: ArrayQuestion,
  options?: prompts.Options,
): Promise<Address[]> {
  return requiredArray(
    value,
    {
      validate: (value?: string | string[]) => {
        if (!value) {
          return "Enter valid addresses";
        }

        // Validate the addresses
        for (const address of value) {
          if (!isAddress(address)) {
            return `Invalid address: ${address}`;
          }
        }

        return true;
      },
      ...question,
    },
    options,
  );
}

function requiredAmountArray(
  value: `${number}`[] | undefined,
  question: ArrayQuestion,
  options?: prompts.Options,
): Promise<`${number}`[]> {
  return requiredArray(
    value,
    {
      validate: (value?: `${number}`[]) => {
        if (!value) {
          return "Enter valid amounts";
        }

        // Validate the addresses
        for (const amount of value) {
          if (!isNumberString(amount)) {
            return `Invalid amount: ${amount}`;
          }
        }

        return true;
      },
      ...question,
    },
    options,
  );
}

function getMerkleTree(accounts: Account[], tokenDecimals: number) {
  const leaves = accounts.map((account) => hashAccount(account, tokenDecimals));

  return new MerkleTree(
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
