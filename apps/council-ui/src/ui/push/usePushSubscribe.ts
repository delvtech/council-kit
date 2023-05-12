import * as PushAPI from "@pushprotocol/restapi";
import { SubscribeOptionsType } from "@pushprotocol/restapi/src/lib/channels";
import { useCallback, useEffect, useState } from "react";

import { useChainId } from "src/ui/network/useChainId";
import { useAccount, useSignTypedData } from "wagmi";
import PushSettings from "./settings.json";
import { UsePushSubscribeType } from "./types";

export function usePushSubscribe(): UsePushSubscribeType {
  const { address } = useAccount();
  const chainId = useChainId();
  const [loading, setLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  function fetchChainId() {
    const isProd = chainId === 1;
    const env = isProd ? "prod" : "staging";
    const channel = isProd
      ? PushSettings.PROD_CHANNEL_ADDRESS
      : PushSettings.STAGING_CHANNEL_ADDRESS;
    return { chainId, env, channel };
  }

  const isUserSubscribed = useCallback(
    async function () {
      const { env, channel } = fetchChainId();
      const userSubscriptions =
        address &&
        (await PushAPI.user.getSubscriptions({
          user: String(address),
          env,
        }));
      const addresses =
        userSubscriptions &&
        userSubscriptions.map(({ channel }: { channel: string }) => channel);

      if (addresses) {
        return addresses.includes(channel);
      }

      return false; // or handle the case where addresses is empty
    },
    [address],
  );

  // define a wrapper around the signTypedData function to match the types
  const { signTypedDataAsync: signer } = useSignTypedData();
  async function _signTypedData(
    domain: unknown,
    types: unknown,
    value: unknown,
  ) {
    let params;
    if (
      typeof domain === "object" &&
      typeof types === "object" &&
      typeof value === "object"
    ) {
      params = {
        domain: { ...domain },
        types: { ...types },
        value: { ...value },
      };
      const response = await signer(params);
      return response;
    } else {
      throw new Error("FAILURE");
    }
  }
  function generatePayload(): SubscribeOptionsType {
    const { chainId, env, channel } = fetchChainId();
    const payload = {
      signer: { _signTypedData },
      channelAddress: `eip155:${chainId}:${channel}`, // channel address in CAIP
      userAddress: `eip155:${chainId}:${address}`, // user address in CAIP
      env,
    };
    return payload;
  }

  async function toggleUserStatus() {
    setLoading(true);
    try {
      const payload = generatePayload();
      const response = await (isSubscribed
        ? PushAPI.channels.unsubscribe(payload)
        : PushAPI.channels.subscribe(payload));

      if (response.status !== "error") {
        setIsSubscribed(!isSubscribed);
      }
      return response;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // fetch if the user is subscribed
    (async function () {
      setLoading(true);
      try {
        const isSubscribed = await isUserSubscribed();
        setIsSubscribed(isSubscribed);
      } finally {
        setLoading(false);
      }
    })();
  }, [isUserSubscribed]);

  return {
    toggleUserStatus,
    isSubscribed,
    loading,
  };
}
