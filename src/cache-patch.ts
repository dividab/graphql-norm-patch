import * as GraphQLCache from "gql-cache";

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
  readonly id: GraphQLCache.EntityId;
  readonly newValue: GraphQLCache.Entity;
}

// Deletes an existing entity
export interface DeleteEntity {
  readonly type: "DeleteEntity";
  readonly id: GraphQLCache.EntityId;
}

// Update a simple field value like a string or boolean
export interface UpdateField {
  readonly type: "UpdateField";
  readonly id: string;
  readonly fieldName: string;
  readonly newValue: GraphQLCache.EntityFieldValue | null;
}

// Inserts an element into an array-field in an entity
export interface InsertElement {
  readonly type: "InsertElement";
  readonly id: GraphQLCache.EntityId;
  readonly fieldName: string;
  readonly index: number;
  readonly newValue: GraphQLCache.EntityFieldValue;
}

// Remove an element from an array-field in an entity
export interface RemoveElement {
  readonly type: "RemoveElement";
  readonly id: GraphQLCache.EntityId;
  readonly fieldName: string;
  readonly index: number;
}

export interface RemoveEntityElement {
  readonly type: "RemoveEntityElement";
  readonly id: GraphQLCache.EntityId;
  readonly fieldName: string;
  readonly entityId: GraphQLCache.EntityId;
}

export function invalidateField<T = GraphQLCache.Entity>(
  id: GraphQLCache.EntityId,
  fieldName: Extract<keyof T, string>
): InvalidateField {
  return {
    type: "InvalidateField",
    id,
    fieldName
  };
}

export function createEntity<T = GraphQLCache.Entity>(
  id: GraphQLCache.EntityId,
  newValue: T
): CreateEntity {
  // tslint:disable-next-line:no-any
  return { type: "CreateEntity", id, newValue: newValue as any };
}

export function deleteEntity(id: GraphQLCache.EntityId): DeleteEntity {
  return { type: "DeleteEntity", id };
}

export function updateField<T = GraphQLCache.Entity>(
  id: string,
  fieldName: Extract<keyof T, string>,
  newValue: GraphQLCache.EntityFieldValue | null
): UpdateField {
  return { type: "UpdateField", id, fieldName, newValue };
}

export function insertElement<T = GraphQLCache.Entity>(
  id: GraphQLCache.EntityId,
  fieldName: Extract<keyof T, string>,
  index: number,
  newValue: GraphQLCache.EntityFieldValue
): InsertElement {
  return { type: "InsertElement", id, fieldName, index, newValue };
}

export function removeElement<T = GraphQLCache.Entity>(
  id: GraphQLCache.EntityId,
  fieldName: Extract<keyof T, string>,
  index: number
): RemoveElement {
  return { type: "RemoveElement", id, fieldName, index };
}

export function removeEntityElement<T = GraphQLCache.Entity>(
  id: GraphQLCache.EntityId,
  fieldName: Extract<keyof T, string>,
  entityId: GraphQLCache.EntityId
): RemoveEntityElement {
  return { type: "RemoveEntityElement", id, fieldName, entityId };
}
