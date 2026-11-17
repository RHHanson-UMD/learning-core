# learning-core

Pure JavaScript mathematical models that support the interactive UMD course sites.

Current modules:

- `src/subset-sum.js`: 3-CNF-SAT to SUBSET-SUM teaching reduction.
- `src/graph.js`: clique verification on undirected graphs.

Run tests with `npm test` (Node 20+; no external dependencies).

The ENEE 641 course starts with a tested copy of the SUBSET-SUM engine in its
static distribution. When the shared library is published and versioned, switch
course sites to pinned releases. Keep presentation and mathematics separate.

No external textbook diagrams or homework solution PDFs are distributed.
