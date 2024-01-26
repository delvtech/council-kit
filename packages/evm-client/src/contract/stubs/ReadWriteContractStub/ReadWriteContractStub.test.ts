import { IERC20 } from "src/base/IERC20";
import { ReadWriteContractStub } from "src/contract/stubs/ReadWriteContractStub/ReadWriteContractStub";
import { expect, test } from "vitest";
const ERC20ABI = IERC20.abi;
test("It stubs the write function", async () => {
  const contract = new ReadWriteContractStub(ERC20ABI);

  const stubbedValue = [true] as const;
  contract.stubWrite("transfer", stubbedValue);

  const value = await contract.write("transfer", [true]);
  expect(value).toBe(stubbedValue);

  const stub = contract.getWriteStub("transfer");
  expect(stub?.callCount).toBe(1);
});
