import { OneTest } from "./one-test";
import { removeEntityElement } from "../../src";

const testObj1 = { id: "obj1", name: "foo" };

const testObj3 = {
  id: "obj3",
  items: ["myitemid1", "myitemid2"]
};

export const removeEntityElementTestData: ReadonlyArray<OneTest> = [
  {
    name: "removeEntityElement",
    patches: [
      removeEntityElement<typeof testObj3>("obj3", "items", "myitemid1")
    ],
    cacheBefore: {
      obj3: testObj3,
      myitemid1: { name: "first" },
      myitemid2: { name: "second" }
    },
    cacheAfter: {
      obj3: {
        id: "obj3",
        items: ["myitemid2"]
      },
      myitemid1: { name: "first" },
      myitemid2: { name: "second" }
    }
  },
  {
    name: "removeEntityElement should do nothing if entity is missing in cache",
    patches: [
      removeEntityElement<typeof testObj3>("notobj3", "items", "myitemid1")
    ],
    cacheBefore: { obj3: testObj3 },
    cacheAfter: { obj3: testObj3 }
  },
  {
    name: "removeEntityElement should do nothing if field is missing in cache",
    patches: [
      removeEntityElement<typeof testObj3>("obj3", "items", "myitemid1")
    ],
    cacheBefore: { obj3: testObj1 },
    cacheAfter: { obj3: testObj1 }
  }
];
