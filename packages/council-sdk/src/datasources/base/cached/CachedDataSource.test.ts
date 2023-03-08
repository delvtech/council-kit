import { expect, jest, test } from "@jest/globals";
import { CouncilContext } from "src/context/context";
import { mockProvider } from "src/testing/mockProvider";
import { CachedDataSource } from "./CachedDataSource";

test("Caches values correctly", () => {
  const { dataSource, key, callBack, returnValue } = setup();

  const value = dataSource.cached(key, callBack);
  const valueAgain = dataSource.cached(key, callBack);

  expect(callBack.mock.calls).toHaveLength(1);

  expect(value).toEqual(returnValue);
  expect(valueAgain).toEqual(returnValue);
  expect(valueAgain).toBe(value);
});

test("Deletes cache entries correctly", () => {
  const { dataSource, key, callBack } = setup();

  dataSource.cached(key, callBack);
  dataSource.deleteCached(key);
  dataSource.cached(key, callBack);

  expect(callBack.mock.calls).toHaveLength(2);
});

test("Clears cache correctly", () => {
  const { dataSource, key, callBack } = setup();

  const key2 = "key2";
  const returnValue2 = "foo2";
  const callBack2 = jest.fn(() => returnValue2);

  dataSource.cached(key, callBack);
  dataSource.cached(key2, callBack2);

  dataSource.clearCached();

  dataSource.cached(key, callBack);
  dataSource.cached(key2, callBack2);

  expect(callBack.mock.calls).toHaveLength(2);
  expect(callBack2.mock.calls).toHaveLength(2);
});

function setup() {
  const context = new CouncilContext(mockProvider);
  const dataSource = new CachedDataSource(context);

  const key = ["foo", 0, ["foo"], { foo: "baz" }];
  const returnValue = { foo: "foo" };
  const callBack = jest.fn(() => returnValue);

  return {
    context,
    dataSource,
    key,
    returnValue,
    callBack,
  };
}
