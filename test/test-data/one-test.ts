import { NormMap } from "graphql-norm";
import { StaleMap } from "graphql-norm-stale";
import { CachePatch } from "../../src";

export interface OneTest {
  readonly name: string;
  readonly only?: true;
  readonly patches: ReadonlyArray<CachePatch>;
  readonly cacheBefore: NormMap;
  readonly cacheAfter: NormMap;
  readonly staleBefore?: StaleMap;
  readonly staleAfter?: StaleMap;
}
