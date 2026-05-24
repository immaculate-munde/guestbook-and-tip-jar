#!/usr/bin/env bash
# Trust local HTTPS certs for Freighter (Chromium/Firefox need NSS tools on Linux).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CERT_DIR="$ROOT/certificates"
MKCERT="${MKCERT:-$HOME/.local/bin/mkcert}"

if [[ ! -x "$MKCERT" ]]; then
  mkdir -p "$HOME/.local/bin"
  curl -sL "https://github.com/FiloSottile/mkcert/releases/download/v1.4.4/mkcert-v1.4.4-linux-amd64" \
    -o "$MKCERT"
  chmod +x "$MKCERT"
fi

if ! command -v certutil >/dev/null 2>&1; then
  echo "⚠️  certutil not found. Chromium (Chrome, Cursor preview) will not trust HTTPS until you run:"
  echo "    sudo apt install libnss3-tools"
  echo "    $MKCERT -install"
  echo ""
fi

"$MKCERT" -install || true
mkdir -p "$CERT_DIR"
"$MKCERT" -key-file "$CERT_DIR/localhost-key.pem" -cert-file "$CERT_DIR/localhost.pem" \
  localhost 127.0.0.1 ::1

echo ""
echo "✅ Certificates written to $CERT_DIR"
echo "   Start the app: npm run dev"
echo "   Open in Chrome or Firefox: https://localhost:3000"
echo "   (Cursor's built-in browser may still show a cert warning until libnss3-tools is installed.)"
