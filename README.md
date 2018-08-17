# gql-cache-patch

[![npm version][version-image]][version-url]
[![travis build][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![code style: prettier][prettier-image]][prettier-url]
[![MIT license][license-image]][license-url]

Declarative patching for [gql-cache](https://www.npmjs.com/package/gql-cache)

## Overview

This package contains functions to do declarative patching of [gql-cache](https://www.npmjs.com/package/gql-cache). It should also work with any cache that is a plain JS object with a flat normalized structure.

You can declare patches as data and then apply them. One usage is to apply optimistic updates to the cache when doing mutations.

Since the patches are data you can also return patches from the server. So the server could return patches to the client as part of the mutation response, and the client can then apply them to get the needed upates. One benefit of this is that the server now is responsible for knowing what parts of the schema needs updating after a mutation has been executed.

## How to install

```
npm install gql-cache-patch --save
```

## How to use

The package has the following constructor functions for creating the patches:

```ts
export function createEntity<T>(
  id: GraphQLEntityCache.EntityId,
  newValue: T
): CreateEntity;

export function deleteEntity(id: GraphQLEntityCache.EntityId): DeleteEntity;

export function updateField<T>(
  id: string,
  fieldName: Extract<keyof T, string>,
  newValue: GraphQLEntityCache.EntityFieldValue | null
): UpdateField;

export function insertElement<T>(
  id: GraphQLEntityCache.EntityId,
  fieldName: Extract<keyof T, string>,
  index: number,
  newValue: GraphQLEntityCache.EntityFieldValue
): InsertElement;

export function removeElement<T>(
  id: GraphQLEntityCache.EntityId,
  fieldName: Extract<keyof T, string>,
  index: number
): RemoveElement;

export function removeEntityElement<T>(
  id: GraphQLEntityCache.EntityId,
  fieldName: Extract<keyof T, string>,
  entityId: GraphQLEntityCache.EntityId
): RemoveEntityElement;
```

It also has a function to apply the patches to a cache and returns a tuple of the new cache object and stale entities map:

```ts
export function apply(
  patches: ReadonlyArray<CachePatch.CachePatch>,
  cache: GraphQLEntityCache.EntityCache,
  staleEntities: GraphQLEntityCache.StaleEntities
): [GraphQLEntityCache.EntityCache, GraphQLEntityCache.StaleEntities];
```

Here is a small example:

```js
import { createEntity, apply } from "gql-cache-patch";

const cache = {};
const stale = {};
const patch = createEntity("myid", { id: "myid", name: "foo" });
const [patchedCache, patchedStale] = apply(testCase.patches, cache, stale);

console.log(JSON.stringify(cache));
/* { myid: { id: "myid", name: "foo" } } */
```

## Future work

It would be interesting to investigate returning patches as an [extension](http://facebook.github.io/graphql/June2018/#sec-Response-Format) of the graphql response.

[version-image]: https://img.shields.io/npm/v/gql-cache-patch.svg?style=flat
[version-url]: https://www.npmjs.com/package/gql-cache-patch
[travis-image]: https://travis-ci.org/dividab/gql-cache-patch.svg?branch=master&style=flat
[travis-url]: https://travis-ci.org/dividab/gql-cache-patch
[coveralls-image]: https://coveralls.io/repos/github/dividab/gql-cache-patch/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/github/dividab/gql-cache-patch?branch=master
[license-image]: https://img.shields.io/github/license/dividab/gql-cache-patch.svg?style=flat
[license-url]: https://opensource.org/licenses/MIT
[prettier-image]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat
[prettier-url]: https://github.com/prettier/prettier
