import { OneTest } from "./one-test";
import { invalidateEntity } from "../../src";

const testObj2 = { id: "obj2", names: ["foo", "bar"] };

export const invalidateEntityTestData: ReadonlyArray<OneTest> = [
  {
    name: "invalidateEntityShallow with shallow data",
    patches: [invalidateEntity("obj2", false)],
    cacheBefore: { obj2: testObj2 },
    cacheAfter: { obj2: testObj2 },
    staleBefore: {},
    staleAfter: { obj2: { id: true, names: true } }
  },
  {
    name: "invalidateEntityRecursive with shallow data",
    patches: [invalidateEntity("obj2", true)],
    cacheBefore: { obj2: testObj2 },
    cacheAfter: { obj2: testObj2 },
    staleBefore: {},
    staleAfter: { obj2: { id: true, names: true } }
  }
];
