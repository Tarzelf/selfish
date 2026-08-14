#!/usr/bin/env bash
# Fetch the MIT KEMAR "compact" HRTF set used for binaural rendering.
#
# LICENSING NOTE: the KEMAR measurements are distributed by the MIT Media Lab
# for research use. Before shipping anything commercial that is rendered with
# them, confirm the terms or switch to a set with explicit commercial licensing
# (see docs/research/04-audio-engineering.md). The renderer takes the HRTF
# directory as a parameter precisely so this can be swapped without code
# changes.
set -euo pipefail

DEST="${1:-studio/data/hrtf}"
URL="http://sound.media.mit.edu/resources/KEMAR/compact.tar.Z"

mkdir -p "$DEST"
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT

echo "Downloading KEMAR compact set..."
curl -sSL --max-time 120 -o "$tmp/compact.tar.Z" "$URL"
tar xf "$tmp/compact.tar.Z" -C "$tmp"

rm -rf "$DEST/kemar-compact"
mv "$tmp/compact" "$DEST/kemar-compact"

count="$(find "$DEST/kemar-compact" -name '*.dat' | wc -l | tr -d ' ')"
echo "Installed $count HRIR files into $DEST/kemar-compact"
