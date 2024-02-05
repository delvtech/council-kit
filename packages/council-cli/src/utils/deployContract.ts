import {
  Abi,
  Chain,
  createPublicClient,
  createWalletClient,
  DeployContractParameters,
  Hex,
  http,
  PrivateKeyAccount,
} from "viem";

interface DeployContractOptions<TAbi extends Abi | readonly unknown[]> {
  abi: TAbi;
  args: DeployContractParameters<TAbi>["args"];
  bytecode: Hex;
  account: PrivateKeyAccount;
  rpcUrl: string;
  chain: Chain;
  onSubmitted?: (txHash: string) => void;
}

export async function deployContract<TAbi extends Abi | readonly unknown[]>({
  abi,
  args,
  bytecode,
  account,
  rpcUrl,
  chain,
  onSubmitted,
}: DeployContractOptions<TAbi>): Promise<DeployedContract> {
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
  } as any);
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
    deploymentArgs: args as any[],
  };
}

export type DeployedContract = {
  address: `0x${string}`;
  hash: `0x${string}`;
  deploymentArgs: any[];
};
