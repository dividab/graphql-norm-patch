import { OneTest } from "./one-test";
import { removeElement } from "../../src";

const testObj2 = { id: "obj2", names: ["foo", "bar"] };

export const removeElementTestData: ReadonlyArray<OneTest> = [
  {
    name: "removeElement",
    patches: [removeElement<typeof testObj2>("obj2", "names", 0)],
    cacheBefore: { obj2: testObj2 },
    cacheAfter: { obj2: { id: "obj2", names: ["bar"] } }
  }
];
