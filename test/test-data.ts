import { CachePatch, createEntity, deleteEntity } from "../src";
import { EntityCache } from "gql-cache";

export interface OneTest {
  readonly name: string;
  readonly patches: ReadonlyArray<CachePatch>;
  readonly cacheBefore: EntityCache;
  readonly cacheAfter: EntityCache;
  readonly staleBefore?: {};
  readonly staleAfter?: {};
}

export const testData: ReadonlyArray<OneTest> = [
  {
    name: "CreateEntity",
    patches: [createEntity("myid", { id: "myid", name: "foo" })],
    cacheBefore: {},
    cacheAfter: { myid: { id: "myid", name: "foo" } }
  },
  {
    name: "DeleteEntity",
    patches: [deleteEntity("myid")],
    cacheBefore: { myid: { id: "myid", name: "foo" } },
    cacheAfter: {}
  }
];
