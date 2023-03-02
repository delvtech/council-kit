import { Contract, ContractFunction } from "ethers";
import { stub, SinonStub } from "sinon";

// TODO: refactor for ethers v6

interface ContractMethodBucket {
  [name: string]: ContractFunction;
}

type StubbedMethodBucket<F extends ContractMethodBucket> = {
  [K in keyof F]: SinonStub<Parameters<F[K]>, ReturnType<F[K]>>;
};

type StubbedContract<C extends Contract> = Omit<
  C,
  | "callStatic"
  | "functions"
  | "estimateGas"
  | "populateTransaction"
  | "queryFilter"
> & {
  callStatic: StubbedMethodBucket<C["callStatic"]>;
  functions: StubbedMethodBucket<C["functions"]>;
  estimateGas: StubbedMethodBucket<C["estimateGas"]>;
  populateTransaction: StubbedMethodBucket<C["populateTransaction"]>;
  queryFilter: SinonStub<
    Parameters<C["queryFilter"]>,
    ReturnType<C["queryFilter"]>
  >;
};

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
