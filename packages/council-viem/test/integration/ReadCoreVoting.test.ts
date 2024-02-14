import { ReadCoreVoting } from '@delvtech/council-core';
import { createNetwork, createReadContractFactory } from 'src/index';
import { createPublicClient, http } from 'viem';
import { expect, test } from 'vitest';

const rpcUrl = process.env.TEST_RPC_URL || 'http://localhost:8545';

test('It fetches events', async () => {
  const client = createPublicClient({
    transport: http(rpcUrl),
  });
  const coreVoting = new ReadCoreVoting({
    address: '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512',
    contractFactory: createReadContractFactory({
      publicClient: client,
    }),
    network: createNetwork(client)
  })

  const proposals = await coreVoting.getProposals();
  console.log('proposals:', proposals);

  expect(proposals).toBeDefined();
});
