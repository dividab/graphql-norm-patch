import { createEntity } from "../../src";
import { OneTest } from "./one-test";

const testObj1 = { id: "obj1", name: "foo" };

export const createEntityTestData: ReadonlyArray<OneTest> = [
  {
    name: "createEntity",
    patches: [createEntity("obj1", testObj1)],
    cacheBefore: {},
    cacheAfter: { obj1: testObj1 }
  }
];
