#!/usr/bin/env bash
set -euo pipefail
[ -d node_modules ] || npm install
npm run typecheck
npm run test
npm run deploy:dry
if [ "${DEPLOY_LIVE:-false}" = "true" ]; then
  wrangler deploy
fi
