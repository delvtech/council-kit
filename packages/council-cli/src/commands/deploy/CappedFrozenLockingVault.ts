import { CappedFrozenLockingVault__factory } from "@council/typechain";
import signale from "signale";
import { chainOption, requiredChain } from "src/options/chain";
import { requiredRpcUrl, rpcUrlOption } from "src/options/rpc-url";
import { requiredNumber } from "src/options/utils/requiredNumber";
import { requiredString } from "src/options/utils/requiredString";
import { requiredWalletKey, walletKeyOption } from "src/options/wallet-key";
import { parseBigInt } from "src/utils/bigint/parseBigInt";
import { createCommandModule } from "src/utils/createCommandModule";
import { deployContract, DeployedContract } from "src/utils/deployContract";
import { Hex, PrivateKeyAccount } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { Chain } from "viem/chains";

export const { command, aliases, describe, builder, handler } =
  createCommandModule({
    command: "locking-vault [OPTIONS]",
    aliases: ["CappedFrozenLockingVault"],
    describe: "Deploy a CappedFrozenLockingVault contract",

    builder: (yargs) => {
      return yargs.options({
        t: {
          alias: ["token"],
          describe: "The address of the ERC20 token contract",
          type: "string",
        },
        l: {
          alias: ["lag", "stale-block-lag", "staleBlockLag"],
          describe:
            "The number of blocks before the delegation history is forgotten",
          type: "number",
        },
        s: {
          alias: ["capping-size"],
          describe:
            "the maximum amount in the fund, after which, the vault becomes frozen",
          type: "string",
        },
        d: {
          alias: ["decimals"],
          describe:
            "The decimal precision used by the contract. The power option will be multiplied by (10 ** decimals). For example, if power is 100 and decimals is 18, then the result will be 100000000000000000000",
          type: "number",
        },
        b: {
          alias: ["benificiary"],
          describe:
            "benificiary / reciever address that will get the funds after the vault is full",
          type: "string",
        },
        c: chainOption,
        r: rpcUrlOption,
        w: walletKeyOption,
      });
    },

    handler: async (args) => {
      const token = await requiredString(args.token, {
        name: "token",
        message: "Enter token address",
      });

      const lag = await requiredNumber(args.lag, {
        name: "lag",
        message: "Enter stale block lag",
        initial: 100,
      });

      const size = await requiredString(args.s, {
        name: "fund-size",
        message: "Enter the size of the vault",
      });

      const decimals = await requiredNumber(args.decimals, {
        name: "decimals",
        message: "Enter decimal precision",
        initial: 18,
      });

      const benificiary = await requiredString(args.benificiary, {
        name: "benificiary",
        message: "Enter benificiary:",
        initial: "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
      });

      const chain = await requiredChain(args.chain);
      const rpcUrl = await requiredRpcUrl(args.rpcUrl);
      const walletKey = await requiredWalletKey(args.walletKey);
      const account = privateKeyToAccount(walletKey as Hex);

      signale.pending("Deploying CappedFrozenLockingVault...");

      const { address } = await deployCappedFrozenLockingVault({
        token,
        staleBlockLag: lag,
        size,
        decimals,
        benificiary,
        account,
        rpcUrl,
        chain,
        onSubmitted: (txHash) => {
          signale.pending(
            `CappedFrozenLockingVault deployment tx submitted: ${txHash}`,
          );
        },
      });

      signale.success(`CappedFrozenLockingVault deployed @ ${address}`);
    },
  });

export interface DeployCappedFrozenLockingVaultOptions {
  token: string;
  staleBlockLag: number;
  size: string;
  decimals: number;
  benificiary: string;
  account: PrivateKeyAccount;
  rpcUrl: string;
  chain: Chain;
  onSubmitted?: (txHash: string) => void;
}

export async function deployCappedFrozenLockingVault({
  token,
  staleBlockLag,
  size,
  decimals,
  benificiary,
  account,
  rpcUrl,
  chain,
  onSubmitted,
}: DeployCappedFrozenLockingVaultOptions): Promise<DeployedContract> {
  return await deployContract({
    abi: CappedFrozenLockingVault__factory.abi,
    args: [token, staleBlockLag, parseBigInt(size, decimals), benificiary],
    bytecode: CappedFrozenLockingVault__factory.bytecode,
    account,
    rpcUrl,
    chain,
    onSubmitted,
  });
}
