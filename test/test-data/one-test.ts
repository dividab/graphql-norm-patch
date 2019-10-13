import { NormMap, FieldsMap } from "graphql-norm";
import { Patch } from "../../src";

export interface OneTest {
  readonly name: string;
  readonly only?: true;
  readonly patches: ReadonlyArray<Patch>;
  readonly cacheBefore: NormMap;
  readonly cacheAfter: NormMap;
  readonly staleBefore?: FieldsMap;
  readonly staleAfter?: FieldsMap;
}
