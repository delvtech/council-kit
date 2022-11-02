export interface CouncilConfig {
  /**
   * The version of the council config object
   */
  version: string;

  /**
   * The chain id where the contracts are deployed
   */
  chainId: number;
  timelock: ContractProperties;
  coreVoting: VotingContractProperties;
  gscVoting: VotingContractProperties;
}

interface ContractProperties {
  address: string;
  abi: Record<string, any>;
}

interface VotingContractProperties extends ContractProperties {
  descriptionURL: string;
  vaults: VaultProperties[];
  proposals: Record<string /*proposal id*/, ProposalProperties>;
}

interface VaultProperties extends ContractProperties {
  type: "LockingVault" | "GSCVault";
  name: string;
  descriptionURL: string;
}

interface ProposalProperties {
  descriptionURL: string;
  targets: string[];
  calldatas: string[];
}
