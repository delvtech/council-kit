import {
  CodeBracketIcon,
  NewspaperIcon,
  PlayCircleIcon,
} from "@heroicons/react/20/solid";
import { Bars3Icon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import { ReactElement } from "react";
import councilLogo from "src/assets/council-logo.svg";
import { getButtonClassName, LinkButton } from "src/ui/Button";
import { GitHubIcon } from "src/ui/svg/GitHubIcon";

export function Navigation(): ReactElement {
  return (
    <div className="group sticky top-0 py-6 px-[4vw] md:px-10 flex justify-between bg-dark/90 backdrop-blur z-10">
      <img src={councilLogo} alt="Council" />

      {/* Dropdown Menu */}
      <div className="block md:hidden relative">
        <label
          tabIndex={0}
          className={classNames(
            getButtonClassName("stroke"),
            "cursor-pointer md:hidden",
          )}
        >
          <Bars3Icon className="w-6" />
        </label>

        <ul
          tabIndex={0}
          className="ml-auto hidden group-focus-within:flex focus-within:flex absolute top-full right-0 bg-white z-10 flex-col rounded-2xl overflow-hidden p-1 md:hidden [&>*]:overflow-hidden [&>:first-child]:rounded-t-xl [&>:last-child]:rounded-b-xl"
        >
          <li>
            <a
              href="https://github.com/delvtech/council-kit/wiki"
              target="_blank"
              rel="noreferrer"
              className="whitespace-nowrap flex gap-2 items-center px-8 h-11 text-black transition-all hover:bg-primary hover:text-white [&>*]:hover:fill-white"
            >
              <CodeBracketIcon className="fill-primary-text w-5" />
              Docs
            </a>
          </li>
          <li>
            <a
              href="https://www.youtube.com/playlist?list=PLUz3k1KZhOta3D_1_G2OMTNxczvfXk5jn"
              target="_blank"
              rel="noreferrer"
              className="whitespace-nowrap flex gap-2 items-center px-8 h-11 text-black transition-all hover:bg-primary hover:text-white [&>*]:hover:fill-white"
            >
              <PlayCircleIcon className="fill-primary-text w-5" />
              Videos
            </a>
          </li>
          <li>
            <a
              href="https://blog.delv.tech/"
              target="_blank"
              rel="noreferrer"
              className="whitespace-nowrap flex gap-2 items-center px-8 h-11 text-black transition-all hover:bg-primary hover:text-white [&>*]:hover:fill-white"
            >
              <NewspaperIcon className="fill-primary-text w-5" />
              Articles
            </a>
          </li>
          <li>
            <a
              href="https://github.com/delvtech/council-kit"
              target="_blank"
              rel="noreferrer"
              className="whitespace-nowrap flex gap-2 items-center px-8 h-11 text-black transition-all hover:bg-primary hover:text-white [&>*]:hover:fill-white"
            >
              <GitHubIcon className="fill-primary-text w-5" />
              GitHub
            </a>
          </li>
        </ul>
      </div>

      {/* Medium+ Screen Menu */}
      <ul tabIndex={0} className="ml-auto gap-4 hidden md:flex">
        <li>
          <LinkButton
            href="https://github.com/delvtech/council-kit/wiki"
            target="_blank"
            variant="stroke"
          >
            <CodeBracketIcon className="fill-primary-text w-5" />
            Docs
          </LinkButton>
        </li>
        <li>
          <LinkButton
            href="https://www.youtube.com/playlist?list=PLUz3k1KZhOta3D_1_G2OMTNxczvfXk5jn"
            target="_blank"
            variant="stroke"
          >
            <PlayCircleIcon className="fill-primary-text w-5" />
            Videos
          </LinkButton>
        </li>
        <li>
          <LinkButton
            href="https://blog.delv.tech/"
            target="_blank"
            variant="stroke"
          >
            <NewspaperIcon className="fill-primary-text w-5" />
            Articles
          </LinkButton>
        </li>
        <li>
          <LinkButton
            href="https://github.com/delvtech/council-kit"
            target="_blank"
            variant="stroke"
          >
            <GitHubIcon className="fill-primary-text w-5" />
            GitHub
          </LinkButton>
        </li>
      </ul>
    </div>
  );
}
