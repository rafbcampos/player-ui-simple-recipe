#!/bin/bash

echo "Compiling DSL files..."

rm -rf ./src/generated

files=$(find ./src/content -name "*.ts")

for file in $files; do
	pnpm player dsl compile -i $file -o ./src/generated --skip-validation
done

echo "DSL files compiled."
