import { EntityCache, StaleEntities } from "graphql-norm";
import { CachePatch } from "../../src";

export interface OneTest {
  readonly name: string;
  readonly only?: true;
  readonly patches: ReadonlyArray<CachePatch>;
  readonly cacheBefore: EntityCache;
  readonly cacheAfter: EntityCache;
  readonly staleBefore?: StaleEntities;
  readonly staleAfter?: StaleEntities;
}
