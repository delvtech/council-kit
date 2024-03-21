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
  coreVoting: CoreVotingContractConfig;
  gscVoting?: GscVotingContractConfig;
  airdrop?: AirdropConfig;

  /**
   * Optional Push Integration
   * @see https://docs.push.org/developers/developer-tooling/push-sdk/sdk-packages-details/epnsproject-sdk-restapi/for-notification/opt-in-and-opt-out
   */
  push?: PushSettings;
}

export interface ContractConfig {
  address: `0x${string}`;
}

export interface BaseVotingContractConfig extends ContractConfig {
  name: string;
  descriptionURL: string;
  proposals: Record<string /*proposal id*/, ProposalConfig>;
}

export interface CoreVotingContractConfig extends BaseVotingContractConfig {
  vaults: VaultConfig[];
}

export interface GscVotingContractConfig extends BaseVotingContractConfig {
  vault: VaultConfig;
}

export interface VaultConfig extends ContractConfig {
  type:
    | "LockingVault"
    | "FrozenLockingVault"
    | "VestingVault"
    | "GSCVault"
    | string;
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
  descriptionURL?: string;
  targets: string[];
  calldatas: string[];
}

interface AirdropConfig extends ContractConfig {
  /**
   * The base url for the airdrop data api.
   *
   * if the base url is https://cdn.io/airdrop/ then the airdrop data for
   * the address `0x123` will be fetched from https://cdn.io/airdrop/0x123
   *
   * The data returned from the api should be a json object matching the
   * following example:
   *
   * ```json
   * {
   *   "amount": "100.5",
   *   "proof": ["0x123", "0x456", "0x789"]
   * }
   * ```
   *
   */
  baseDataURL: string;
}

interface PushSettings {
  /**
   * The address of the channel to subscribe to
   */
  channel?: string;
  env?: `${ENV}`;
}
