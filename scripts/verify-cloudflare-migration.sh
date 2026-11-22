#!/usr/bin/env bash
# scripts/verify-cloudflare-migration.sh
#
# Verifies every live routing, redirect, content-negotiation, header, and
# agent-discovery contract for linxule.com on Cloudflare Workers + Static Assets.
# Safe to run against either the preview Worker URL or production at any time.
#
# Usage:
#   bun run verify:live
#   bash scripts/verify-cloudflare-migration.sh
#   BASE_URL=https://linxule-com-preview.linxule.workers.dev bash scripts/verify-cloudflare-migration.sh
#   BASE_URL=https://linxule.com bash scripts/verify-cloudflare-migration.sh
#
# Exits 0 if all checks pass, nonzero otherwise.

set -u

BASE_URL="${BASE_URL:-https://linxule-com-preview.linxule.workers.dev}"
BASE_URL="${BASE_URL%/}"

BASE_HOST="${BASE_URL#http://}"
BASE_HOST="${BASE_HOST#https://}"
BASE_HOST="${BASE_HOST%%/*}"
BASE_HOST="${BASE_HOST%%:*}"

PASS=0
FAIL=0
FAILED_CASES=()

pass() {
  echo "PASS  $*"
  PASS=$((PASS + 1))
}

fail() {
  echo "FAIL  $*"
  FAIL=$((FAIL + 1))
  FAILED_CASES+=("$*")
}

# fetch_headers METHOD PATH [EXTRA_CURL_ARGS...]
# Uses HEAD (-I) or GET (-D - -o /dev/null) without following redirects.
fetch_headers() {
  local method="$1" path="$2"
  shift 2
  if [[ "$method" == "GET" ]]; then
    curl -sS --max-time 15 -D - -o /dev/null ${@+"$@"} "${BASE_URL}${path}" 2>/dev/null | tr -d '\r' || true
  else
    curl -sS --max-time 15 -I ${@+"$@"} "${BASE_URL}${path}" 2>/dev/null | tr -d '\r' || true
  fi
}

# Extract the final HTTP status code (ignoring any 1xx interim responses such as 103 Early Hints).
parse_status() {
  printf '%s\n' "$1" | awk '/^HTTP\//{s=$2} END{print s}'
}

# Extract and join all values of HEADER from the final HTTP response block.
parse_header() {
  local headers="$1" target
  target=$(printf '%s' "$2" | tr '[:upper:]' '[:lower:]')
  printf '%s\n' "$headers" | awk -v target="$target" '
    /^HTTP\// { vals=""; next }
    {
      idx = index($0, ":")
      if (idx > 0) {
        key = tolower(substr($0, 1, idx - 1))
        if (key == target) {
          val = substr($0, idx + 1)
          sub(/^[ \t]+/, "", val)
          sub(/[ \t]+$/, "", val)
          vals = (vals == "" ? val : vals ", " val)
        }
      }
    }
    END { print vals }
  '
}

# Case-insensitive check that a comma-separated Vary header contains an exact token.
has_vary_token() {
  local vary_val="$1" want_token
  want_token=$(printf '%s' "$2" | tr '[:upper:]' '[:lower:]')
  printf '%s\n' "$vary_val" | awk -v want="$want_token" '
    {
      n = split($0, parts, ",")
      for (i = 1; i <= n; i++) {
        t = tolower(parts[i])
        gsub(/^[ \t]+|[ \t]+$/, "", t)
        if (t == want) { found = 1; exit }
      }
    }
    END { exit(found ? 0 : 1) }
  '
}

