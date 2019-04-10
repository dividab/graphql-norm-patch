import { updateEntity } from "../../src";
import { OneTest } from "./one-test";

export const updateEntityTestData: ReadonlyArray<OneTest> = [
  {
    name:
      "updateEntity should not do anything if entity does not exist in cache",
    patches: [updateEntity("obj1", { name: "foo", bar: "zoo" })],
    cacheBefore: {},
    cacheAfter: {}
  },
  {
    name: "updateEntity should update if entity exist in cache",
    patches: [updateEntity("obj1", { name: "foo", bar: "zoo" })],
    cacheBefore: { obj1: { id: "obj1", name: "name", bar: "bar" } },
    cacheAfter: { obj1: { id: "obj1", name: "foo", bar: "zoo" } }
  }
];
