import { ReactElement } from "react";

import { BuildingLibraryIcon, WalletIcon } from "@heroicons/react/20/solid";
import AirdropIcon from "src/ui/airdrop/AirdropIcon";

export default function AirdropPage(): ReactElement {
  return (
    <section className="mx-auto max-w-4xl flex flex-col justify-center gap-5 mt-10 text-center">
      <h1 className="text-4xl font-bold">Airdrop Claim</h1>
      <ul className="daisy-steps w-1/4 m-auto text-sm">
        <li data-content="1" className="daisy-step daisy-step-neutral">
          Deposit or Claim
        </li>
        <li data-content="2" className="daisy-step daisy-step-neutral">
          Choose account
        </li>
        <li data-content="3" className="daisy-step daisy-step-neutral">
          Confirm
        </li>
      </ul>
      <div className="p-10 mx-auto">
        <h5 className="text-md m-3">You&apos;ve been airdropped</h5>
        <span className="flex justify-center p-5 rounded-lg bg-zinc-200 w-52 items-center gap-3">
          <AirdropIcon className="h-5 w-5" fillClass="fill-black" />
          <span className="text-2xl font-bold">
            2,000.0<span className="text-sm mx-1">MVT</span>
          </span>
        </span>
      </div>
      <p className="mx-auto max-w-lg text-sm">
        These tokens can be <b>deposited</b> into the locking vault for
        immediate voting power or <b>claimed</b> directly to a wallet.
      </p>
      <div className="flex justify-center gap-2">
        <button className="flex text-sm uppercase whitespace-nowrap gap-2 items-center rounded-md px-10 py-2 bg-black text-white">
          <BuildingLibraryIcon className="w-5 h-5 fill-white" />
          Deposit
        </button>
        <button className="flex text-sm uppercase whitespace-nowrap gap-2 items-center rounded-md px-10 py-2 bg-zinc-200">
          <WalletIcon className="w-5 h-5 fill-black" />
          Claim
        </button>
      </div>
    </section>
  );
}
