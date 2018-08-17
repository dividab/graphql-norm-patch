import { CachePatch, createEntity, deleteEntity, updateField } from "../src";
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
  }
];
