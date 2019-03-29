import { OneTest } from "./one-test";
import { removeElement } from "../../src";

const testObj1 = { id: "obj1", name: "foo" };
const testObj2 = { id: "obj2", names: ["foo", "bar"] };
const ROOT_QUERY = { products: [] };

export const removeElementTestData: ReadonlyArray<OneTest> = [
  {
    name: "removeElement",
    patches: [removeElement<typeof testObj2>("obj2", "names", 0)],
    cacheBefore: { obj2: testObj2 },
    cacheAfter: { obj2: { id: "obj2", names: ["bar"] } }
  },
  {
    name: "removeElement should do nothing if entity is missing in cache",
    patches: [removeElement<typeof testObj2>("notobj2", "names", 0)],
    cacheBefore: { obj2: testObj2 },
    cacheAfter: { obj2: testObj2 }
  },
  {
    name: "removeElement should do nothing if field is missing in cache",
    patches: [removeElement<typeof testObj2>("obj1", "names", 0)],
    cacheBefore: { obj1: testObj1 },
    cacheAfter: { obj1: testObj1 }
  },
  {
    name:
      "removeElement with arguments should only remove in field with arguments",
    patches: [
      removeElement<typeof ROOT_QUERY>("ROOT_QUERY", "products", 0, {
        category: 2
      })
    ],
    cacheBefore: {
      ROOT_QUERY: {
        'products({"category":1})': ["Product;1"],
        'products({"category":2})': [null, "Product;2"]
      },
      "Product;1": { id: 1, sortNo: 0 },
      "Product;2": { id: 2, sortNo: 0 }
    },
    cacheAfter: {
      ROOT_QUERY: {
        'products({"category":1})': ["Product;1"],
        'products({"category":2})': ["Product;2"]
      },
      "Product;1": { id: 1, sortNo: 0 },
      "Product;2": { id: 2, sortNo: 0 }
    }
  }
];
