import {
  ContractGetEventsOptions,
  Event,
  EventName,
  Network,
  ReadContract,
} from "@delvtech/evm-client";
import { Abi } from "abitype";

/**
 * Fetch events from a contract, splitting the range of blocks in half and
 * sending 2 smaller requests if the original request fails. This repeats
 * until the attempts are exhausted.
 */
export async function getEventsWithSplitAndRetry<
  TAbi extends Abi,
  TEventName extends EventName<TAbi>,
>({
  eventName,
  contract,
  network,
  attemptsLeft,
  options,
}: {
  eventName: TEventName;
  contract: ReadContract<TAbi>;
  network: Network;
  attemptsLeft: number;
  options?: ContractGetEventsOptions<TAbi, TEventName>;
}): Promise<Event<TAbi, TEventName>[]> {
  if (attemptsLeft <= 0) {
    throw new Error(`Max attempts reached for fetching events: ${eventName}`);
  }

  return contract.getEvents(eventName, options).catch(async (error) => {
    let fromBlock = options?.fromBlock;
    let toBlock = options?.toBlock;

    // Unable to make ranges with these blocks
    if (typeof fromBlock === "string" && fromBlock !== "earliest") {
      throw new Error(
        `Unable to split block range with fromBlock: ${fromBlock}, for event: ${eventName}\n\n${error.message}`,
      );
    }
    if (typeof toBlock === "string" && toBlock === "earliest") {
      throw new Error(
        `Unable to split block range with toBlock: ${toBlock}, for event: ${eventName}\n\n${error.message}`,
      );
    }

    // Set default values for fromBlock and toBlock
    if (typeof fromBlock !== "bigint") {
      fromBlock = 0n;
    }
    if (typeof toBlock !== "bigint") {
      const block = await network.getBlock();
      if (!block?.blockNumber) {
        throw new Error(
          `Unable to get latest block for event: ${eventName}\n\n${error.message}`,
        );
      }
      toBlock = block.blockNumber;
    }

    // No range to split
    if (fromBlock === toBlock) {
      throw error;
    }

    const middleBlock = (fromBlock + toBlock) / 2n;

    console.warn("Failed to fetch events:", {
      address: contract.address,
      eventName,
      options,
      attemptsLeft,
    });

    const firstHalf = await getEventsWithSplitAndRetry({
      eventName,
      contract,
      network,
      options: {
        ...options,
        fromBlock,
        toBlock: middleBlock,
      },
      attemptsLeft: attemptsLeft - 1,
    });
    const secondHalf = await getEventsWithSplitAndRetry({
      eventName,
      contract,
      network,
      options: {
        ...options,
        fromBlock: middleBlock + 1n,
        toBlock,
      },
      attemptsLeft: attemptsLeft - 1,
    });

    return firstHalf.concat(secondHalf);
  });
}
