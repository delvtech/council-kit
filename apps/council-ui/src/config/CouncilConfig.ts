export interface CouncilConfig {
  /**
   * The version of the council config object
   */
  version: string;

  /**
   * The chain id where the contracts are deployed
   */
  chainId: number;
  timelock: ContractConfig;
  coreVoting: VotingContractConfig;
  gscVoting?: VotingContractConfig;
}

export interface ContractConfig {
  address: string;
  abi: Record<string, any>;
}

export interface VotingContractConfig extends ContractConfig {
  descriptionURL: string;
  vaults: VaultConfig[];
  proposals: Record<string /*proposal id*/, ProposalConfig>;
}

export interface VaultConfig extends ContractConfig {
  type: "LockingVault" | "FrozenLockingVault" | "VestingVault" | "GSCVault";
  name: string;
  descriptionURL: string;
}

export interface ProposalConfig {
  descriptionURL: string;
  targets: string[];
  calldatas: string[];
}
