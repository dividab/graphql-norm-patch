import { NormMap, FieldsMap } from "graphql-norm";
import { CachePatch } from "../../src";

export interface OneTest {
  readonly name: string;
  readonly only?: true;
  readonly patches: ReadonlyArray<CachePatch>;
  readonly cacheBefore: NormMap;
  readonly cacheAfter: NormMap;
  readonly staleBefore?: FieldsMap;
  readonly staleAfter?: FieldsMap;
}
