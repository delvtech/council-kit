import { council } from "src/client";

const gscVault = council.gscVault("0x"); // <-- replace address

// get all members
const members = await gscVault.getMembers();

// create an array of member stat objects
const memberStats = [];
for (const member of members) {
  console.log("fetching", member);

  // get the voting vaults that were used to prove the member meets the
  // minimum voting power requirement
  const votingPowerVaults = await gscVault.getMemberVaults(member);
  const votingPowers = await Promise.all(
    votingPowerVaults.map((vault) => vault.getVotingPower({ voter: member })),
  );

  memberStats.push({
    address: member,
    joinDate: await gscVault.getJoinDate(member),
    votingPower: votingPowers.reduce((a, b) => a + b, 0n),
  });
}

console.table(memberStats);

process.exit();
