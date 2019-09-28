import * as CachePatch from "./cache-patch";
import { NormObj, NormMap, NormFieldValue, NormKey } from "graphql-norm";
import { StaleFields, StaleMap } from "graphql-norm-stale";

interface MutableStaleEntities {
  // tslint:disable-next-line:readonly-keyword
  [key: string]: StaleFields | undefined;
}

interface MutableEntityCache {
  // tslint:disable-next-line:readonly-keyword
  [id: string]: NormObj;
}

export function apply(
  patches: ReadonlyArray<CachePatch.CachePatch>,
  cache: NormMap,
  staleMap: StaleMap
): [NormMap, StaleMap] {
  if (patches.length === 0) {
    return [cache, staleMap];
  }
  const changePatches: Array<CachePatch.ChangePatch> = [];
  const invalidationPatches: Array<CachePatch.InvalidationPatch> = [];
  for (const patch of patches) {
    switch (patch.type) {
      case "InvalidateEntity":
      case "InvalidateField":
        invalidationPatches.push(patch);
        break;
      case "CreateEntity":
      case "DeleteEntity":
      case "InsertElement":
      case "RemoveElement":
      case "RemoveEntityElement":
      case "UpdateEntity":
      case "UpdateField":
        changePatches.push(patch);
        break;
      default:
        const exhaustiveCheck = (x: never) => x;
        exhaustiveCheck(patch);
    }
  }
  const newCache = applyChanges(changePatches, cache);
  const newStale = applyInvalidations(invalidationPatches, newCache, staleMap);
  return [newCache, newStale];
}

