import { CachePatch } from "../src";
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
    name: "Test1",
    patches: [],
    cacheBefore: {},
    cacheAfter: {}
  }
];
