import {
  Chain,
  createPublicClient,
  createWalletClient,
  Hex,
  http,
  PrivateKeyAccount,
} from "viem";

interface DeployContractOptions {
  abi: any;
  args: any[];
  bytecode: Hex;
  account: PrivateKeyAccount;
  rpcUrl: string;
  chain: Chain;
  onSubmitted?: (txHash: string) => void;
}

export async function deployContract({
  abi,
  args,
  bytecode,
  account,
  rpcUrl,
  chain,
  onSubmitted,
}: DeployContractOptions): Promise<DeployedContract> {
  const publicClient = createPublicClient({
    transport: http(rpcUrl),
    chain,
  });

  const walletClient = createWalletClient({
    account,
    transport: http(rpcUrl),
    chain,
  });

  const hash = await walletClient.deployContract({
    abi,
    account,
    args,
    bytecode,
  });
  onSubmitted?.(hash);

  const { contractAddress } = await publicClient.waitForTransactionReceipt({
    hash,
  });

  if (!contractAddress) {
    throw new Error(
      `Contract address not found in deployment receipt for tx, ${hash}`,
    );
  }

  return {
    address: contractAddress,
    hash,
    deploymentArgs: args,
  };
}

export type DeployedContract = {
  address: string;
  hash: string;
  deploymentArgs: any[];
};