# check_redirect PATH WANT_STATUS WANT_DEST [LABEL]
# Inspects the raw Location header (rather than curl %{redirect_url}) so
# fragment anchors such as /cv#publications are verified verbatim.
check_redirect() {
  local path="$1" want_status="$2" want_dest="$3" label="${4:-$1 → $3}"
  local headers got_status got_loc norm_loc
  headers=$(fetch_headers HEAD "$path")
  got_status=$(parse_status "$headers")
  got_loc=$(parse_header "$headers" "Location")
  norm_loc="$got_loc"
  if [[ "$norm_loc" == "${BASE_URL}"/* ]]; then
    norm_loc="${norm_loc#"${BASE_URL}"}"
  elif [[ "$norm_loc" == "${BASE_URL}" ]]; then
    norm_loc="/"
  fi

  if [[ "$got_status" == "$want_status" && "$norm_loc" == "$want_dest" ]]; then
    pass "redirect $label ($got_status → $got_loc)"
  else
    fail "redirect $label: got status='${got_status}' location='${got_loc}' (want ${want_status} '${want_dest}')"
  fi
}

# check_accept PATH ACCEPT WANT_CT [REQUIRE_VARY_ACCEPT]
# Verifies direct 200 content negotiation with no redirect hop.
check_accept() {
  local path="$1" accept="$2" want_ct="$3" require_vary="${4:-no}"
  local headers got_status got_ct got_vary ok=1 reasons=""
  headers=$(fetch_headers GET "$path" -H "Accept: $accept")
  got_status=$(parse_status "$headers")
  got_ct=$(parse_header "$headers" "Content-Type")
  got_vary=$(parse_header "$headers" "Vary")

  if [[ "$got_status" != "200" ]]; then
    ok=0
    reasons="${reasons}status=${got_status}(want 200) "
  fi
  if [[ "$got_ct" != *"$want_ct"* ]]; then
    ok=0
    reasons="${reasons}content-type='${got_ct}'(want ~'${want_ct}') "
  fi
  if [[ "$require_vary" == "yes" ]] && ! has_vary_token "$got_vary" "Accept"; then
    ok=0
    reasons="${reasons}vary='${got_vary}'(missing Accept) "
  fi

  if [[ "$ok" -eq 1 ]]; then
    if [[ "$require_vary" == "yes" ]]; then
      pass "accept $path [Accept: $accept] → 200 $got_ct (Vary: $got_vary)"
    else
      pass "accept $path [Accept: $accept] → 200 $got_ct"
    fi
  else
    fail "accept $path [Accept: $accept]: ${reasons% }"
  fi
}

# check_endpoint METHOD PATH WANT_STATUS [WANT_CT] [WANT_ACAO] [LABEL]
check_endpoint() {
  local method="$1" path="$2" want_status="$3" want_ct="${4:-}" want_acao="${5:-}" label="${6:-$1 $2}"
  local headers got_status got_ct got_acao ok=1 reasons=""
  headers=$(fetch_headers "$method" "$path")
  got_status=$(parse_status "$headers")
  got_ct=$(parse_header "$headers" "Content-Type")
  got_acao=$(parse_header "$headers" "Access-Control-Allow-Origin")

  if [[ "$got_status" != "$want_status" ]]; then
    ok=0
    reasons="${reasons}status=${got_status}(want ${want_status}) "
  fi
  if [[ -n "$want_ct" && "$got_ct" != *"$want_ct"* ]]; then
    ok=0
    reasons="${reasons}content-type='${got_ct}'(want ~'${want_ct}') "
  fi
  if [[ -n "$want_acao" && "$got_acao" != "$want_acao" ]]; then
    ok=0
    reasons="${reasons}acao='${got_acao}'(want '${want_acao}') "
  fi

  if [[ "$ok" -eq 1 ]]; then
    pass "endpoint $label ($got_status${got_ct:+, $got_ct}${want_acao:+, ACAO=$got_acao})"
  else
    fail "endpoint $label: ${reasons% }"
  fi
}

echo "=== Verifying ${BASE_URL} ==="

echo
echo "--- [1] Favicon shortcuts ---"
check_redirect /favicon.ico 301 /assets/favicon.svg
check_redirect /favicon.png 301 /assets/favicon-32.png

echo
echo "--- [2] DAO governance & legacy topic consolidation ---"
check_redirect /daogov          301 /writing/dao-governance-resources
check_redirect /daogov/foo      301 /writing/dao-governance-resources
check_redirect /curation-dao    301 /writing/dao-governance-resources
check_redirect /curation-dao/x  301 /writing/dao-governance-resources
check_redirect /curation-mgmt   301 /cv
check_redirect /about           301 /
check_redirect /terms           301 /license.xml
check_redirect /markdown        301 /

echo
echo "--- [3] Publications → CV anchor (#publications preserved) ---"
check_redirect /publications      301 /cv#publications
check_redirect /publications/foo  301 /cv#publications
check_redirect /publication/bar   301 /cv#publications

echo
echo "--- [4] Posts archive ---"
check_redirect /posts/2024/06/openai-discord                 301 https://github.com/linxule/openai-assistants-discord-bot
check_redirect /posts/2023/10/macaw                          301 /writing/macaw-markdown-academic-writing
check_redirect /posts/2020/06/resources-for-dao-research/foo 301 /writing/dao-governance-resources
check_redirect /posts/random/thing                           301 /writing

echo
echo "--- [5] Case variants & single-hop trailing-slash legacy check ---"
check_redirect /CV      301 /cv
check_redirect /cV      301 /cv
check_redirect /CV/     301 /cv "/CV/ → /cv (single-hop)"
check_redirect /CV-zh   301 /cv-zh
check_redirect /CV-ZH   301 /cv-zh
check_redirect /Writing 301 /writing
check_redirect /Making  301 /making

echo
echo "--- [6] Chinese CV shortcuts (literal + percent-encoded) ---"
check_redirect /简历                301 /cv-zh
check_redirect /%E7%AE%80%E5%8E%86  301 /cv-zh
check_redirect /履历                301 /cv-zh
check_redirect /%E5%B1%A5%E5%8E%86  301 /cv-zh

echo
echo "--- [7] LLMs metadata aliases ---"
check_redirect /llm            301 /llms.txt
check_redirect /llm.txt        301 /llms.txt
check_redirect /llms           301 /llms.txt
check_redirect /llms-full.txt  301 /llms.txt
check_redirect /ai             301 /llms.txt
check_redirect /for-ai         301 /llms.txt

echo
echo "--- [8] Legacy archives & projects ---"
check_redirect /sitemap                      301 /sitemap.xml
check_redirect /resume                       301 /cv
check_redirect /talkmap                      301 /talks
check_redirect /talkmap.html                 301 /talks
check_redirect /collection-archive           301 /writing
check_redirect /year-archive                 301 /writing
check_redirect /page-archive                 301 /writing
check_redirect /archive-layout-with-content  301 /writing
check_redirect /projects                     301 /builds
check_redirect /projects.md                  301 /builds.md
check_redirect /projects/md_academic         301 /writing/macaw-markdown-academic-writing
check_redirect /projects/foo                 301 /writing

echo
echo "--- [9] Old talks & teaching ---"
check_redirect /talks/2023-08/aom              301 /talks
check_redirect /talks/2023-04/ukfan            301 /cv
check_redirect /talks/2023-08-01/aom           301 /talks
check_redirect /talks/2023-12/methods-reading  301 /talks
check_redirect /talks/2023-12/sei              301 /talks
check_redirect /talks/2024-05/ccc              301 /talks
check_redirect /talks/2024-08/aom              301 /talks
check_redirect /teaching/2014-spring-teaching-1 301 /teaching

echo
echo "--- [10] Tag renames ---"
check_redirect /tag/academic-writing          301 /writing
check_redirect /tag/ai-workflows              301 /tag/ai-research-workflow
check_redirect /tag/organizational-principles 301 /tag/organizational-design
check_redirect /tag/qualitative-methods       301 /tag/qualitative-research
check_redirect /tag/research-methods          301 /tag/research-methodology

echo
echo "--- [11] MCP well-known alias (308) ---"
check_redirect /.well-known/mcp.json 308 /.well-known/mcp/server-card.json

echo
echo "--- [12] Trailing-slash canonicalization (308) ---"
for slash_path in /cv /cv-zh /writing /making /talks /papers /thinking /teaching /concepts /builds /connect; do
  check_redirect "${slash_path}/" 308 "${slash_path}"
done

echo
echo "--- [13] Accept: text/markdown direct 200 negotiation (no redirect hop) ---"
for neg_path in / /cv /writing /papers /builds /connect; do
  check_accept "$neg_path" "text/markdown" "text/markdown" "yes"
  check_accept "$neg_path" "text/html"     "text/html"     "no"
done
check_endpoint GET /cv.md 200 "text/markdown" "" "GET /cv.md (direct twin)"

echo
echo "--- [14] Agent discovery & static endpoints ---"
check_endpoint HEAD /llms.txt                           200 "text/plain"
check_endpoint HEAD /feed.xml                           200 "application/atom+xml"
check_endpoint HEAD /license.xml                        200 "application/rsl+xml"
check_endpoint HEAD /.well-known/api-catalog            200 "application/linkset+json"
check_endpoint HEAD /.well-known/ai-catalog.json        200 "application/json" "*"
check_endpoint GET  /.well-known/mcp/server-card.json   200 "application/json" "*"
check_endpoint HEAD /.well-known/mcp/server-card.json   200 "application/json" "*"
check_endpoint HEAD /.well-known/agent-skills/index.json 200 "application/json"
check_endpoint HEAD /.build-manifest.json               200 "application/json"
check_endpoint HEAD /site-index.json                    200 "application/json"
check_endpoint HEAD /sitemap.xml                        200
check_endpoint HEAD /robots.txt                         200
check_endpoint HEAD /pagefind/pagefind.js               200
check_endpoint HEAD /tsm                                200

echo
echo "--- [15] Immutable asset cache ---"
asset_headers=$(fetch_headers HEAD /assets/favicon-32.png)
asset_status=$(parse_status "$asset_headers")
asset_cc=$(parse_header "$asset_headers" "Cache-Control")
if [[ "$asset_status" == "200" && "$asset_cc" == *"max-age=31536000"* && "$asset_cc" == *"immutable"* ]]; then
  pass "asset cache /assets/favicon-32.png (200, Cache-Control: $asset_cc)"
else
  fail "asset cache /assets/favicon-32.png: status='${asset_status}' cache-control='${asset_cc}' (want 200 with max-age=31536000 and immutable)"
fi

echo
echo "--- [16] Link discovery header on /cv ---"
cv_headers=$(fetch_headers HEAD /cv)
cv_link=$(parse_header "$cv_headers" "Link")
for rel in llms-txt service-doc api-catalog sitemap describedby agent-skills ai-catalog service-desc; do
  if [[ "$cv_link" == *"rel=\"${rel}\""* ]]; then
    pass "Link header on /cv includes rel=\"${rel}\""
  else
    fail "Link header on /cv missing rel=\"${rel}\" (got: '${cv_link}')"
  fi
done

echo
echo "--- [17] Preview vs. production X-Robots-Tag guard ---"
root_headers=$(fetch_headers HEAD /)
root_robots=$(parse_header "$root_headers" "X-Robots-Tag")
root_robots_lower=$(printf '%s' "$root_robots" | tr '[:upper:]' '[:lower:]')
if [[ "$BASE_HOST" == *.workers.dev ]]; then
  if [[ "$root_robots_lower" == *"noindex"* ]]; then
    pass "preview guard on ${BASE_HOST}: X-Robots-Tag='${root_robots}'"
  else
    fail "preview guard on ${BASE_HOST}: expected X-Robots-Tag containing noindex, got '${root_robots}'"
  fi
elif [[ "$BASE_HOST" == "linxule.com" ]]; then
  if [[ "$root_robots_lower" != *"noindex"* ]]; then
    pass "production guard on ${BASE_HOST}: no X-Robots-Tag noindex (got '${root_robots:-<absent>}')"
  else
    fail "production guard on ${BASE_HOST}: unexpected X-Robots-Tag='${root_robots}'"
  fi
else
  echo "INFO  custom host '${BASE_HOST}' — skipping .workers.dev / linxule.com X-Robots-Tag assertion (got '${root_robots:-<absent>}')"
fi

echo
echo "=== RESULT: ${PASS} passed, ${FAIL} failed ==="
if [[ ${FAIL} -gt 0 ]]; then
  echo
  echo "Failed cases:"
  printf '  - %s\n' "${FAILED_CASES[@]}"
fi

if [[ ${FAIL} -gt 125 ]]; then
  exit 125
fi
exit "${FAIL}"
