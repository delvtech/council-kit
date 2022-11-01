import { useRouter } from "next/router";

export default function Vault() {
  const router = useRouter();
  const { address } = router.query;
  return <div>{address}</div>;
}
