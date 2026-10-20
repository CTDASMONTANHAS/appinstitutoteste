#!/usr/bin/env bash
# Monta a pasta publicada (dist/) só com os arquivos do app.
# Fica de fora: supabase/, icones/ (originais), README, SEGURANCA.md etc.
set -euo pipefail
rm -rf dist
mkdir -p dist
cp -r index.html manifest.json sw.js _headers css js icons dist/
echo "dist/ pronto: $(find dist -type f | wc -l) arquivos"
