import { OneTest } from "./one-test";
import { insertElement } from "../../src";

const testObj2 = { id: "obj2", names: ["foo", "bar"] };

export const insertElementTestData: ReadonlyArray<OneTest> = [
  {
    name: "insertElement",
    patches: [insertElement<typeof testObj2>("obj2", "names", 0, "baz")],
    cacheBefore: { obj2: testObj2 },
    cacheAfter: { obj2: { id: "obj2", names: ["baz", "foo", "bar"] } }
  }
];
