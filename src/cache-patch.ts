import * as GraphQLCache from "gql-cache";

// A definition of an operation that modifies an entity
export type CachePatch =
  | InvalidateEntity
  | InvalidateField
  | CreateEntity
  | DeleteEntity
  | UpdateEntity
  | UpdateField
  | InsertElement
  | RemoveElement
  | RemoveEntityElement;

export interface InvalidateEntity {
  readonly type: "InvalidateEntity";
  readonly id: string;
  readonly recursive: boolean;
}

export interface InvalidateField {
  readonly type: "InvalidateField";
  readonly id: string;
  readonly fieldName: string;
  readonly recursive: boolean;
  readonly fieldArguments: {} | undefined;
}

export interface CreateEntity {
  readonly type: "CreateEntity";
  readonly id: GraphQLCache.EntityId;
  readonly newValue: GraphQLCache.Entity;
}

export interface UpdateEntity {
  readonly type: "UpdateEntity";
  readonly id: GraphQLCache.EntityId;
  readonly newValues: GraphQLCache.Entity;
}

export interface DeleteEntity {
  readonly type: "DeleteEntity";
  readonly id: GraphQLCache.EntityId;
}

export interface UpdateField {
  readonly type: "UpdateField";
  readonly id: string;
  readonly fieldName: string;
  readonly newValue: GraphQLCache.EntityFieldValue | null;
  readonly fieldArguments: {} | undefined;
}

export interface InsertElement {
  readonly type: "InsertElement";
  readonly id: GraphQLCache.EntityId;
  readonly fieldName: string;
  readonly index: number;
  readonly newValue: GraphQLCache.EntityFieldValue;
  readonly fieldArguments: {} | undefined;
}

export interface RemoveElement {
  readonly type: "RemoveElement";
  readonly id: GraphQLCache.EntityId;
  readonly fieldName: string;
  readonly index: number;
  readonly fieldArguments: {} | undefined;
}

export interface RemoveEntityElement {
  readonly type: "RemoveEntityElement";
  readonly id: GraphQLCache.EntityId;
  readonly fieldName: string;
  readonly entityId: GraphQLCache.EntityId;
  readonly fieldArguments: {} | undefined;
}

/**
 *  Makes an entity stale in the cache
 */
export function invalidateEntity(
  id: GraphQLCache.EntityId,
  recursive: boolean
): InvalidateEntity {
  return {
    type: "InvalidateEntity",
    id,
    recursive
  };
}

/**
 *  Makes a field stale in the cache
 */
export function invalidateField<T = GraphQLCache.Entity, A extends {} = {}>(
  id: GraphQLCache.EntityId,
  fieldName: Extract<keyof T, string>,
  recursive: boolean,
  fieldArguments?: A
): InvalidateField {
  return {
    type: "InvalidateField",
    id,
    fieldName,
    recursive,
    fieldArguments
  };
}

/**
 * Create a new entity
 */
export function createEntity<T = GraphQLCache.Entity>(
  id: GraphQLCache.EntityId,
  newValue: T
): CreateEntity {
  // tslint:disable-next-line:no-any
  return { type: "CreateEntity", id, newValue: newValue as any };
}

/**
 * Update multiple fields (without arguments) on an existing entity
 */
export function updateEntity<T = GraphQLCache.Entity>(
  id: GraphQLCache.EntityId,
  newValues: Partial<T>
): UpdateEntity {
  // tslint:disable-next-line:no-any
  return { type: "UpdateEntity", id, newValues: newValues as any };
}

/**
 * Deletes an existing entity
 */
export function deleteEntity(id: GraphQLCache.EntityId): DeleteEntity {
  return { type: "DeleteEntity", id };
}

/**
 * Update a single field with optional arguments
 */
export function updateField<T = GraphQLCache.Entity, A extends {} = {}>(
  id: GraphQLCache.EntityId,
  fieldName: Extract<keyof T, string>,
  newValue: GraphQLCache.EntityFieldValue | null,
  fieldArguments?: A
): UpdateField {
  return { type: "UpdateField", id, fieldName, newValue, fieldArguments };
}

/**
 * Inserts an element into an array-field in an entity
 */
export function insertElement<T = GraphQLCache.Entity, A extends {} = {}>(
  id: GraphQLCache.EntityId,
  fieldName: Extract<keyof T, string>,
  index: number,
  newValue: GraphQLCache.EntityFieldValue | null,
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
export function removeElement<T = GraphQLCache.Entity, A extends {} = {}>(
  id: GraphQLCache.EntityId,
  fieldName: Extract<keyof T, string>,
  index: number,
  fieldArguments?: A
): RemoveElement {
  return { type: "RemoveElement", id, fieldName, index, fieldArguments };
}

/**
 * Remove all occurances of elements with specified ID from an array-field in an entity
 */
export function removeEntityElement<T = GraphQLCache.Entity, A extends {} = {}>(
  id: GraphQLCache.EntityId,
  fieldName: Extract<keyof T, string>,
  entityId: GraphQLCache.EntityId,
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
