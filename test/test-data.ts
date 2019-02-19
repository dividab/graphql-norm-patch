import {
  CachePatch,
  createEntity,
  deleteEntity,
  updateField,
  insertElement,
  removeElement,
  removeEntityElement,
  invalidateField,
  invalidateEntity
} from "../src";
import { EntityCache, StaleEntities } from "gql-cache";

export interface OneTest {
  readonly name: string;
  readonly only?: true;
  readonly patches: ReadonlyArray<CachePatch>;
  readonly cacheBefore: EntityCache;
  readonly cacheAfter: EntityCache;
  readonly staleBefore?: StaleEntities;
  readonly staleAfter?: StaleEntities;
}

const testObj1 = { id: "obj1", name: "foo" };
const testObj2 = { id: "obj2", names: ["foo", "bar"] };
const testObj3 = {
  id: "obj3",
  items: ["myitemid1", "myitemid2"]
};
const testObj4 = { id: "obj4", ["names(id:1)"]: ["foo", "bar"] };

export const testData: ReadonlyArray<OneTest> = [
  {
    name: "createEntity",
    patches: [createEntity("obj1", testObj1)],
    cacheBefore: {},
    cacheAfter: { obj1: testObj1 }
  },
  {
    name: "deleteEntity",
    patches: [deleteEntity("obj1")],
    cacheBefore: { obj1: testObj1 },
    cacheAfter: {}
  },
  {
    name: "updateField",
    patches: [updateField<typeof testObj1>("obj1", "name", "bar")],
    cacheBefore: { obj1: testObj1 },
    cacheAfter: { obj1: { id: "obj1", name: "bar" } }
  },
  {
    name: "insertElement",
    patches: [insertElement<typeof testObj2>("obj2", "names", 0, "baz")],
    cacheBefore: { obj2: testObj2 },
    cacheAfter: { obj2: { id: "obj2", names: ["baz", "foo", "bar"] } }
  },
  {
    name: "removeElement",
    patches: [removeElement<typeof testObj2>("obj2", "names", 0)],
    cacheBefore: { obj2: testObj2 },
    cacheAfter: { obj2: { id: "obj2", names: ["bar"] } }
  },
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
    name: "invalidateEntityShallow",
    patches: [invalidateEntity("obj2", false)],
    cacheBefore: { obj2: testObj2 },
    cacheAfter: { obj2: testObj2 },
    staleBefore: {},
    staleAfter: { obj2: { id: true, names: true } }
  },
  {
    name: "invalidateEntityRecursive with shallow data",
    patches: [invalidateEntity("obj2", true)],
    cacheBefore: { obj2: testObj2 },
    cacheAfter: { obj2: testObj2 },
    staleBefore: {},
    staleAfter: { obj2: { id: true, names: true } }
  },
  {
    name: "invalidateFieldRecursive with shallow data",
    patches: [invalidateField<typeof testObj2>("obj2", "names", true)],
    cacheBefore: { obj2: testObj2 },
    cacheAfter: { obj2: testObj2 },
    staleBefore: {},
    staleAfter: { obj2: { names: true } }
  },
  {
    name: "invalidateFieldWithParamsRecursive",
    patches: [invalidateField<any>("obj4", "names", true)],
    cacheBefore: { obj4: testObj4 },
    cacheAfter: { obj4: testObj4 },
    staleBefore: {},
    staleAfter: { obj4: { ["names(id:1)"]: true } }
  },
  {
    name: "invalidateFieldShallow with deep data",
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
    name: "invalidateFieldRecursive with deep data",
    patches: [invalidateField<any>("myid", "prop", true)],
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
      myid: { prop: true },
      ["obj:1"]: { id: true, news: true },
      ["NewsItemType:1"]: { id: true, header: true },
      ["NewsItemType:2"]: { id: true, header: true }
    }
  },
  {
    name: "deleteEntity should do nothing if entity is missing in cache",
    patches: [deleteEntity("notobj1")],
    cacheBefore: { obj1: testObj1 },
    cacheAfter: { obj1: testObj1 }
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
      "invalidateFieldRecursive should do nothing if entity is missing in cache",
    patches: [invalidateField<typeof testObj2>("notobj2", "names", true)],
    cacheBefore: { obj2: testObj2 },
    cacheAfter: { obj2: testObj2 },
    staleBefore: {},
    staleAfter: {}
  },
  {
    name:
      "invalidateFieldRecursive should do nothing if field is missing in cache",
    patches: [invalidateField<typeof testObj2>("obj2", "names", true)],
    cacheBefore: { obj2: testObj1 },
    cacheAfter: { obj2: testObj1 },
    staleBefore: {},
    staleAfter: {}
  },
  {
    name: "insertElement should create new array if the field is null",
    patches: [insertElement<typeof testObj2>("obj2", "names", 0, "baz")],
    cacheBefore: { obj2: { id: "obj2", names: null } },
    cacheAfter: { obj2: { id: "obj2", names: ["baz"] } }
  }
];
