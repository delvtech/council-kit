import { BytesLike } from "ethers";

/** Domain or domain signature for origin or contract */
export type Domain = {
  name?: string;
  version?: string;
  /**
   * Chain permitted for signing
   * If signer is not active on this chain, it will attempt to programmatically switch
   */
  chainId?: string | number | bigint;
  verifyingContract?: string;
  salt?: BytesLike;
};

/** Named list of all type definitions */
export type Types = Record<
  string,
  Array<{
    name: string;
    type: string;
  }>
>;

/** Data to sign */
export type Value = Record<string, string>;

/** Type for usePushSubscribe */
export type UsePushSubscribeType = {
  loading: boolean;
  isSubscribed: boolean;
  toggleUserStatus?: () => void;
};
/** Type for usePushSubscribe */

// type for signer parameter
export type SignerType = {
  domain: Domain;
  types: Types;
  value: Value;
};
// type for signer parameter

export type Payload = {
  signer: {
    _signTypedData: (domain: Domain, types: Types, value: Value) => void;
  };
  channelAddress: string;
  userAddress: string;
  env: string;
};
