import * as CachePatch from "./cache-patch";
import { NormObj, NormMap, NormKey, FieldsMap } from "graphql-norm";
import * as GraphQLNormStale from "graphql-norm-stale";

interface MutableEntityCache {
  // tslint:disable-next-line:readonly-keyword
  [id: string]: NormObj;
}

export function split(
  patches: ReadonlyArray<CachePatch.CachePatch>
): [
  ReadonlyArray<CachePatch.ChangePatch>,
  ReadonlyArray<CachePatch.InvalidationPatch>
] {
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
  return [changePatches, invalidationPatches];
}

export function apply(
  patches: ReadonlyArray<CachePatch.CachePatch>,
  cache: NormMap,
  staleMap: FieldsMap
): [NormMap, FieldsMap] {
  if (patches.length === 0) {
    return [cache, staleMap];
  }
  const [changePatches, invalidationPatches] = split(patches);
  const newCache = applyChanges(changePatches, cache);
  const newStale = GraphQLNormStale.applyPatches(
    invalidationPatches,
    newCache,
    staleMap
  );
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
