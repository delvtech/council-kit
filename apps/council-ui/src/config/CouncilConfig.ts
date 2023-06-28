import { ENV } from "@pushprotocol/restapi/src/lib/constants";

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

  /**
   * Optional Push Integration
   * @see https://docs.push.org/developers/developer-tooling/push-sdk/sdk-packages-details/epnsproject-sdk-restapi/for-notification/opt-in-and-opt-out
   */
  push?: PushSettings;
}

export interface ContractConfig {
  address: string;
}

export interface VotingContractConfig extends ContractConfig {
  name: string;
  descriptionURL: string;
  vaults: VaultConfig[];
  proposals: Record<string /*proposal id*/, ProposalConfig>;
}

export interface VaultConfig extends ContractConfig {
  type: "LockingVault" | "FrozenLockingVault" | "VestingVault" | "GSCVault";
  name: string;
  /**
   * A short one-liner to show below the vault name.
   */
  sentenceSummary?: string;
  /**
   * A description to show on the vault's details page.
   */
  paragraphSummary?: string;
  descriptionURL: string;
}

export interface ProposalConfig {
  /**
   * Title of the proposal.
   */
  title?: string;
  /**
   * A short one-liner to show below the proposal name.
   */
  sentenceSummary?: string;
  /**
   * A description to show on the proposal's details page.
   */
  paragraphSummary?: string;
  descriptionURL: string;
  targets: string[];
  calldatas: string[];
}

interface PushSettings {
  /**
   * The address of the channel to subscribe to
   */
  channel?: string;
  env?: `${ENV}`;
}
