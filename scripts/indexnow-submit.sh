#!/bin/bash
# Submit site URLs to search engines after build
# IndexNow → Bing, Yandex, Naver, Seznam
# Manual publication:
#   INDEXNOW_KEY="$(tail -n 1 src/indexnow-key.njk)" INDEXNOW_FORCE=1 bun run publish:indexnow
# INDEXNOW_KEY is the public verification token rendered by src/indexnow-key.njk.
# It is not a secret. INDEXNOW_FORCE=1 is reserved for an intentional manual run.

if [ -z "${INDEXNOW_KEY:-}" ]; then
  echo "IndexNow: INDEXNOW_KEY not set — skipping submission (non-fatal)"
  exit 0
fi
# Only submit on production deploys. Previews and local runs must never advertise
# themselves to search engines. Strict fail-closed allowlist: proceed ONLY when
# VERCEL_ENV=production, Workers Builds CI on main (WORKERS_CI=1 +
# WORKERS_CI_BRANCH=main), Cloudflare Pages main (CF_PAGES_BRANCH=main), or an
# explicit manual override (INDEXNOW_FORCE=1).
IS_PROD_DEPLOY=0
if [ "${VERCEL_ENV:-}" = "production" ]; then
  IS_PROD_DEPLOY=1
elif [ "${WORKERS_CI:-}" = "1" ] && [ "${WORKERS_CI_BRANCH:-}" = "main" ]; then
  IS_PROD_DEPLOY=1
elif [ "${CF_PAGES_BRANCH:-}" = "main" ]; then
  IS_PROD_DEPLOY=1
fi

if [ "$IS_PROD_DEPLOY" != "1" ] && [ "${INDEXNOW_FORCE:-}" != "1" ]; then
  echo "IndexNow: skipping (production only — VERCEL_ENV='${VERCEL_ENV:-}' WORKERS_CI='${WORKERS_CI:-}' WORKERS_CI_BRANCH='${WORKERS_CI_BRANCH:-}' CF_PAGES_BRANCH='${CF_PAGES_BRANCH:-}')"
  exit 0
fi
if [ "${INDEXNOW_FORCE:-}" = "1" ] && [ "$IS_PROD_DEPLOY" != "1" ]; then
  echo "IndexNow: INDEXNOW_FORCE=1 — proceeding with manual publication"
fi
KEY="$INDEXNOW_KEY"
HOST="linxule.com"
KEY_LOCATION="https://${HOST}/${KEY}.txt"

# Only run in CI/deploy or when explicitly called
if [ ! -d "_site" ]; then
  echo "No _site directory found. Run after build."
  exit 1
fi

# Build URL list from sitemap, excluding .md alternates, 404, and search
URLS=$(grep '<loc>' _site/sitemap.xml | sed 's/.*<loc>//;s/<\/loc>.*//' | grep -v '\.md$' | grep -v '404\.html' | grep -v '/search$' | sort)

# Format as JSON array without jq
URL_JSON="["
FIRST=true
while IFS= read -r url; do
  [ -z "$url" ] && continue
  if [ "$FIRST" = true ]; then
    URL_JSON="${URL_JSON}\"${url}\""
    FIRST=false
  else
    URL_JSON="${URL_JSON},\"${url}\""
  fi
done <<< "$URLS"
URL_JSON="${URL_JSON}]"

RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "https://api.indexnow.org/IndexNow" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d "{
    \"host\": \"${HOST}\",
    \"key\": \"${KEY}\",
    \"keyLocation\": \"${KEY_LOCATION}\",
    \"urlList\": ${URL_JSON}
  }")

HTTP_CODE=$(echo "$RESPONSE" | tail -1)
COUNT=$(echo "$URLS" | grep -c .)

if [ "$HTTP_CODE" = "200" ]; then
  echo "IndexNow: submitted ${COUNT} URLs successfully"
else
  echo "IndexNow: submission returned HTTP ${HTTP_CODE} (non-fatal)"
fi

# Note: Google deprecated sitemap ping (2023). GSC handles Google indexing via submitted sitemap.
