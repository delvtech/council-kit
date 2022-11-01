import { useRouter } from "next/router";
import { ReactElement } from "react";

export default function Vault(): ReactElement {
  const router = useRouter();
  const { address } = router.query;
  return <div>{address}</div>;
}
