#!/bin/bash
# Submit site URLs to search engines after build
# IndexNow → Bing, Yandex, Naver, Seznam
# Sitemap ping → Google
# Runs automatically after build, or manually: bash scripts/indexnow-submit.sh

KEY="${INDEXNOW_KEY:?Set INDEXNOW_KEY env var}"
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
