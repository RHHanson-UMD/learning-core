# Shared math engine releases and course adoption

Status: **proposed release policy**, 2026-11-18. Do not interpret this document as evidence that any tag or package has been published.

## Decision

- `learning-core` is a source repository for **pure, tested ES modules**. It remains `"private": true` in `package.json`; no npm publishing, CDN, runtime fetch, bundler, backend, or shared live dependency is required.
- Each course is independently hosted as static files on its own GitHub Pages site. Adopt only genuinely reusable modules by **copying reviewed source from a named, immutable release tag plus recorded commit SHA**, into that course's own `site/` tree. Commit the copy in the consuming course's repo.
- An existing course copy is **not** automatically updated when a library release changes. Maintainers explicitly review, re-test, and adopt each version. Course pages must still load if GitHub or this source repo is temporarily unavailable.
- Current state: ENEE-641 ships its own subset-sum engine. Treat it as independently maintained until a source/API diff and functional comparison are complete. Do not replace it merely to remove duplication.
- This policy does not authorize reuse of restricted academic content or license a third-party work. Share only original/publication-authorized code, with attribution where applicable.

## Suggested first release

The `package.json` version is currently `0.1.0`, but **no stable tag is claimed here**. Before creating any `v0.1.0` tag:

1. Review public source, inputs, invariants, math conventions, and licensed provenance for each module.
2. Ensure the independent truth-table and graph-oracle tests pass with Node 20+ using `npm test` on a clean checkout.
3. Confirm CI tests pass for the exact commit being tagged.
4. Make a small, reviewed release PR with API notes and compatibility impact; merge it to `main`.
5. Create an annotated `v0.1.0` tag on the reviewed commit. Do not rewrite a published version tag. Publish a short changelog and full commit SHA.

If a breaking API or mathematical convention changes, use a new version and document a migration rather than silently editing a previously vendored source.

## Public module contracts (current implementations)

### `src/graph.js`

`isClique(vertices, edges, selected) -> boolean`

- Pass vertex labels as an array, edges as two-label arrays, and selected labels as an array.
- Graph is interpreted as **undirected**. An edge `[u,v]` works in both directions.
- Duplicate selected labels and selected labels not in `vertices` return `false`.
- The empty selection and a single known vertex return `true` (vacuous clique membership).
- Missing pairwise edges return `false`. This function verifies a proposed clique, not an algorithm to find a maximum clique.
- Current implementation assumes well-formed arrays and simple label identifiers; malformed-input validation and identifier restrictions are not yet formalized. Do not claim it handles arbitrary graphs or labels.

### `src/subset-sum.js`

`evaluateSubsetSum(assignment) -> result`

- `assignment` must be an array of **exactly three numeric Boolean digits** (0 or 1); invalid inputs throw `TypeError`.
- Teaching construction: seven decimal places `x1 x2 x3 C1 C2 C3 C4`; target `1114444`; 14 row numbers.
- Returns picked rows, seven digit sums, each clause's contribution, CNF satisfaction, and whether summed digits equal target.
- In this fixed example the reduction must satisfy `result.formulaSatisfied === result.matchesTarget` for **all eight assignments**; at least one independent oracle must verify those results.
- This is a **specific teaching example**, not a general-purpose arbitrary CNF-to-SUBSET-SUM converter.

## Adoption checklist for each consuming course

1. Identify concrete need and maintainers in a course-owned issue; note why duplication/independent code is insufficient.
2. Pin release `vX.Y.Z` **and full commit SHA** (verify tag targets SHA) in a course-owned `vendor` manifest or source header. Copy only required pure JS files into a suitable `site/` location.
3. Retain the module's original attribution and its source URL; do not distribute original textbook artwork or private course files.
4. Keep imports relative (e.g. `./vendor/learning-core/graph.js`), not `https://raw.githubusercontent.com/...`; pages must function offline after loading and without a dependency on third-party network imports.
5. Validate expected mathematical results using independent course-specific fixtures, edge and counterexample cases, and browser-based smoke tests. Review compatibility with the previous course engine before replacing it.
6. In the PR, record source tag/SHA, copied file paths, exact tests executed, import changes, affected pages, Pages subpath checks, and rollback commit.
7. Merge/deploy course PR under the course maintenance chat, then verify course Pages live and log the source version. A green library workflow does not verify a consuming course.

## Compatibility and recovery

| Library module | Known consuming implementation | Adoption state |
| --- | --- | --- |
| `graph.js` | No pinned course import confirmed | Available for evaluation; no automatic rollout |
| `subset-sum.js` | ENEE-641 has a separate engine | Diff and independent compatibility test required |

If an adopted version fails, revert the consuming course PR or restore its previous vendored files while keeping the main Pages site live. Report the failure in the course repo and cross-reference a `learning-core` issue. Fixes should ship as a **new** immutable tag.

**Scope reminder:** This repository is not a teaching course or a deployment site; no course code is changed by editing this document.
