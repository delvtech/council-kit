import { CouncilContext, GSCVault } from "@council/sdk";
import { getElementAddress } from "src/addresses/elementAddresses";
import { provider } from "src/provider";

// wrap the script in an async function so we can await promises
export async function getGSCMembers(): Promise<void> {
  const addresses = await getElementAddress();

  // create a CouncilContext instance
  const context = new CouncilContext(provider);

  // create a GSCVault instance
  const gscVault = new GSCVault(addresses.gscVault, context);

  // get all members
  const members = await gscVault.getMembers();

  // create an array of member stat objects
  const memberStats = [];
  for (const member of members) {
    console.log("fetching", member.address);

    // get the  voting vaults used to prove the member meets the minimum voting
    // power requirement
    const votingPowerVaults = await gscVault.getMemberVaults(member.address);

    memberStats.push({
      address: member.address,
      joinDate: await gscVault.getJoinDate(member.address),
      votingPower: await member.getVotingPower(votingPowerVaults),
    });
  }

  console.table(memberStats);

  process.exit();
}

getGSCMembers();
