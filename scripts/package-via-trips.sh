#!/usr/bin/env bash
# Package the Via Trips monorepo into a clean zip for download.
# Excludes all build artifacts, deps, lockfiles (kept), and dev-only files.

set -euo pipefail

ROOT="/home/z/my-project"
OUT="/home/z/my-project/download/via-trips.zip"
STAGE="/tmp/via-trips-stage"

# Clean previous artifacts
rm -rf "$STAGE" "$OUT"
mkdir -p "$STAGE"

# Files/dirs to exclude
EXCLUDES=(
  --exclude='node_modules'
  --exclude='.next'
  --exclude='.turbo'
  --exclude='.git'
  --exclude='.gitignore'
  --exclude='*.log'
  --exclude='dev.log'
  --exclude='server.log'
  --exclude='tool-results'
  --exclude='upload'
  --exclude='skills'
  --exclude='examples'
  --exclude='tests'
  --exclude='mini-services'
  --exclude='db'
  --exclude='prisma/migrations'
  --exclude='.DS_Store'
  --exclude='*.tsbuildinfo'
  --exclude='tsconfig.tsbuildinfo'
  --exclude='next-env.d.ts.bak'
  --exclude='.env.local'
  --exclude='uploads'
  --exclude='via-trips.zip'
  --exclude='waha-travel.zip'
  --exclude='download'
  --exclude='scripts/rebrand_via.py'
  --exclude='scripts/make-sqlite-schema.py'
  --exclude='scripts/smoke-test.sh'
  --exclude='scripts/cors-test.sh'
  # NOTE: do NOT exclude 'dist' — we ship pre-built shared-types and API dist
)

# Stage the project under a top-level "via-trips/" folder
mkdir -p "$STAGE/via-trips"

# Copy the project, respecting excludes
rsync -a \
  "${EXCLUDES[@]}" \
  --exclude='worklog.md' \
  "$ROOT/" "$STAGE/via-trips/"

# Make sure the shared-types dist is included (we want it pre-built)
if [ ! -d "$STAGE/via-trips/packages/shared-types/dist" ]; then
  echo "⚠️  shared-types/dist missing — copying from source..."
  cp -r "$ROOT/packages/shared-types/dist" "$STAGE/via-trips/packages/shared-types/dist"
fi

# Make sure the API dist is included (pre-built so users can `node dist/main` directly)
if [ ! -f "$STAGE/via-trips/apps/api/dist/main.js" ]; then
  echo "⚠️  apps/api/dist missing — copying from source..."
  mkdir -p "$STAGE/via-trips/apps/api/dist"
  cp -r "$ROOT/apps/api/dist/." "$STAGE/via-trips/apps/api/dist/"
fi

# Verify essential files exist
echo ""
echo "📦 Verifying essential files..."
for f in \
  "via-trips/package.json" \
  "via-trips/apps/api/package.json" \
  "via-trips/apps/api/.env" \
  "via-trips/apps/api/.env.example" \
  "via-trips/apps/api/prisma/schema.prisma" \
  "via-trips/apps/api/src/main.ts" \
  "via-trips/apps/api/dist/main.js" \
  "via-trips/packages/shared-types/package.json" \
  "via-trips/packages/shared-types/dist/index.js" \
  "via-trips/src/app/layout.tsx" \
  "via-trips/src/components/auth/login-form.tsx" \
  "via-trips/tsconfig.json"
do
  if [ -f "$STAGE/$f" ]; then
    echo "  ✓ $f"
  else
    echo "  ✗ MISSING: $f"
  fi
done

# Verify no "waha" references remain (excluding worklog/scripts which are excluded)
echo ""
echo "🔍 Scanning for leftover 'waha' references..."
HITS=$(grep -ril "waha" "$STAGE/via-trips" \
  --include='*.ts' --include='*.tsx' --include='*.json' \
  --include='*.md' --include='*.env*' --include='*.prisma' \
  --exclude-dir=node_modules --exclude-dir=dist 2>/dev/null || true)
if [ -n "$HITS" ]; then
  echo "⚠️  Found leftover 'waha' references:"
  echo "$HITS"
else
  echo "  ✓ No 'waha' references found"
fi

# Create the zip
echo ""
echo "📦 Creating zip..."
(cd "$STAGE" && zip -rq via-trips.zip via-trips/)

# Move to download folder
mv "$STAGE/via-trips.zip" "$OUT"

# Cleanup
rm -rf "$STAGE"

# Report size
SIZE=$(du -h "$OUT" | cut -f1)
FILES=$(unzip -l "$OUT" | tail -1 | awk '{print $2}')
echo ""
echo "✅ Done!"
echo "   Path:  $OUT"
echo "   Size:  $SIZE"
echo "   Files: $FILES"
