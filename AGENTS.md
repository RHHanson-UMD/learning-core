# AGENTS.md — learning-core

This repository owns pure, independently tested mathematical algorithms used by the independent RHHanson-UMD Learning Lab. It is **not a course site** and does not deploy GitHub Pages.

## Scope and implementation

- Keep pure JS math under `src/` and Node's independent test runner under `test/`. Do not couple the engines to the DOM, browser APIs, UI/CSS, telemetry, remote services, or a new framework.
- Treat `src/graph.js` as an undirected clique **verifier** and `src/subset-sum.js` as a fixed 3-CNF-SAT to SUBSET-SUM teaching construction. Do not misrepresent either as a general optimizer.
- Document assumptions and validate mathematical claims against independently derived expected outputs, including false cases, malformed inputs, boundary conditions, and combinatorial exhaustions when small enough.
- Run `npm test` with Node >= 20 and review the corresponding GitHub Actions run before merging any algorithm change.
- Keep public code original/authorized. Never commit private instructor sources, unreleased homework solutions, credentials, personal student data, or copied copyrighted artwork.

## Course independence and versioning

See [docs/VERSIONING.md](docs/VERSIONING.md). Source releases are tag/SHA pinned and *vendored* to a consuming course after review; no npm publication or CDN import is implied. This repository's `package.json` is currently marked `private`. ENEE-641 currently ships its own subset-sum implementation; **do not silently replace it**.

Course changes belong to their dedicated maintenance chats and repos (ENEE-620, ENEE-630 and ENEE-641). The main/shared-infrastructure chat coordinates this repo and the root portal. Cross-repo changes should be requested via explicit GitHub issues or transfer notes with expected API and tests.

## Workflow and reporting

Before editing, inspect live `main`, open issues/PRs, `README.md`, tests and actual Actions runs; the Project handoff is a dated snapshot. Prefer reviewable branches and scoped PRs. Afterward, report precise files and sources opened, commands/tests actually run, PR/commit link, CI status, unresolved compatibility risks and next action. Do not claim a release tag exists until it has been created and verified.

## Release and compatibility gate (tracked in #3)

Before changing a public engine API, inspect exported function signatures, edge-case behavior, tests and the vendored copies used by courses. Record a before/after compatibility table and confirm the consumer's own tests from a separately owned PR; do not interpret passing library tests as proof that consumers still work.

When the first reviewed version is ready, tag an immutable, tested commit and document the exact tag plus commit SHA, expected imports, input constraints, deterministic outputs and recovery instructions per `docs/VERSIONING.md`. Until a tag is actually created, describe versioning as **policy**, not a published release. Check `package.json`, `test/`, and workflow status before reporting successful tests. Do not modify student course repos as part of a shared-engine change without an explicit course-owned issue and review.
