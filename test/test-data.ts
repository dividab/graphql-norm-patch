import {
  CachePatch,
  createEntity,
  deleteEntity,
  updateField,
  insertElement,
  removeElement,
  removeEntityElement,
  invalidateField
} from "../src";
import { EntityCache, StaleEntities } from "gql-cache";

export interface OneTest {
  readonly name: string;
  readonly patches: ReadonlyArray<CachePatch>;
  readonly cacheBefore: EntityCache;
  readonly cacheAfter: EntityCache;
  readonly staleBefore?: StaleEntities;
  readonly staleAfter?: StaleEntities;
}

const testObj1 = { id: "myid", name: "foo" };
const testObj2 = { id: "myid", names: ["foo", "bar"] };
const testObj3 = {
  id: "myid",
  items: ["myitemid1", "myitemid2"]
};

export const testData: ReadonlyArray<OneTest> = [
  {
    name: "createEntity",
    patches: [createEntity("myid", testObj1)],
    cacheBefore: {},
    cacheAfter: { myid: testObj1 }
  },
  {
    name: "deleteEntity",
    patches: [deleteEntity("myid")],
    cacheBefore: { myid: testObj1 },
    cacheAfter: {}
  },
  {
    name: "updateField",
    patches: [updateField<typeof testObj1>("myid", "name", "bar")],
    cacheBefore: { myid: testObj1 },
    cacheAfter: { myid: { id: "myid", name: "bar" } }
  },
  {
    name: "insertElement",
    patches: [insertElement<typeof testObj2>("myid", "names", 0, "baz")],
    cacheBefore: { myid: testObj2 },
    cacheAfter: { myid: { id: "myid", names: ["baz", "foo", "bar"] } }
  },
  {
    name: "removeElement",
    patches: [removeElement<typeof testObj2>("myid", "names", 0)],
    cacheBefore: { myid: testObj2 },
    cacheAfter: { myid: { id: "myid", names: ["bar"] } }
  },
  {
    name: "removeEntityElement",
    patches: [
      removeEntityElement<typeof testObj3>("myid", "items", "myitemid1")
    ],
    cacheBefore: {
      myid: testObj3,
      myitemid1: { name: "first" },
      myitemid2: { name: "second" }
    },
    cacheAfter: {
      myid: {
        id: "myid",
        items: ["myitemid2"]
      },
      myitemid1: { name: "first" },
      myitemid2: { name: "second" }
    }
  },
  {
    name: "invalidateField",
    patches: [invalidateField<typeof testObj2>("myid", "names")],
    cacheBefore: { myid: testObj2 },
    cacheAfter: { myid: testObj2 },
    staleBefore: {},
    staleAfter: { myid: { names: true } }
  }
];
