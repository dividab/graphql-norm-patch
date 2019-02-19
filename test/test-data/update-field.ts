import { updateField } from "../../src";
import { OneTest } from "./one-test";

const testObj1 = { id: "obj1", name: "foo" };

export const updateFieldTestData: ReadonlyArray<OneTest> = [
  {
    name: "updateField",
    patches: [updateField<typeof testObj1>("obj1", "name", "bar")],
    cacheBefore: { obj1: testObj1 },
    cacheAfter: { obj1: { id: "obj1", name: "bar" } }
  }
];