export function applyChanges(
  patches: ReadonlyArray<CachePatch.ChangePatch>,
  cache: NormMap
): NormMap {
  if (patches.length === 0) {
    return cache;
  }
  // Make a shallow copy of the cache
  let cacheCopy: MutableEntityCache = { ...cache };
  for (const patch of patches) {
    switch (patch.type) {
      case "CreateEntity": {
        applyCreateEntity(patch, cacheCopy);
        break;
      }
      case "UpdateEntity": {
        applyUpdateEntity(patch, cacheCopy);
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

  return cacheCopy;
}

export function applyInvalidations(
  patches: ReadonlyArray<CachePatch.InvalidationPatch>,
  cache: NormMap,
  staleMap: StaleMap
): StaleMap {
  if (patches.length === 0) {
    return staleMap;
  }
  // Make a shallow copy of the stale entities
  let staleEntitiesCopy: MutableStaleEntities = { ...staleMap };
  for (const patch of patches) {
    switch (patch.type) {
      case "InvalidateEntity": {
        applyInvalidateEntity(patch, cache, staleEntitiesCopy);
        break;
      }
      case "InvalidateField": {
        applyInvalidateField(patch, cache, staleEntitiesCopy);
        break;
      }
      default: {
        const exhaustiveCheck = (x: never) => x;
        exhaustiveCheck(patch);
      }
    }
  }

  return staleEntitiesCopy;
}

function applyInvalidateEntity(
  patch: CachePatch.InvalidateEntity,
  cache: NormMap,
  staleEntities: MutableStaleEntities
): void {
  const entity = cache[patch.id];
  if (entity !== undefined) {
    const newStaleEntity: Mutable<StaleFields> = {
      ...staleEntities[patch.id]
    };
    for (const entityKey of Object.keys(entity)) {
      newStaleEntity[entityKey] = true;
      if (patch.recursive) {
        invalidateRecursive(cache, staleEntities, entity[entityKey]);
      }
    }
    staleEntities[patch.id] = newStaleEntity;
  }
}

function applyInvalidateField(
  patch: CachePatch.InvalidateField,
  cache: NormMap,
  staleEntities: MutableStaleEntities
): void {
  if (cache[patch.id] !== undefined) {
    // We want to invalidate all fields that start with the specified
    // field name in order to invlidate fields with arguments
    // For example the fields "products" and "products(ids: [1, 2])" should
    // both be invalidated if the field name "products" is specified
    const entityFieldKeys = Object.keys(cache[patch.id]).filter(
      k => k.indexOf(withArgs(patch.fieldName, patch.fieldArguments)) !== -1
    );

    if (entityFieldKeys.length === 0) {
      return;
    }

    for (const fieldKey of entityFieldKeys) {
      staleEntities[patch.id] = {
        ...staleEntities[patch.id],
        [fieldKey]: true
      };
      if (patch.recursive) {
        // Shallow mutation of stale entities OK as we have a shallow copy
        invalidateRecursive(cache, staleEntities, cache[patch.id][fieldKey]);
      }
    }
  }
}

type Mutable<T> = { -readonly [P in keyof T]: T[P] };

function invalidateRecursive(
  cache: NormMap,
  staleEntities: MutableStaleEntities,
  startingEntity: NormFieldValue | null
): void {
  if (
    typeof startingEntity === "number" ||
    typeof startingEntity === "boolean" ||
    startingEntity === "undefined" ||
    startingEntity === "null"
  ) {
    return;
  }

  const stack: Array<string> = [];

  if (typeof startingEntity === "string" && cache[startingEntity]) {
    stack.push(startingEntity);
  } else if (isArrayOfEntityIds(cache, startingEntity)) {
    stack.push(...startingEntity);
  }

  while (stack.length > 0) {
    const entityId = stack.shift()!;
    const entity = cache[entityId];
    if (entity === undefined) {
      continue;
    }
    const entityFieldKeys = Object.keys(entity);
    const newStaleEntity: Mutable<StaleFields> = {
      ...staleEntities[entityId]
    };

    for (const entityFieldKey of entityFieldKeys) {
      const entityField = entity[entityFieldKey];
      if (isArrayOfEntityIds(cache, entityField)) {
        stack.push(...entityField.filter(id => !staleEntities[id]));
      } else if (
        typeof entityField === "string" &&
        cache[entityField] &&
        !staleEntities[entityField]
      ) {
        stack.push(entityField);
      }
      newStaleEntity[entityFieldKey] = true;
    }

    staleEntities[entityId] = newStaleEntity;
  }
}

function isArrayOfEntityIds(
  cache: NormMap,
  field: NormFieldValue | null
): field is ReadonlyArray<NormKey> {
  if (Array.isArray(field) && field.some(x => !!cache[x])) {
    return true;
  }

  return false;
}

function applyCreateEntity(
  patch: CachePatch.CreateEntity,
  cache: MutableEntityCache
): void {
  // Shallow mutation OK as we have a shallow copy
  cache[patch.id] = patch.newValue;
}

function applyUpdateEntity(
  patch: CachePatch.UpdateEntity,
  cache: MutableEntityCache
): void {
  if (entityExists(cache, patch)) {
    // Shallow mutation OK as we have a shallow copy
    cache[patch.id] = { ...cache[patch.id], ...patch.newValues };
  }
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
      [withArgs(patch.fieldName, patch.fieldArguments)]: patch.newValue
    };
  }
}

function applyInsertElement(
  patch: CachePatch.InsertElement,
  cache: MutableEntityCache
): void {
  if (entityAndFieldExists(cache, patch)) {
    const fieldNameWithArgs = withArgs(patch.fieldName, patch.fieldArguments);
    // Shallow mutation of cache OK as we have a shallow copy
    // tslint:disable-next-line:no-any
    const arrCopy =
      cache[patch.id][fieldNameWithArgs] === null
        ? []
        : [...(cache[patch.id][fieldNameWithArgs] as Array<any>)];
    arrCopy.splice(patch.index, 0, patch.newValue);

    cache[patch.id] = {
      ...cache[patch.id],
      [fieldNameWithArgs]: arrCopy
    };
  }
}

function applyRemoveElement(
  patch: CachePatch.RemoveElement,
  cache: MutableEntityCache
): void {
  if (entityAndFieldExists(cache, patch)) {
    const fieldNameWithArgs = withArgs(patch.fieldName, patch.fieldArguments);
    // tslint:disable-next-line:no-any
    const arrCopy = [...(cache[patch.id][fieldNameWithArgs] as Array<any>)];
    arrCopy.splice(patch.index, 1);
    // Shallow mutation of cache OK as we have a shallow copy
    cache[patch.id] = {
      ...cache[patch.id],
      [fieldNameWithArgs]: arrCopy
    };
  }
}

function applyRemoveEntityElement(
  patch: CachePatch.RemoveEntityElement,
  cache: MutableEntityCache
): void {
  if (entityAndFieldExists(cache, patch)) {
    const fieldNameWithArgs = withArgs(patch.fieldName, patch.fieldArguments);
    const arr = cache[patch.id][fieldNameWithArgs] as ReadonlyArray<NormKey>;
    // Shallow mutation of cache OK as we have a shallow copy
    cache[patch.id] = {
      ...cache[patch.id],
      [fieldNameWithArgs]: arr.filter(x => x !== patch.entityId)
    };
  }
}

function entityAndFieldExists(
  cache: NormMap,
  patch: {
    readonly id: string;
    readonly fieldName: string;
    readonly fieldArguments: {} | undefined;
  }
): boolean {
  return !!(
    cache[patch.id] &&
    cache[patch.id][withArgs(patch.fieldName, patch.fieldArguments)] !==
      undefined
  );
}

function entityExists(cache: NormMap, patch: { readonly id: string }): boolean {
  return !!cache[patch.id];
}

function withArgs(fieldName: string, fieldArguments: {} | undefined): string {
  if (fieldArguments === undefined) {
    return fieldName;
  }
  const hashedArgs = JSON.stringify(fieldArguments);
  return fieldName + "(" + hashedArgs + ")";
}
