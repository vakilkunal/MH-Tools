#!/usr/bin/env bash

mkdir -p out/src/bookmarklet
cp *.html out/
cp -r resources out/
cp -r data out/
cp -r lib out/
cp -r src/main out/src/
cp -r src/utils out/src/
cp readme.md out/
cp src/bookmarklet/*.min.js out/src/bookmarklet/

