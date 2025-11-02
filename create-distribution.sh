#!/bin/bash

# Script to create a clean distribution zip file

PROJECT_NAME="Personal_knowledge_assistant"
DIST_NAME="${PROJECT_NAME}_distribution"
TEMP_DIR="/tmp/${DIST_NAME}"

echo "Creating distribution package..."

# Create temporary directory
rm -rf "$TEMP_DIR"
mkdir -p "$TEMP_DIR"

# Copy files excluding node_modules, dist, .env, .git
rsync -av \
  --exclude='node_modules' \
  --exclude='**/node_modules' \
  --exclude='dist' \
  --exclude='**/dist' \
  --exclude='build' \
  --exclude='**/build' \
  --exclude='.env' \
  --exclude='.env.local' \
  --exclude='.git' \
  --exclude='**/.git' \
  --exclude='*.log' \
  --exclude='logs' \
  --exclude='tmp' \
  --exclude='temp' \
  --exclude='*.tmp' \
  --exclude='.DS_Store' \
  --exclude='.vscode' \
  --exclude='.idea' \
  --exclude='backend/uploads/*' \
  --exclude='.pnpm-store' \
  --exclude='coverage' \
  . "$TEMP_DIR/"

# Create zip file
cd /tmp
zip -r "${DIST_NAME}.zip" "$DIST_NAME" -q

# Move to project directory
mv "${DIST_NAME}.zip" "$(cd - && pwd)/"

echo "✅ Distribution package created: ${DIST_NAME}.zip"
echo "📦 Package size: $(du -h "${DIST_NAME}.zip" | cut -f1)"
echo ""
echo "Files included:"
echo "  ✅ All source code"
echo "  ✅ Configuration files"
echo "  ✅ Documentation"
echo "  ✅ .env.example (template)"
echo ""
echo "Files excluded:"
echo "  ❌ node_modules (will be installed by recipient)"
echo "  ❌ dist/build folders (will be built by recipient)"
echo "  ❌ .env file (contains secrets)"
echo "  ❌ .git folder"
