import { ReactElement } from "react";
import councilLogo from "src/assets/council-logo.svg";
import { DiscordIcon } from "src/ui/svg/DiscordIcon";
import { TwitterIcon } from "src/ui/svg/TwitterIcon";
import { YouTubeIcon } from "src/ui/svg/YouTubeIcon";

export function Footer(): ReactElement {
  return (
    <div className="relative bg-black overflow-hidden">
      <div className="relative max-w-6xl box-border px-[4vw] mx-auto lg:mx-auto py-20 flex gap-20 justify-between">
        <div className="flex flex-col justify-between gap-6">
          <img src={councilLogo} width={160} />
          <p>
            Built with 💜 by{" "}
            <span className="font-semibold text-primary-text">Delve</span>
          </p>
          <p className="text-sm">&copy; 2023 Delve Inc. All rights reserved</p>
        </div>
        <div className="flex gap-24">
          <div>
            <h2 className="text-2xl mb-6">Build</h2>
            <ul className="space-y-4">
              <li>
                <a
                  href="https://github.com/element-fi/council"
                  className="text-primary-text hover:text-white transition-all"
                >
                  Council Contracts
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/element-fi/council-kit"
                  className="text-primary-text hover:text-white transition-all"
                >
                  Council Kit
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl mb-6">Discover</h2>
            <ul className="space-y-4">
              <li>
                <a
                  href="https://github.com/element-fi/council-kit/wiki"
                  className="text-primary-text hover:text-white transition-all"
                >
                  Docs
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/@elementfinance5026/featured"
                  className="text-primary-text hover:text-white transition-all"
                >
                  Videos
                </a>
              </li>
              <li>
                <a
                  href="https://blog.element.fi/"
                  className="text-primary-text hover:text-white transition-all"
                >
                  Articles
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl mb-6">Follow Us</h2>
            <ul className="space-y-4">
              <li>
                <a
                  href="https://discord.gg/7NB7D5uN"
                  className="group text-primary-text hover:text-white transition-all flex gap-3 items-center"
                >
                  <DiscordIcon className="w-5 fill-primary-text group-hover:fill-white transition-all" />
                  Discord
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/element_fi"
                  className="group text-primary-text hover:text-white transition-all flex gap-3 items-center"
                >
                  <TwitterIcon className="w-5 fill-primary-text group-hover:fill-white transition-all" />
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/@elementfinance5026"
                  className="group text-primary-text hover:text-white transition-all flex gap-3 items-center"
                >
                  <YouTubeIcon className="w-5 fill-primary-text group-hover:fill-white transition-all" />
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
