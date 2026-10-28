#!/bin/bash
# Copyright (c) 2026 Zeno Productions. All rights reserved.
set -e
pnpm install --frozen-lockfile
pnpm --filter db push
