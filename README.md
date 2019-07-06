# graphql-norm-patch

[![npm version][version-image]][version-url]
[![travis build][travis-image]][travis-url]
[![Coverage Status][codecov-image]][codecov-url]
[![code style: prettier][prettier-image]][prettier-url]
[![MIT license][license-image]][license-url]

Declarative patching of normalized GraphQL responses

## Overview

This package contains functions to do declarative patching of normalized GraphQL responses. I was design to work with [graphql-norm](https://www.npmjs.com/package/graphql-norm) but it should also work with any plain JS object that contains a normalized structure of GraphQL responses.

You can declare patches as data and then apply them. One usage is to apply optimistic updates to the cache when doing mutations.

Since the patches are data you can also return patches from the server. So the server could return patches to the client as part of the mutation response, and the client can then apply them to get the needed upates. One benefit of this is that the server now is responsible for knowing what parts of the schema needs updating after a mutation has been executed.

## How to install

```
npm install graphql-norm-patch --save
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
import { createEntity, apply } from "graphql-norm-patch";

const cache = {};
const stale = {};
const patch = createEntity("myid", { id: "myid", name: "foo" });
const [patchedCache, patchedStale] = apply(testCase.patches, cache, stale);

console.log(JSON.stringify(cache));
/* { myid: { id: "myid", name: "foo" } } */
```

## How patches are applied to the cache

A patch always specifies an ID for an entity in the cache. If the specified ID does not exist in cache, applying the patch will silently do nothing. The exception to this rule is the `CreateEntity` patch which will create the entity in the cache.

Applying patches that specify a field name will only have effect if that field name already exits in the cache. If the field name does not exist on the specified entity in the cache, then applying the patch will silently do nothing. If a field exists but have value `null` and a `InsertElement` patch is applied to that field, a new array will automatically be created when applying the patch.

## Type safety

This package has built-in typescript types, and when using typescript some type saftey can be achieved by using types generated for the GraphQL schema. Types for the schema can be genereted using for example [graphql-code-generator](https://www.npmjs.com/package/graphql-code-generator) and then be used as this:

```ts
import { updateField } from "graphql-norm-patch";

const patch = updateField<GraphQLSchemaTypes.Foo>("myid", "myfield", "myvalue");
```

## Future work

It would be interesting to investigate returning patches as an [extension](http://facebook.github.io/graphql/June2018/#sec-Response-Format) of the graphql response.

## How to develop

To execute the tests run `yarn test`.

## How to publish

```
yarn version --patch
yarn version --minor
yarn version --major
```

[version-image]: https://img.shields.io/npm/v/graphql-norm-patch.svg?style=flat
[version-url]: https://www.npmjs.com/package/graphql-norm-patch
[travis-image]: https://travis-ci.com/dividab/graphql-norm-patch.svg?branch=master&style=flat
[travis-url]: https://travis-ci.com/dividab/graphql-norm-patch
[codecov-image]: https://codecov.io/gh/dividab/graphql-norm-patch/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/dividab/graphql-norm-patch
[license-image]: https://img.shields.io/github/license/dividab/graphql-norm-patch.svg?style=flat
[license-url]: https://opensource.org/licenses/MIT
[prettier-image]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat
[prettier-url]: https://github.com/prettier/prettier
