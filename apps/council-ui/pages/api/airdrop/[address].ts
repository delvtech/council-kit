import { NextApiRequest, NextApiResponse } from "next";
import merkleRewardsJSON from "./sample-merkle-rewards-tree.json";

interface MerkleRewards {
  root: string;
  rewardsTotal: string;
  uniqueAccountsTotal: number;
  accounts: {
    [address: string]: {
      amount: string;
      proof: string[];
    };
  };
}

const merkleRewards: MerkleRewards = merkleRewardsJSON;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): void {
  const { address } = req.query;

  if (typeof address === "string") {
    const info = merkleRewards.accounts[address.toLowerCase()];

    if (info) {
      res.status(200).json(info);
    } else {
      res.status(404).json({ error: `Address not found: ${address}` });
    }

    return;
  }

  if (Array.isArray(address)) {
    res
      .status(400)
      .json({ error: `Address must be single value. Received: ${address}` });
    return;
  }

  res.status(400).json({ error: `Invalid address: ${address}` });
}
