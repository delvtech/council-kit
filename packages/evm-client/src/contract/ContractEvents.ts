import { Abi } from "abitype";
import { EventName, EventFilter, EventArgs } from "src/base/abitype";
import { BlockTag } from "src/network/BlockTag";

export interface ContractGetEventsOptions<
  TAbi extends Abi,
  TEventName extends EventName<TAbi> = EventName<TAbi>,
> {
  filter?: EventFilter<TAbi, TEventName>;
  fromBlock?: bigint | BlockTag;
  toBlock?: bigint | BlockTag;
}
/**
 * A strongly typed event object based on an abi
 */

export interface ContractEvent<
  TAbi extends Abi,
  TEventName extends EventName<TAbi> = EventName<TAbi>,
> {
  eventName: TEventName;
  args: EventArgs<TAbi, TEventName>;
  data?: `0x${string}`;
  blockNumber?: bigint;
  transactionHash?: `0x${string}`;
}
