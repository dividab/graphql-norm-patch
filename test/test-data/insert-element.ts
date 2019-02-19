import { OneTest } from "./one-test";
import { insertElement } from "../../src";

const testObj1 = { id: "obj1", name: "foo" };
const testObj2 = { id: "obj2", names: ["foo", "bar"] };

export const insertElementTestData: ReadonlyArray<OneTest> = [
  {
    name: "insertElement",
    patches: [insertElement<typeof testObj2>("obj2", "names", 0, "baz")],
    cacheBefore: { obj2: testObj2 },
    cacheAfter: { obj2: { id: "obj2", names: ["baz", "foo", "bar"] } }
  },
  {
    name: "insertElement should do nothing if entity is missing in cache",
    patches: [insertElement<typeof testObj2>("notmyid", "names", 0, "baz")],
    cacheBefore: { myid: testObj2 },
    cacheAfter: { myid: testObj2 }
  },
  {
    name: "insertElement should do nothing if field is missing in cache",
    patches: [insertElement<typeof testObj2>("obj1", "names", 0, "baz")],
    cacheBefore: { obj1: testObj1 },
    cacheAfter: { obj1: testObj1 }
  },
  {
    name: "insertElement should create new array if the field is null",
    patches: [insertElement<typeof testObj2>("obj2", "names", 0, "baz")],
    cacheBefore: { obj2: { id: "obj2", names: null } },
    cacheAfter: { obj2: { id: "obj2", names: ["baz"] } }
  }
];
