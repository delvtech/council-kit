import { ReadLockingVault } from "@delvtech/council-core";
import { createNetwork, createReadContractFactory } from "src/index";
import { createPublicClient, http } from "viem";
import { expect, test } from "vitest";

const rpcUrl = process.env.TEST_RPC_URL || "http://localhost:8545";

test.todo("It fetches events", async () => {
  const client = createPublicClient({
    transport: http(rpcUrl),
  });
  const lockingVault = new ReadLockingVault({
    address: "0x",
    contractFactory: createReadContractFactory({
      publicClient: client,
    }),
    network: createNetwork(client),
  });

  const result = await lockingVault.getDelegatorsTo({
    account: "0x",
  });
  console.log("result:", result);

  expect(result).toBeDefined();
});
