import { ReadWriteCouncil } from "@delvtech/council-viem";
import { elementAddresses } from "src/addresses/ElementMainnetAddressList";
import { publicClient, walletClient } from "src/client";

// wrap the script in an async function so we can await promises
export async function getGSCMembers(): Promise<void> {
  if (!walletClient) {
    throw new Error(
      "Wallet client not available. Ensure the WALLET_PRIVATE_KEY environment variable is set.",
    );
  }

  // create a ReadWriteCouncil instance
  const council = new ReadWriteCouncil({ publicClient, walletClient });

  // create a ReadGscVault instance
  const gscVault = council.gscVault(elementAddresses.gscVault); // <-- replace with the LockingVault contract address

  // get all members
  const members = await gscVault.getMembers();

  // create an array of member stat objects
  const memberStats = [];
  for (const member of members) {
    console.log("fetching", member.address);

    // get the voting vaults that were used to prove the member meets the
    // minimum voting power requirement
    const votingPowerVaults = await gscVault.getMemberVaults({
      account: member.address,
    });

    memberStats.push({
      address: member.address,
      joinDate: await gscVault.getJoinDate({ account: member.address }),
      votingPower: await member.getVotingPower({ vaults: votingPowerVaults }),
    });
  }

  console.table(memberStats);

  process.exit();
}

getGSCMembers();
