import { expect, test } from "@jest/globals";
import { MockDataSource } from "src/datasources/mocks/MockDataSource";
import { mockProvider } from "src/testing/mockProvider";
import { CouncilContext } from "./context";

test("gets data sources correctly", () => {
  const context = new CouncilContext(mockProvider);
  const dataSource = new MockDataSource(0, context);
  context.registerDataSource({}, dataSource);
  const fetchedDataSource = context.getDataSource<MockDataSource>({
    id: dataSource.id,
  });

  expect(fetchedDataSource).toEqual(dataSource);
});

test("registers data sources correctly", () => {
  const context = new CouncilContext(mockProvider);
  expect(context.dataSources.length).toBe(0);

  const dataSource0 = new MockDataSource(0, context);
  context.registerDataSource({ id: 0 }, dataSource0);
  expect(context.dataSources.length).toBe(1);

  const dataSource1 = new MockDataSource(1, context);
  context.registerDataSource({ id: dataSource0.id }, dataSource1);
  expect(context.dataSources.length).toBe(1);

  const fetchedDataSource = context.getDataSource<MockDataSource>({
    id: dataSource0.id,
  });

  expect(fetchedDataSource).toEqual(dataSource0);
});
