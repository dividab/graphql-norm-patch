# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased](https://github.com/dividab/graphql-norm-patch/compare/v0.17.0...master)

### Changed

- Upgrade to 0.4.0 of graphql-norm-stale.

## [v0.17.0](https://github.com/dividab/graphql-norm-patch/compare/v0.16.0...v0.17.0) - 2019-10-02

### Added

- Upgrade peer deps. The graphql package now has built-in types so no peer dependency is required for the @types/graphql package.

## [v0.16.0](https://github.com/dividab/graphql-norm-patch/compare/v0.15.0...v0.16.0) - 2019-09-29

### Changed

- Upgrade `graphql-norm-stale` package.

## [v0.15.0](https://github.com/dividab/graphql-norm-patch/compare/v0.14.0...v0.15.0) - 2019-09-29

### Changed

- Upgrade `graphql-norm` package and switch to jest for testing. See PR [#12](https://github.com/dividab/graphql-norm-patch/pull/12).

### Added

- Separate patches for invalidation into its own union type and add functions `applyChanges`, `applyInvalidations`. See PR [#13](https://github.com/dividab/graphql-norm-patch/pull/13).

## [v0.14.0](https://github.com/dividab/graphql-norm-patch/compare/v0.13.0...v0.14.0) - 2019-07-06

### Changed

- Renamed the package from `gql-cache-patch` to `graphql-norm-patch`.

## [v0.13.0](https://github.com/dividab/graphql-norm-patch/compare/v0.12.0...v0.13.0) - 2019-04-10

### Added

- Added patch of type `UpdateEntity` to update multiple fields (without arguments) [#6](https://github.com/dividab/graphql-norm-patch/issues/6).

## [v0.12.0](https://github.com/dividab/graphql-norm-patch/compare/v0.11.0...v0.12.0) - 2019-04-01

### Added

- Generic type argument for field arguments [#10](https://github.com/dividab/graphql-norm-patch/pull/10).

## [v0.11.0](https://github.com/dividab/graphql-norm-patch/compare/v0.10.0...v0.11.0) - 2019-03-29

### Added

- Patches for fields with arguments [#8](https://github.com/dividab/graphql-norm-patch/pull/8).

## [v0.10.0](https://github.com/dividab/graphql-norm-patch/compare/v0.9.0...v0.10.0) - 2019-02-19

### Added

- Make invalidate recursive optional [#5](https://github.com/dividab/graphql-norm-patch/pull/5).

## [v0.9.0](https://github.com/dividab/graphql-norm-patch/compare/v0.8.0...v0.9.0) - 2018-09-28

### Changed

- Upgrade gql-cache dependency to version 0.9.0

## [v0.8.0](https://github.com/dividab/graphql-norm-patch/compare/v0.7.0...v0.8.0) - 2018-09-27

### Changed

- Upgrade gql-cache dependency to version 0.8.0

## [v0.7.0](https://github.com/dividab/graphql-norm-patch/compare/v0.6.0...v0.7.0) - 2018-09-14

### Changed

- Upgrade gql-cache dependency to version 0.7.0

## [v0.6.0](https://github.com/dividab/graphql-norm-patch/compare/v0.5.0...v0.6.0) - 2018-09-14

### Changed

- Upgrade gql-cache dependency to version 0.6.0

## [v0.5.0](https://github.com/dividab/graphql-norm-patch/compare/v0.4.0...v0.5.0) - 2018-09-14

### Added

Add invalidate recursive and invalidate entity functionality

## [v0.4.0](https://github.com/dividab/graphql-norm-patch/compare/v0.3.0...v0.4.0) - 2018-08-24

### Added

- Upgraded dependency to gql-cache.
- Fix check for non-existend field.

## [v0.3.0](https://github.com/dividab/graphql-norm-patch/compare/v0.2.0...v0.3.0) - 2018-08-23

### Added

- Determistic behaviour for missing data, see [#1](https://github.com/dividab/graphql-norm-patch/issues/1).

## [v0.2.0](https://github.com/dividab/graphql-norm-patch/compare/v0.1.0...v0.2.0) - 2018-08-23

### Added

- Defaults to `Entity` for the type parameter in the constructor functions.

## v0.1.0 - 2018-08-17

### Added

- Initial version.
