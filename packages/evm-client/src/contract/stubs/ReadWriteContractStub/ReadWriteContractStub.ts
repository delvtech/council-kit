import {
  ContractWriteOptions,
  IReadWriteContract,
} from "src/contract/IReadWriteContract";
import { ReadContractStub } from "src/contract/stubs/ReadContractStub/ReadContractStub";
import { Abi } from "abitype";
import { FunctionArgs, FunctionName } from "src/base/abitype";
import { stub } from "sinon";

/**
 * A mock implementation of a writable Ethereum contract designed for unit
 * testing purposes. The `ReadWriteContractStub` extends the functionalities of
 * `ReadContractStub` and provides capabilities to stub out specific
 * contract write behaviors. This makes it a valuable tool when testing
 * scenarios that involve contract writing operations, without actually
 * interacting with a real Ethereum contract.
 *
 * @example
 * const contract = new ReadWriteContractStub(ERC20ABI);
 * contract.stubWrite("addLiquidity", 100n);
 *
 * const result = await contract.write("addLiquidity", []); // 100n
 * @extends {ReadContractStub<TAbi>}
 * @implements {IReadWriteContract<TAbi>}
 */
export class ReadWriteContractStub<TAbi extends Abi = Abi>
  extends ReadContractStub<TAbi>
  implements IReadWriteContract<TAbi>
{
  /**
   * Simulates a contract write operation for a given function. If the function
   * is not previously stubbed using `stubWrite` from the parent class, an error
   * will be thrown.
   */
  write = stub().callsFake(
    <TFunctionName extends FunctionName<TAbi, "nonpayable" | "payable">>(
      functionName: TFunctionName,
      args: FunctionArgs<TAbi, TFunctionName>,
      options?: ContractWriteOptions,
    ) => {
      const stub = this.writeStubMap.get(functionName);
      if (!stub) {
        throw new Error(
          `Called write for ${functionName} on a stubbed contract without a return value. The function must be stubbed first:\n\tcontract.stubWrite("${functionName}", value)`,
        );
      }
      return stub(args, options);
    },
  );
}
