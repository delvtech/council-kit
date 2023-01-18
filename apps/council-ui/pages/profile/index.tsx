import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import { Page } from "src/ui/base/Page";
import { useAccount } from "wagmi";

export default function Profile(): ReactElement | void {
  const { address } = useAccount();
  const { replace } = useRouter();

  if (address) {
    replace(`/voters/details?address=${address}`);
  }

  return (
    <Page>
      <div className="text-center flex flex-col items-center gap-2">
        <h1 className="text-xl font-bold">
          Connect your wallet to view your profile.
        </h1>
        <ConnectButton />
      </div>
    </Page>
  );
}
