import { Contract, ContractFunction } from "ethers";
import { stub, SinonStub } from "sinon";

// TODO: refactor for ethers v6 (and viem? https://viem.sh/)

/**
 * An object with `ContractFunction` methods on it.
 */
interface ContractMethodBucket {
  [name: string]: ContractFunction;
}

/**
 * Get a stubbed version of a method bucket where each method is a `SinonStub`
 */
type StubbedMethodBucket<F extends ContractMethodBucket> = {
  [K in keyof F]: SinonStub<Parameters<F[K]>, ReturnType<F[K]>>;
};

/**
 * Get a stubbed version of a contract where every method is a `SinonStub`
 */
type StubbedContract<C extends Contract> = C & {
  // Replace all direct method types with a typed `SinonStub`
  [K in keyof StubbedMethodBucket<C["functions"]>]: SinonStub<
    Parameters<StubbedMethodBucket<C["functions"]>[K]>,
    ReturnType<StubbedMethodBucket<C["functions"]>[K]>
  >;
} & {
  // Replace the method types in method buckets
  callStatic: StubbedMethodBucket<C["callStatic"]>;
  functions: StubbedMethodBucket<C["functions"]>;
  estimateGas: StubbedMethodBucket<C["estimateGas"]>;
  populateTransaction: StubbedMethodBucket<C["populateTransaction"]>;
  // replace the `queryFilter` method with a typed `SinonStub`
  queryFilter: SinonStub<
    Parameters<C["queryFilter"]>,
    ReturnType<C["queryFilter"]>
  >;
};

/**
 * Get a stubbed version of an [Ethers](https://docs.ethers.org/v5/) contract
 * instance where every method is replaced with a [Sinon
 * stub](https://sinonjs.org/releases/v15/stubs/).
 * @param contract
 * @returns
 */
export function stubContract<C extends Contract>(
  contract: C,
): StubbedContract<C> {
  const callStatic: Record<string, () => SinonStub> = {};
  const functions: Record<string, () => SinonStub> = {};
  const estimateGas: Record<string, () => SinonStub> = {};
  const populateTransaction: Record<string, () => SinonStub> = {};

  Object.keys(contract.callStatic).forEach((methodName) => {
    callStatic[methodName] = stub().callsFake(() => {
      throw new Error(
        `This is an unhandled error calling "callStatic.${methodName}" in the test.`,
      );
    });
  });

  Object.keys(contract.functions).forEach((methodName) => {
    functions[methodName] = stub().callsFake(() => {
      throw new Error(
        `This is an unhandled error calling "functions.${methodName}" in the test.`,
      );
    });
  });

  Object.keys(contract.estimateGas).forEach((methodName) => {
    estimateGas[methodName] = stub().callsFake(() => {
      throw new Error(
        `This is an unhandled error calling "estimateGas.${methodName}" in the test.`,
      );
    });
  });

  Object.keys(contract.populateTransaction).forEach((methodName) => {
    populateTransaction[methodName] = stub().callsFake(() => {
      throw new Error(
        `This is an unhandled error calling "populateTransaction.${methodName}" in the test.`,
      );
    });
  });

  return {
    ...contract,
    // ...functions,
    callStatic: callStatic as StubbedMethodBucket<C["callStatic"]>,
    functions: functions as StubbedMethodBucket<C["functions"]>,
    estimateGas: estimateGas as StubbedMethodBucket<C["estimateGas"]>,
    populateTransaction: populateTransaction as StubbedMethodBucket<
      C["populateTransaction"]
    >,
    queryFilter: stub().callsFake(() => {
      throw new Error(
        `This is an unhandled error calling "queryFilter" in the test.`,
      );
    }) as SinonStub<Parameters<C["queryFilter"]>, ReturnType<C["queryFilter"]>>,
  };
}
