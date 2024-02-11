import * as PushAPI from "@pushprotocol/restapi";
import { SubscribeOptionsType } from "@pushprotocol/restapi/src/lib/channels";
import { useCallback, useEffect, useState } from "react";

import { ENV } from "@pushprotocol/restapi/src/lib/constants";
import { councilConfigs } from "src/config/council.config";
import { useSupportedChainId } from "src/ui/network/hooks/useSupportedChainId";
import { useAccount, useSignTypedData } from "wagmi";
import { UsePushSubscribeType } from "./types";

export function usePushSubscribe(): UsePushSubscribeType {
  const { address } = useAccount();
  const chainId = useSupportedChainId();
  const [loading, setLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const config = councilConfigs[chainId].push || {};
  const isConfigured = !!councilConfigs[chainId].push;

  const isUserSubscribed = useCallback(
    async function () {
      const { env, channel } = config;
      const userSubscriptions =
        address &&
        (await PushAPI.user.getSubscriptions({
          user: address.toString(),
          env: env as ENV,
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
      const response = await signer(params as any);
      return response;
    } else {
      throw new Error("FAILURE");
    }
  }

  function generatePayload(): SubscribeOptionsType {
    const { env, channel } = config;
    const payload: SubscribeOptionsType = {
      signer: { _signTypedData } as any,
      channelAddress: `eip155:${chainId}:${channel}`, // channel address in CAIP
      userAddress: `eip155:${chainId}:${address}`, // user address in CAIP
      env: env as ENV,
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
    toggleUserStatus: isConfigured ? toggleUserStatus : undefined,
    isSubscribed,
    loading,
  };
}
