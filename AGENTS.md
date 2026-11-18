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


## Mandatory publication and workflow security rules

These constraints apply to both human contributors and automated coding agents.
Before creating a public commit, PR, Issue, comment, artifact, or Pages deployment:

1. **No secrets:** Never paste or commit access tokens, GitHub PATs, API keys, passwords, SSH/private keys, session cookies, sensitive configuration, or credentials. Read secrets only from a dedicated secret store, and use a least-privilege short-lived credential if needed. If exposure occurs, stop publication, revoke/rotate privately, and never copy the value into a public remediation issue.
2. **No restricted academic data:** Never publish private Drive/ELMS URLs, instructor PDFs, office/lecture material, student records, answer keys, unreleased homework or copyrighted figures without documented redistribution rights. Solution release alone is insufficient. Prefer original independent examples and neutral source references.
3. **No dangerous workflows:** Keep third-party GitHub Actions pinned to verified full commit SHAs; set minimal explicit workflow permissions; do not introduce \`pull_request_target\`, \`workflow_run\`, or workflow-wide write tokens without separate security review. Deploy only from reviewed \`main\` changes.
4. **Do not bypass checks:** The publication safety gate and Gitleaks secret scan must pass before merge. Never disable, skip, weaken or add an exclusion to either tool merely to clear a failing check. A false positive requires documented maintainer review and a tested narrow fix.
5. **Pre-merge review:** Inspect the full diff for accidental publication and workflow privilege changes. Require independent approval for security-control changes when GitHub branch protections support it. Verify Pages after deploy; do not treat passing CI as proof of publication safety or licensing.
6. **New repositories:** Copy this policy, the pinned-workflow baseline, secret scanning and publication guard into every new course repo before enabling Pages.

The automated \`scripts/check_publication.py\` gate blocks common accidental disclosure paths, selected restricted file formats, private course-storage URLs, and unsafe workflow references. It cannot determine copyright ownership or detect every secret; maintain human rights/security review as a separate requirement.
