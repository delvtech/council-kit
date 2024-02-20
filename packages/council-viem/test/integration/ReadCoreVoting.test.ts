import { ReadLockingVault } from "@delvtech/council-core";
import { createNetwork, createReadContractFactory } from "src/index";
import { createPublicClient, http } from "viem";
import { expect, test } from "vitest";

// const rpcUrl = process.env.TEST_RPC_URL || 'http://localhost:8545';
const rpcUrl =
  "https://eth-mainnet.g.alchemy.com/v2/tFR-5zqyPVjqCSE4RJfbHioq5UvbFfV9";

test("It fetches events", async () => {
  const client = createPublicClient({
    transport: http(rpcUrl),
  });
  const lockingVault = new ReadLockingVault({
    // address: '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512',
    address: "0x02Bd4A3b1b95b01F2Aa61655415A5d3EAAcaafdD",
    contractFactory: createReadContractFactory({
      publicClient: client,
    }),
    network: createNetwork(client),
  });

  const result = await lockingVault.getDelegatorsTo({
    account: "0x84dC915a87fF4257B553f0AE49ad55cD2167C777",
  });
  console.log("result:", result);

  expect(result).toBeDefined();
});
