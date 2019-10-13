import * as GraphQLNorm from "graphql-norm";
import * as GraphQLNormStale from "graphql-norm-stale";

export type CachePatch = ChangePatch | InvalidationPatch;

// A definition of an operation that modifies fields in the cache
export type ChangePatch =
  | CreateEntity
  | DeleteEntity
  | UpdateEntity
  | UpdateField
  | InsertElement
  | RemoveElement
  | RemoveEntityElement;

// A definition of an operation that invalidates fields in the cache
export type InvalidationPatch = GraphQLNormStale.Patch;

export {
  invalidateEntity,
  InvalidateEntity,
  invalidateField,
  InvalidateField
} from "graphql-norm-stale";

export interface CreateEntity {
  readonly type: "CreateEntity";
  readonly id: GraphQLNorm.NormKey;
  readonly newValue: GraphQLNorm.NormObj;
}

export interface UpdateEntity {
  readonly type: "UpdateEntity";
  readonly id: GraphQLNorm.NormKey;
  readonly newValues: GraphQLNorm.NormObj;
}

export interface DeleteEntity {
  readonly type: "DeleteEntity";
  readonly id: GraphQLNorm.NormKey;
}

export interface UpdateField {
  readonly type: "UpdateField";
  readonly id: string;
  readonly fieldName: string;
  readonly newValue: GraphQLNorm.NormFieldValue | null;
  readonly fieldArguments: {} | undefined;
}

export interface InsertElement {
  readonly type: "InsertElement";
  readonly id: GraphQLNorm.NormKey;
  readonly fieldName: string;
  readonly index: number;
  readonly newValue: GraphQLNorm.NormFieldValue;
  readonly fieldArguments: {} | undefined;
}

export interface RemoveElement {
  readonly type: "RemoveElement";
  readonly id: GraphQLNorm.NormKey;
  readonly fieldName: string;
  readonly index: number;
  readonly fieldArguments: {} | undefined;
}

export interface RemoveEntityElement {
  readonly type: "RemoveEntityElement";
  readonly id: GraphQLNorm.NormKey;
  readonly fieldName: string;
  readonly entityId: GraphQLNorm.NormKey;
  readonly fieldArguments: {} | undefined;
}

/**
 * Create a new entity
 */
export function createEntity<T = GraphQLNorm.NormObj>(
  id: GraphQLNorm.NormKey,
  newValue: T
): CreateEntity {
  // tslint:disable-next-line:no-any
  return { type: "CreateEntity", id, newValue: newValue as any };
}

/**
 * Update multiple fields (without arguments) on an existing entity
 */
export function updateEntity<T = GraphQLNorm.NormObj>(
  id: GraphQLNorm.NormKey,
  newValues: Partial<T>
): UpdateEntity {
  // tslint:disable-next-line:no-any
  return { type: "UpdateEntity", id, newValues: newValues as any };
}

/**
 * Deletes an existing entity
 */
export function deleteEntity(id: GraphQLNorm.NormKey): DeleteEntity {
  return { type: "DeleteEntity", id };
}

/**
 * Update a single field with optional arguments
 */
export function updateField<T = GraphQLNorm.NormObj, A extends {} = {}>(
  id: GraphQLNorm.NormKey,
  fieldName: Extract<keyof T, string>,
  newValue: GraphQLNorm.NormFieldValue | null,
  fieldArguments?: A
): UpdateField {
  return { type: "UpdateField", id, fieldName, newValue, fieldArguments };
}

/**
 * Inserts an element into an array-field in an entity
 */
export function insertElement<T = GraphQLNorm.NormObj, A extends {} = {}>(
  id: GraphQLNorm.NormKey,
  fieldName: Extract<keyof T, string>,
  index: number,
  newValue: GraphQLNorm.NormFieldValue | null,
  fieldArguments?: A
): InsertElement {
  return {
    type: "InsertElement",
    id,
    fieldName,
    index,
    newValue,
    fieldArguments
  };
}

/**
 * Remove an element from an array-field in an entity
 */
export function removeElement<T = GraphQLNorm.NormObj, A extends {} = {}>(
  id: GraphQLNorm.NormKey,
  fieldName: Extract<keyof T, string>,
  index: number,
  fieldArguments?: A
): RemoveElement {
  return { type: "RemoveElement", id, fieldName, index, fieldArguments };
}

/**
 * Remove all occurances of elements with specified ID from an array-field in an entity
 */
export function removeEntityElement<T = GraphQLNorm.NormObj, A extends {} = {}>(
  id: GraphQLNorm.NormKey,
  fieldName: Extract<keyof T, string>,
  entityId: GraphQLNorm.NormKey,
  fieldArguments?: A
): RemoveEntityElement {
  return {
    type: "RemoveEntityElement",
    id,
    fieldName,
    entityId,
    fieldArguments
  };
}
