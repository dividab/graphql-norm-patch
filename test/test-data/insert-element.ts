import { OneTest } from "./one-test";
import { insertElement } from "../../src";

const testObj1 = { id: "obj1", name: "foo" };
const testObj2 = { id: "obj2", names: ["foo", "bar"] };
const ROOT_QUERY = { products: [] };
type CategoryArgs = { readonly category: number };

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
  },
  {
    name:
      "insertElement with arguments should only insert in field with arguments",
    patches: [
      insertElement<typeof ROOT_QUERY, CategoryArgs>(
        "ROOT_QUERY",
        "products",
        0,
        null,
        {
          category: 2
        }
      )
    ],
    cacheBefore: {
      ROOT_QUERY: {
        'products({"category":1})': ["Product;1"],
        'products({"category":2})': ["Product;2"]
      },
      "Product;1": { id: 1, sortNo: 0 },
      "Product;2": { id: 2, sortNo: 0 }
    },
    cacheAfter: {
      ROOT_QUERY: {
        'products({"category":1})': ["Product;1"],
        'products({"category":2})': [null, "Product;2"]
      },
      "Product;1": { id: 1, sortNo: 0 },
      "Product;2": { id: 2, sortNo: 0 }
    }
  }
];
