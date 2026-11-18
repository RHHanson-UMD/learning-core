# learning-core

Pure JavaScript mathematical models that support the independent RHHanson-UMD learning sites. This repository contains **no runtime web service**.

Current modules:

- `src/subset-sum.js`: fixed 3-CNF-SAT to SUBSET-SUM teaching reduction.
- `src/graph.js`: clique verification on undirected graphs.

## Validate

Use Node 20+ (no external runtime dependencies):

```sh
npm test
```

The test suite includes independently derived all-assignment truth-table and graph-oracle checks in `test/independent-oracles.test.js`, in addition to focused unit tests.

## Reuse policy

See [Versioning and course adoption](docs/VERSIONING.md) and [maintainer instructions](AGENTS.md). `package.json` is deliberately `"private": true`: **this is not an npm-published package**. Course sites may vendor reviewed, source-tag/commit-SHA-pinned ES modules into their own `site/` trees, then test and deploy independently. No floating branch, CDN import, or automatic consumer upgrade.

ENEE-641 currently includes a separately maintained subset-sum engine. It must not be replaced without an explicit source/API comparison, independently verified regression tests, and a course-owned PR.

No original proprietary textbook figures, homework answer PDFs, or private academic documents are distributed here.
