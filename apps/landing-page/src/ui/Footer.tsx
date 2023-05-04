import { ReactElement } from "react";
import councilLogo from "src/assets/council-logo.svg";
import { DiscordIcon } from "src/ui/svg/DiscordIcon";
import { TwitterIcon } from "src/ui/svg/TwitterIcon";
import { YouTubeIcon } from "src/ui/svg/YouTubeIcon";

export function Footer(): ReactElement {
  return (
    <div className="relative overflow-hidden bg-black">
      <div className="relative max-w-6xl box-content px-[4vw] mx-auto lg:mx-auto py-20 flex gap-20 justify-between flex-wrap">
        <div className="flex flex-col justify-between gap-6">
          <img src={councilLogo} width={160} />
          <p>
            Built with 💜 by{" "}
            <span className="font-semibold text-primary-text">DELV</span>
          </p>
          <p className="text-sm">
            &copy; 2023 Element Finance Inc., dba DELV. All rights reserved
          </p>
        </div>
        <div className="flex flex-wrap gap-24">
          <div>
            <h2 className="mb-6 text-2xl">Build</h2>
            <ul className="space-y-4">
              <li>
                <a
                  href="https://github.com/delvtech/council"
                  className="transition-all text-primary-text hover:text-white"
                >
                  Council Contracts
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/delvtech/council-kit"
                  className="transition-all text-primary-text hover:text-white"
                >
                  Council Kit
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-6 text-2xl">Discover</h2>
            <ul className="space-y-4">
              <li>
                <a
                  href="https://github.com/delvtech/council-kit/wiki"
                  className="transition-all text-primary-text hover:text-white"
                >
                  Docs
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/playlist?list=PLUz3k1KZhOta3D_1_G2OMTNxczvfXk5jn"
                  className="transition-all text-primary-text hover:text-white"
                  target="_blank"
                  rel="noreferrer"
                >
                  Videos
                </a>
              </li>
              <li>
                <a
                  href="https://blog.delv.tech/"
                  className="transition-all text-primary-text hover:text-white"
                >
                  Articles
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="mb-6 text-2xl">Follow Us</h2>
            <ul className="space-y-4">
              <li>
                <a
                  href="https://discord.gg/srgcTGccGe"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 transition-all group text-primary-text hover:text-white"
                >
                  <DiscordIcon className="w-5 transition-all fill-primary-text group-hover:fill-white" />
                  Discord
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/delv_tech"
                  className="flex items-center gap-3 transition-all group text-primary-text hover:text-white"
                >
                  <TwitterIcon className="w-5 transition-all fill-primary-text group-hover:fill-white" />
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/playlist?list=PLUz3k1KZhOta3D_1_G2OMTNxczvfXk5jn"
                  className="flex items-center gap-3 transition-all group text-primary-text hover:text-white"
                >
                  <YouTubeIcon className="w-5 transition-all fill-primary-text group-hover:fill-white" />
                  YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
