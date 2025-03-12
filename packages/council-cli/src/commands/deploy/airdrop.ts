import { Airdrop } from "@delvtech/council-artifacts/Airdrop";
import { command } from "clide-js";
import { ownerOption } from "../../options/owner.js";
import { DeployOptions } from "../deploy.js";

export default command({
  description: "Deploy an Airdrop contract",

  options: {
    g: {
      ...ownerOption,
      alias: ["governance", ...ownerOption.alias],
    },
    r: {
      alias: ["root"],
      description: "The merkle root of the airdrop.",
      type: "string",
      customType: "hex",
      required: true,
    },
    t: {
      alias: ["token"],
      description: "The address of the ERC20 token contract.",
      type: "string",
      customType: "hex",
      required: true,
    },
    v: {
      alias: ["vault"],
      description:
        "The address of the locking vault contract that will be used when calling OptimisticRewards.claimAndDelegate().",
      type: "string",
      customType: "hex",
      required: true,
    },
    e: {
      alias: ["expiration"],
      description:
        "The expiration timestamp (in seconds) after which the funds can be reclaimed by the owner.",
      type: "number",
      required: true,
    },
  },

  handler: async ({ data, options, next }) => {
    const { account, deployer } = data as DeployOptions;

    const owner = (await options.owner()) || account.address;

    const root = await options.root({
      prompt: "Enter merkle root",
    });

    const token = await options.token({
      prompt: "Enter token address",
    });

    const vault = await options.vault({
      prompt: "Enter locking vault address",
    });

    const expiration = await options.expiration({
      prompt: "Enter expiration timestamp (in seconds)",
    });

    const deployedContract = await deployer.deploy({
      abi: Airdrop.abi,
      bytecode: Airdrop.bytecode,
      name: "Airdrop",
      args: {
        _expiration: BigInt(expiration),
        _governance: owner,
        _lockingVault: vault,
        _merkleRoot: root,
        _token: token,
      },
    });

    next(deployedContract);
  },
});
