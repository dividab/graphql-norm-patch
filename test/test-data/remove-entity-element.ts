import { OneTest } from "./one-test";
import { removeEntityElement } from "../../src";

const testObj1 = { id: "obj1", name: "foo" };
const testObj3 = {
  id: "obj3",
  items: ["myitemid1", "myitemid2"]
};
const ROOT_QUERY = { products: [] };

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
  },
  {
    name:
      "removeEntityElement with arguments should only remove in field with arguments",
    patches: [
      removeEntityElement<typeof ROOT_QUERY>(
        "ROOT_QUERY",
        "products",
        "Product;2",
        {
          category: 2
        }
      )
    ],
    cacheBefore: {
      ROOT_QUERY: {
        'products({"category":1})': ["Product;1", "Product;2"],
        'products({"category":2})': [null, "Product;2"]
      },
      "Product;1": { id: 1, sortNo: 0 },
      "Product;2": { id: 2, sortNo: 0 }
    },
    cacheAfter: {
      ROOT_QUERY: {
        'products({"category":1})': ["Product;1", "Product;2"],
        'products({"category":2})': [null]
      },
      "Product;1": { id: 1, sortNo: 0 },
      "Product;2": { id: 2, sortNo: 0 }
    }
  }
];
