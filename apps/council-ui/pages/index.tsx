import "@rainbow-me/rainbowkit/styles.css";
import Link from "next/link";
import { ReactElement } from "react";

export default function Index(): ReactElement {
  return (
    <div className="max-w-3xl p-10 m-auto mt-16 space-y-8">
      <h1 className="text-5xl text-accent-content">
        <span className="text-accent">Council</span> is a decentralized
        governance system that allows a community to manage a DAO.
      </h1>
      <p className="text-2xl">
        The <span className="text-secondary">governance </span>system is
        designed to enable flexibility, improvements, and experimentation while
        successfully maintaining the security and robustness of the governed
        protocol.
      </p>
      a
      <div className="space-x-4">
        <Link href="/proposals">
          <button className="daisy-btn daisy-btn-accent">Open App</button>
        </Link>
        <a
          href="https://github.com/element-fi/council-monorepo"
          rel="noopener noreferrer"
          target="_blank"
        >
          <button className="daisy-btn daisy-btn-secondary">Github</button>
        </a>
      </div>
    </div>
  );
}
