import { Contract, ContractFunction, Signer, providers } from "ethers";
import { stub, SinonStub } from "sinon";

// TODO: refactor for ethers v6 (and viem? https://viem.sh/)

/**
 * An object with `ContractFunction` methods on it.
 */
export interface ContractMethodBucket {
  [name: string]: ContractFunction;
}

/**
 * Get a stubbed version of a method bucket where each method is a `SinonStub`
 */
export type StubbedMethodBucket<F extends ContractMethodBucket> = {
  [K in keyof F]: SinonStub<Parameters<F[K]>, ReturnType<F[K]>>;
};

/**
 * Get a stubbed version of a contract where every method is a `SinonStub`
 */
export type StubbedContract<C extends Contract = Contract> = C & {
  // Replace all direct method types with a typed `SinonStub`
  [K in keyof C["functions"]]: SinonStub<Parameters<C[K]>, ReturnType<C[K]>>;
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
  connect: (
    signerOrProvider: Signer | providers.Provider | string,
  ) => StubbedContract;
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
  const overrides = {
    callStatic: {},
    functions: {},
    estimateGas: {},
    populateTransaction: {},
    queryFilter: stub().callsFake(() => {
      throw new Error(
        `This is an unhandled error calling "queryFilter" in the test.`,
      );
    }),
    connect(signerOrProvider: Signer | providers.Provider | string) {
      const stubbedContract = stubContract<Contract>(contract);
      // use the same stubs from the original
      Object.assign(stubbedContract, {
        functions: { ...this.functions },
        callStatic: { ...this.callStatic },
        estimateGas: { ...this.estimateGas },
        populateTransaction: { ...this.populateTransaction },
        queryFilter: this.queryFilter,
      });
      for (const method of Object.keys(this.functions)) {
        Object.assign(stubbedContract, { [method]: this[method] });
      }
      return stubbedContract;
    },
  } as StubbedContract;

  Object.keys(contract.callStatic).forEach((methodName) => {
    overrides.callStatic[methodName] = stub().callsFake(() => {
      throw new Error(
        `This is an unhandled error calling "callStatic.${methodName}" in the test.`,
      );
    });
  });

  Object.keys(contract.functions).forEach((methodName) => {
    overrides[methodName] = stub().callsFake(() => {
      throw new Error(
        `This is an unhandled error calling "${methodName}" in the test.`,
      );
    });
    overrides.functions[methodName] = stub().callsFake(() => {
      throw new Error(
        `This is an unhandled error calling "functions.${methodName}" in the test.`,
      );
    });
  });

  Object.keys(contract.estimateGas).forEach((methodName) => {
    overrides.estimateGas[methodName] = stub().callsFake(() => {
      throw new Error(
        `This is an unhandled error calling "estimateGas.${methodName}" in the test.`,
      );
    });
  });

  Object.keys(contract.populateTransaction).forEach((methodName) => {
    overrides.populateTransaction[methodName] = stub().callsFake(() => {
      throw new Error(
        `This is an unhandled error calling "populateTransaction.${methodName}" in the test.`,
      );
    });
  });

  const contractPrototype = Object.getPrototypeOf(contract);
  const clone = Object.create(contractPrototype);
  Object.assign(clone, contract.connect(contract.provider), overrides);

  return clone as StubbedContract<C>;
}
