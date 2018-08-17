import * as GraphQLEntityCache from "gql-cache";

// A definition of an operation that modifies an entity
export type CachePatch =
  | InvalidateField
  | CreateEntity
  | DeleteEntity
  | UpdateField
  | InsertElement
  | RemoveElement
  | RemoveEntityElement;

// Makes a field stale in the cache
export interface InvalidateField {
  readonly type: "InvalidateField";
  readonly id: string;
  readonly fieldName: string;
}

// Create a new entity
export interface CreateEntity {
  readonly type: "CreateEntity";
  readonly id: GraphQLEntityCache.EntityId;
  readonly newValue: GraphQLEntityCache.Entity;
}

// Deletes an existing entity
export interface DeleteEntity {
  readonly type: "DeleteEntity";
  readonly id: GraphQLEntityCache.EntityId;
}

// Update a simple field value like a string or boolean
export interface UpdateField {
  readonly type: "UpdateField";
  readonly id: string;
  readonly fieldName: string;
  readonly newValue: GraphQLEntityCache.EntityFieldValue | null;
}

// Inserts an element into an array-field in an entity
export interface InsertElement {
  readonly type: "InsertElement";
  readonly id: GraphQLEntityCache.EntityId;
  readonly fieldName: string;
  readonly index: number;
  readonly newValue: GraphQLEntityCache.EntityFieldValue;
}

// Remove an element from an array-field in an entity
export interface RemoveElement {
  readonly type: "RemoveElement";
  readonly id: GraphQLEntityCache.EntityId;
  readonly fieldName: string;
  readonly index: number;
}

export interface RemoveEntityElement {
  readonly type: "RemoveEntityElement";
  readonly id: GraphQLEntityCache.EntityId;
  readonly fieldName: string;
  readonly entityId: GraphQLEntityCache.EntityId;
}

export function invalidateField<T>(
  id: GraphQLEntityCache.EntityId,
  fieldName: Extract<keyof T, string>
): InvalidateField {
  return {
    type: "InvalidateField",
    id,
    fieldName
  };
}

export function createEntity<T>(
  id: GraphQLEntityCache.EntityId,
  newValue: T
): CreateEntity {
  // tslint:disable-next-line:no-any
  return { type: "CreateEntity", id, newValue: newValue as any };
}

export function deleteEntity(id: GraphQLEntityCache.EntityId): DeleteEntity {
  return { type: "DeleteEntity", id };
}

export function updateField<T>(
  id: string,
  fieldName: Extract<keyof T, string>,
  newValue: GraphQLEntityCache.EntityFieldValue | null
): UpdateField {
  return { type: "UpdateField", id, fieldName, newValue };
}

export function insertElement<T>(
  id: GraphQLEntityCache.EntityId,
  fieldName: Extract<keyof T, string>,
  index: number,
  newValue: GraphQLEntityCache.EntityFieldValue
): InsertElement {
  return { type: "InsertElement", id, fieldName, index, newValue };
}

export function removeElement<T>(
  id: GraphQLEntityCache.EntityId,
  fieldName: Extract<keyof T, string>,
  index: number
): RemoveElement {
  return { type: "RemoveElement", id, fieldName, index };
}

export function removeEntityElement<T>(
  id: GraphQLEntityCache.EntityId,
  fieldName: Extract<keyof T, string>,
  entityId: GraphQLEntityCache.EntityId
): RemoveEntityElement {
  return { type: "RemoveEntityElement", id, fieldName, entityId };
}
