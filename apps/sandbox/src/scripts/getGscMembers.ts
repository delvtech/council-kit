import { fixed } from "@delvtech/fixed-point-wasm";
import { council } from "src/client";

const gscVault = council.gscVault("0x"); // <-- replace address

// get all members
const members = await gscVault.getMembers();

// create an array of member stat objects
const memberStats = await Promise.all(
  members.map(async (member) => {
    console.log("fetching", member);

    const [joinDate, qualifyingVaults] = await Promise.all([
      gscVault.getJoinDate(member),
      gscVault.getMemberVaults(member),
    ]);

    // get the voting vaults that were used to prove the member meets the
    // minimum voting power requirement
    const votingPowers = await Promise.all(
      qualifyingVaults.map((vault) => vault.getVotingPower({ voter: member })),
    );
    const totalVotingPower = votingPowers.reduce((a, b) => a + b, 0n);

    return {
      member,
      joinDate,
      votingPower: fixed(totalVotingPower).format(),
    };
  }),
);

console.table(memberStats);

process.exit();
