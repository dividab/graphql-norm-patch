import * as CachePatch from "./cache-patch";
import * as GraphQLEntityCache from "gql-cache";

interface MutableStaleEntities {
  // tslint:disable-next-line:readonly-keyword
  [key: string]: GraphQLEntityCache.StaleEntity | undefined;
}

interface MutableEntityCache {
  // tslint:disable-next-line:readonly-keyword
  [id: string]: GraphQLEntityCache.Entity;
}

export function apply(
  patches: ReadonlyArray<CachePatch.CachePatch>,
  cache: GraphQLEntityCache.EntityCache,
  staleEntities: GraphQLEntityCache.StaleEntities
): [GraphQLEntityCache.EntityCache, GraphQLEntityCache.StaleEntities] {
  if (patches.length === 0) {
    return [cache, staleEntities];
  }
  // Make a shallow copy of the cache
  let cacheCopy: MutableEntityCache = { ...cache };
  // Make a shallow copy of the stale entities
  let staleEntitiesCopy: MutableStaleEntities = { ...staleEntities };
  for (const patch of patches) {
    switch (patch.type) {
      case "InvalidateField": {
        applyInvalidateField(patch, cacheCopy, staleEntitiesCopy);
        break;
      }
      case "CreateEntity": {
        applyCreateEntity(patch, cacheCopy);
        break;
      }
      case "DeleteEntity": {
        applyDeleteEntity(patch, cacheCopy);
        break;
      }
      case "UpdateField": {
        applyUpdateField(patch, cacheCopy);
        break;
      }
      case "InsertElement": {
        applyInsertElement(patch, cacheCopy);
        break;
      }
      case "RemoveElement": {
        applyRemoveElement(patch, cacheCopy);
        break;
      }
      case "RemoveEntityElement": {
        applyRemoveEntityElement(patch, cacheCopy);
        break;
      }
      default: {
        const exhaustiveCheck = (x: never) => x;
        exhaustiveCheck(patch);
      }
    }
  }

  return [cacheCopy, staleEntitiesCopy];
}

function applyInvalidateField(
  patch: CachePatch.InvalidateField,
  cache: GraphQLEntityCache.EntityCache,
  staleEntities: MutableStaleEntities
): void {
  if (entityAndFieldExists(cache, patch)) {
    const entityFieldKeys = Object.keys(cache[patch.id]).filter(
      k => k.indexOf(patch.fieldName) !== -1
    );

    for (const fieldKey of entityFieldKeys) {
      // Shallow mutation of stale entities OK as we have a shallow copy
      staleEntities[patch.id] = {
        ...staleEntities[patch.id],
        [fieldKey]: true
      };
    }
  }
}

function applyCreateEntity(
  patch: CachePatch.CreateEntity,
  cache: MutableEntityCache
): void {
  // Shallow mutation OK as we have a shallow copy
  cache[patch.id] = patch.newValue;
}

function applyDeleteEntity(
  patch: CachePatch.DeleteEntity,
  cache: MutableEntityCache
): void {
  if (entityExists(cache, patch)) {
    // Shallow mutation of cache OK as we have a shallow copy
    delete cache[patch.id];
  }
}

function applyUpdateField(
  patch: CachePatch.UpdateField,
  cache: MutableEntityCache
): void {
  if (entityAndFieldExists(cache, patch)) {
    // Shallow mutation of cache OK as we have a shallow copy
    cache[patch.id] = {
      ...cache[patch.id],
      [patch.fieldName]: patch.newValue
    };
  }
}

function applyInsertElement(
  patch: CachePatch.InsertElement,
  cache: MutableEntityCache
): void {
  if (entityAndFieldExists(cache, patch)) {
    // Shallow mutation of cache OK as we have a shallow copy
    // tslint:disable-next-line:no-any
    const arrCopy =
      cache[patch.id][patch.fieldName] === null
        ? []
        : [...(cache[patch.id][patch.fieldName] as Array<any>)];
    arrCopy.splice(patch.index, 0, patch.newValue);

    cache[patch.id] = {
      ...cache[patch.id],
      [patch.fieldName]: arrCopy
    };
  }
}

function applyRemoveElement(
  patch: CachePatch.RemoveElement,
  cache: MutableEntityCache
): void {
  if (entityAndFieldExists(cache, patch)) {
    // tslint:disable-next-line:no-any
    const arrCopy = [...(cache[patch.id][patch.fieldName] as Array<any>)];
    arrCopy.splice(patch.index, 1);
    // Shallow mutation of cache OK as we have a shallow copy
    cache[patch.id] = {
      ...cache[patch.id],
      [patch.fieldName]: arrCopy
    };
  }
}

function applyRemoveEntityElement(
  patch: CachePatch.RemoveEntityElement,
  cache: MutableEntityCache
): void {
  if (entityAndFieldExists(cache, patch)) {
    const arr = cache[patch.id][patch.fieldName] as ReadonlyArray<
      GraphQLEntityCache.EntityId
    >;
    // Shallow mutation of cache OK as we have a shallow copy
    cache[patch.id] = {
      ...cache[patch.id],
      [patch.fieldName]: arr.filter(x => x !== patch.entityId)
    };
  }
}

function entityAndFieldExists(
  cache: GraphQLEntityCache.EntityCache,
  patch: { readonly id: string; readonly fieldName: string }
): boolean {
  return !!(cache[patch.id] && cache[patch.id][patch.fieldName] !== undefined);
}

function entityExists(
  cache: GraphQLEntityCache.EntityCache,
  patch: { readonly id: string }
): boolean {
  return !!cache[patch.id];
}
