import { ReadVotingVault } from "@delvtech/council-js";
import { council, drift } from "src/client";

const coreVoting = council.coreVoting(
  "0xEaCD577C3F6c44C3ffA398baaD97aE12CDCFed4a",
);

const vestingVault = new ReadVotingVault({
  address: "0x6De73946eab234F1EE61256F10067D713aF0e37A",
  drift,
});

const currentBlock = await drift.getBlockNumber();
const votingPower = await vestingVault.getVotingPower({
  voter: "0x3E3EDe36Ae478082C07e353D4fC36831100acF87",
  block: currentBlock,
  extraData: "0x",
});
console.log(votingPower);

const decoded = vestingVault.contract.decodeFunctionData(
  "0xe91f32350000000000000000000000003e3ede36ae478082c07e353d4fc36831100acf8700000000000000000000000000000000000000000000000000000000014f637d00000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000000",
);
console.log(decoded);
