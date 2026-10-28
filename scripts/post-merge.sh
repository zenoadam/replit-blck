#!/bin/bash
# Copyright (c) 2026 Adam Zeineddine. All rights reserved.
set -e
pnpm install --frozen-lockfile
pnpm --filter db push
