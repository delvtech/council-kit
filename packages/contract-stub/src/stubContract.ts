import { Contract } from "ethers";
import { stub, SinonStub } from "sinon";

type StubbedOverwrite<
  F extends
    | Contract["callStatic"]
    | Contract["functions"]
    | Contract["estimateGas"],
> = {
  [K in keyof F]: SinonStub<Parameters<F[K]>, ReturnType<F[K]>>;
};

type StubbedContract<C extends Contract> = C & {
  callStatic: StubbedOverwrite<C["callStatic"]>;
  functions: StubbedOverwrite<C["functions"]>;
  estimateGas: StubbedOverwrite<C["estimateGas"]>;
  queryFilter: SinonStub<
    Parameters<C["queryFilter"]>,
    ReturnType<C["queryFilter"]>
  >;
};

export function stubContract<TContract extends Contract>(
  contract: TContract,
): StubbedContract<TContract> {
  const callStatic: Record<string, () => SinonStub> = {};
  const functions: Record<string, () => SinonStub> = {};
  const estimateGas: Record<string, () => SinonStub> = {};

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

  return {
    ...contract,
    callStatic,
    estimateGas,
    functions,
    // TODO: populateTransaction
    queryFilter: stub().callsFake(() => {
      throw new Error(
        `This is an unhandled error calling "queryFilter" in the test.`,
      );
    }),
  } as StubbedContract<TContract>;
}
