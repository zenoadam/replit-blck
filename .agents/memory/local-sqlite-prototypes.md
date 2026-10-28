---
name: Local SQLite prototypes
description: Choosing and validating local SQLite support in this workspace.
---

For local-only SQLite prototypes, Node's built-in `node:sqlite` can avoid a third-party native addon and its package build-script approval requirements. The current Node 24 runtime supports `DatabaseSync`, but emits an experimental-feature warning.

**Why:** Installing `better-sqlite3` was blocked from running its native build script, so using the runtime module kept the prototype self-contained.

**How to apply:** Check the Node version and `node:sqlite` availability before using this approach in another artifact. Keep it limited to prototype workloads until SQLite support is stable in the chosen runtime.

---

© 2026 Zeno Productions. All rights reserved.
