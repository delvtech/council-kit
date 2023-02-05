import { IVotingVault, IVotingVault__factory } from "@council/typechain";
import { Provider } from "@ethersproject/abstract-provider";
import { QueryClient } from "@tanstack/query-core";
import { BigNumber, BytesLike } from "ethers";
import { makeQueryKey } from "src/prototypes/v2/base/makeQueryKey";
import { makeQueryObject } from "src/prototypes/v2/base/makeQueryObject";
import { QueryObject } from "src/prototypes/v2/base/QueryObject";

export class VotingVaultQueries {
  address: string;
  private contractInstance: IVotingVault;
  private queryClient: QueryClient;
  private provider: Provider;

  constructor(address: string, queryClient: QueryClient, provider: Provider) {
    this.queryClient = queryClient;
    this.provider = provider;
    this.address = address;
    this.contractInstance = IVotingVault__factory.connect(address, provider);
  }

  getQueryVotePower(
    address: string,
    blockNumber: number,
    extraData?: BytesLike,
  ): QueryObject<BigNumber> {
    return makeQueryObject(this.queryClient, {
      queryKey: makeQueryKey(this.address, "getQueryVotePower", {
        address,
        blockNumber,
        extraData: extraData || "0x00",
      }),
      queryFn: async () => {
        return this.contractInstance.callStatic.queryVotePower(
          address,
          blockNumber,
          extraData || "0x00",
        );
      },
      // queryVotePower data never changes since it's tied to blockNumber
      staleTime: Infinity,
    });
  }
}
