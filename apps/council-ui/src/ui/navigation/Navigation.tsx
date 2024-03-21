import { ConnectButton } from "@rainbow-me/rainbowkit";
import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import { makeVoterURL, Routes } from "src/routes";
import { useClaimableAirdropAmount } from "src/ui/airdrop/hooks/useClaimableAirdropAmount";
import { makeImgSrc } from "src/ui/base/imgSrc";
import { AirdropIcon } from "src/ui/base/svg/20/AirdropIcon";
import PushIcon from "src/ui/base/svg/PushLogo";
import { Tooltip } from "src/ui/base/Tooltip";
import { useWrongNetworkEffect } from "src/ui/network/hooks/useWrongNetworkEffect";
import { usePushSubscribe } from "src/ui/push/usePushSubscribe";
import { useAccount } from "wagmi";

export function Navigation(): ReactElement {
  const { address } = useAccount();
  const { pathname, query } = useRouter();
  const { toggleUserStatus, loading, isSubscribed } = usePushSubscribe();
  const { claimableAmount } = useClaimableAirdropAmount();

  useWrongNetworkEffect();

  return (
    <div className="daisy-navbar bg-base-200 ">
      <div className="daisy-navbar-start">
        <div className="daisy-dropdown">
          <label tabIndex={0} className="daisy-btn daisy-btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="daisy-menu daisy-dropdown-content mt-3 w-52 rounded-box bg-base-200 p-2 shadow"
          >
            <li>
              <Link
                className={classNames({
                  "daisy-active": pathname.startsWith(Routes.PROPOSALS),
                })}
                href={Routes.PROPOSALS}
              >
                proposals
              </Link>
            </li>
            <li>
              <Link
                className={classNames({
                  "daisy-active": pathname.startsWith(Routes.VAULTS),
                })}
                href={Routes.VAULTS}
              >
                vaults
              </Link>
            </li>
            <li>
              <Link
                className={classNames({
                  "daisy-active":
                    pathname.startsWith(Routes.VOTERS) &&
                    address !== query.address,
                })}
                href={Routes.VOTERS}
              >
                voters
              </Link>
            </li>
            {address && (
              <li>
                <Link
                  className={classNames({
                    "daisy-active":
                      pathname.startsWith(Routes.VOTERS) &&
                      address === query.address,
                  })}
                  href={makeVoterURL(address)}
                >
                  profile
                </Link>
              </li>
            )}
          </ul>
        </div>
        <div className="ml-2 whitespace-nowrap text-xl text-base-content">
          <img
            src={makeImgSrc("elementIcon.svg")}
            height="48"
            width="48"
            alt="Element DAO"
          />
        </div>
      </div>

      <div className="daisy-navbar-center hidden lg:flex">
        <ul className="daisy-menu daisy-menu-horizontal px-1">
          <li>
            <Link
              className={classNames("px-4 py-3 font-medium", {
                "!text-primary": pathname.startsWith(Routes.PROPOSALS),
              })}
              href={Routes.PROPOSALS}
            >
              proposals
            </Link>
          </li>
          <li>
            <Link
              className={classNames("px-4 py-3 font-medium", {
                "!text-primary": pathname.startsWith(Routes.VAULTS),
              })}
              href={Routes.VAULTS}
            >
              vaults
            </Link>
          </li>
          <li>
            <Link
              className={classNames("px-4 py-3 font-medium", {
                "!text-primary":
                  pathname.startsWith(Routes.VOTERS) &&
                  address !== query.address,
              })}
              href={Routes.VOTERS}
            >
              voters
            </Link>
          </li>
          {address && (
            <li>
              <Link
                className={classNames("px-4 py-3 font-medium", {
                  "!text-primary":
                    pathname.startsWith(Routes.VOTERS) &&
                    address === query.address,
                })}
                href={makeVoterURL(address)}
              >
                profile
              </Link>
            </li>
          )}
        </ul>
      </div>
      <div className="daisy-navbar-end flex gap-3">
        {address && toggleUserStatus && (
          <Tooltip
            content={`Subscribe to start recieving updates as notifications from PUSH`}
          >
            <span className="hidden lg:inline">
              <button
                className="daisy-btn daisy-btn-ghost mr-4"
                onClick={toggleUserStatus}
                disabled={loading}
              >
                <PushIcon />
                {isSubscribed ? "Opt-out" : "Opt-in"}
              </button>
            </span>
          </Tooltip>
        )}
        {!!claimableAmount && (
          <Link
            href={"/airdrop"}
            className="group flex items-center gap-2 whitespace-nowrap rounded-xl bg-accent px-5 py-2 text-sm font-bold md:bg-white"
          >
            <span className="text-accent-content md:text-accent">
              <AirdropIcon />
            </span>
            <span className="hidden text-accent-content md:block md:text-gray-800">
              Claim airdrop
            </span>
          </Link>
        )}
        <ConnectButton />
      </div>
    </div>
  );
}
