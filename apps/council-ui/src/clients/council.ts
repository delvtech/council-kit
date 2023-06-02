import {
  CouncilContext,
  GSCVault,
  GSCVotingContract,
  LockingVault,
  VestingVault,
  VotingContract,
  VotingVault,
} from "@council/sdk";
import { councilConfigs, SupportedChainId } from "src/config/council.config";
import { provider as getProvider } from "src/provider";

export interface CouncilClient {
  context: CouncilContext;
  coreVoting: VotingContract;
  gscVoting?: GSCVotingContract;
}

export function getCouncilClient(chainId: SupportedChainId): CouncilClient {
  const config = councilConfigs[chainId];
  if (!config) {
    throw new Error(
      `Attempted to create a Council client with Chain ID ${chainId}, but no config was found. See src/config.`,
    );
  }

  const provider = getProvider({ chainId });
  const context = new CouncilContext(provider);

  const coreVotingVaults = config.coreVoting.vaults.map(({ type, address }) => {
    switch (type) {
      case "FrozenLockingVault":
      case "LockingVault":
        return new LockingVault(address, context);
      case "VestingVault":
        return new VestingVault(address, context);
      case "GSCVault":
        return new GSCVault(address, context);
      default:
        return new VotingVault(address, context);
    }
  });

  const client: CouncilClient = {
    context,
    coreVoting: new VotingContract(
      config.coreVoting.address,
      coreVotingVaults,
      context,
    ),
  };

  if (config.gscVoting) {
    client.gscVoting = new GSCVotingContract(
      config.gscVoting.address,
      new GSCVault(config.gscVoting.vaults[0].address, context),
      context,
    );
  }

  return client;
}
