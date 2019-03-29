import { OneTest } from "./one-test";
import { invalidateField } from "../../src";
const ROOT_QUERY = { product: {} };

const testObj1 = { id: "obj1", name: "foo" };
const testObj2 = { id: "obj2", names: ["foo", "bar"] };
const testObj4 = { id: "obj4", ["names(id:1)"]: ["foo", "bar"] };

export const invalidateFieldTestData: ReadonlyArray<OneTest> = [
  {
    name: "invalidateField recursive=true with shallow data",
    patches: [invalidateField<typeof testObj2>("obj2", "names", true)],
    cacheBefore: { obj2: testObj2 },
    cacheAfter: { obj2: testObj2 },
    staleBefore: {},
    staleAfter: { obj2: { names: true } }
  },
  {
    name: "invalidateField WithParams recursive=true",
    patches: [invalidateField<any>("obj4", "names", true)],
    cacheBefore: { obj4: testObj4 },
    cacheAfter: { obj4: testObj4 },
    staleBefore: {},
    staleAfter: { obj4: { ["names(id:1)"]: true } }
  },
  {
    name: "invalidateField recursive=false with deep data",
    patches: [invalidateField<any>("myid", "prop", false)],
    cacheBefore: {
      myid: { prop: "obj:1" },
      ["obj:1"]: { id: "1", news: ["NewsItemType:1", "NewsItemType:2"] },
      ["NewsItemType:1"]: { id: 1, header: "olle" },
      ["NewsItemType:2"]: { id: 2, header: "olle2" }
    },
    cacheAfter: {
      myid: { prop: "obj:1" },
      ["obj:1"]: { id: "1", news: ["NewsItemType:1", "NewsItemType:2"] },
      ["NewsItemType:1"]: { id: 1, header: "olle" },
      ["NewsItemType:2"]: { id: 2, header: "olle2" }
    },
    staleBefore: {},
    staleAfter: {
      myid: { prop: true }
    }
  },
  {
    name: "invalidateField recursive=true with deep data",
    patches: [invalidateField<any>("myid", "prop", true)],
    cacheBefore: {
      myid: { prop: "obj:1" },
      "obj:1": { id: "1", news: ["NewsItemType:1", "NewsItemType:2"] },
      "NewsItemType:1": { id: 1, header: "olle" },
      "NewsItemType:2": { id: 2, header: "olle2" }
    },
    cacheAfter: {
      myid: { prop: "obj:1" },
      "obj:1": { id: "1", news: ["NewsItemType:1", "NewsItemType:2"] },
      "NewsItemType:1": { id: 1, header: "olle" },
      "NewsItemType:2": { id: 2, header: "olle2" }
    },
    staleBefore: {},
    staleAfter: {
      myid: { prop: true },
      "obj:1": { id: true, news: true },
      "NewsItemType:1": { id: true, header: true },
      "NewsItemType:2": { id: true, header: true }
    }
  },
  {
    name:
      "invalidateField recursive=true should do nothing if entity is missing in cache",
    patches: [invalidateField<typeof testObj2>("notobj2", "names", true)],
    cacheBefore: { obj2: testObj2 },
    cacheAfter: { obj2: testObj2 },
    staleBefore: {},
    staleAfter: {}
  },
  {
    name:
      "invalidateField recursive=true should do nothing if field is missing in cache",
    patches: [invalidateField<typeof testObj2>("obj2", "names", true)],
    cacheBefore: { obj2: testObj1 },
    cacheAfter: { obj2: testObj1 },
    staleBefore: {},
    staleAfter: {}
  },
  {
    name:
      "invalidateField with arguments should only invalidate field with arguments",
    patches: [
      invalidateField<typeof ROOT_QUERY>("ROOT_QUERY", "product", false, {
        id: 2
      })
    ],
    cacheBefore: {
      ROOT_QUERY: {
        'product({"id":1})': "Product;1",
        'product({"id":2})': "Product;2"
      },
      "Product;1": { id: 1, sortNo: 0 },
      "Product;2": { id: 2, sortNo: 0 }
    },
    cacheAfter: {
      ROOT_QUERY: {
        'product({"id":1})': "Product;1",
        'product({"id":2})': "Product;2"
      },
      "Product;1": { id: 1, sortNo: 0 },
      "Product;2": { id: 2, sortNo: 0 }
    },
    staleBefore: {},
    staleAfter: {
      ROOT_QUERY: { 'product({"id":2})': true }
    }
  }
];
