import { updateField } from "../../src";
import { OneTest } from "./one-test";

const testObj1 = { id: "obj1", name: "foo" };
const testObj2 = { id: "obj2", names: ["foo", "bar"] };
const testObj3 = { id: "obj2", sortNo: 11 };

export const updateFieldTestData: ReadonlyArray<OneTest> = [
  {
    name: "updateField",
    patches: [updateField<typeof testObj1>("obj1", "name", "bar")],
    cacheBefore: { obj1: testObj1 },
    cacheAfter: { obj1: { id: "obj1", name: "bar" } }
  },
  {
    name: "updateField should do nothing if entity is missing in cache",
    patches: [updateField<typeof testObj1>("notobj1", "name", "bar")],
    cacheBefore: { obj1: testObj1 },
    cacheAfter: { obj1: testObj1 }
  },
  {
    name: "updateField should do nothing if field is missing in cache",
    patches: [updateField<typeof testObj1>("obj1", "name", "bar")],
    cacheBefore: { obj1: testObj2 },
    cacheAfter: { obj1: testObj2 }
  },
  {
    name: "updateField should update if the field is null",
    patches: [updateField<typeof testObj1>("obj1", "name", "bar")],
    cacheBefore: { obj1: { id: "myid", name: null } },
    cacheAfter: { obj1: { id: "myid", name: "bar" } }
  },
  {
    name: "updateField should update zero",
    patches: [updateField<typeof testObj3>("obj1", "sortNo", 0)],
    cacheBefore: { obj1: { id: "myid", sortNo: 12 } },
    cacheAfter: { obj1: { id: "myid", sortNo: 0 } }
  }
];
