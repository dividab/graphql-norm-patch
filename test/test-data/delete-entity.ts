import { deleteEntity } from "../../src";
import { OneTest } from "./one-test";

const testObj1 = { id: "obj1", name: "foo" };

export const deleteEntityTestData: ReadonlyArray<OneTest> = [
  {
    name: "deleteEntity",
    patches: [deleteEntity("obj1")],
    cacheBefore: { obj1: testObj1 },
    cacheAfter: {}
  }
];
