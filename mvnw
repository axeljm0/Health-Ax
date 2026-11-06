#!/usr/bin/env bash
# Maven Wrapper helper for Health+
set -e

MAVEN_BIN="/home/axel/.m2/wrapper/dists/apache-maven-3.9.9/3477a4f1/bin/mvn"

if [ -x "$MAVEN_BIN" ]; then
    exec "$MAVEN_BIN" "$@"
elif command -v mvn >/dev/null 2>&1; then
    exec mvn "$@"
else
    echo "Error: No se encontró Maven instalado ni en ~/.m2 ni en el PATH del sistema." >&2
    exit 1
fi
