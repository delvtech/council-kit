import "@rainbow-me/rainbowkit/styles.css";
import { useRouter } from "next/router";
import { ReactElement } from "react";

export default function Voter(): ReactElement {
  const { query } = useRouter();
  const { id } = query;

  return <div>{id}</div>;
}
