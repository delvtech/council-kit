#!/bin/bash

src_dir=$1

if [ ! -d $src_dir ]; then
  # From Harhat config:
  contracts_dir="contracts"
  artifacts_dir="artifacts"

  echo "Cloning delvtech/council repo..."
  git clone --depth 1 git@github.com:delvtech/council.git council

  echo "Moving contracts..."
  mv council/contracts ./$contracts_dir

  echo "Compiling contracts..."
  npx hardhat compile

  echo "Creating typescript files..."
  mkdir -p $src_dir
  find $artifacts_dir \
    -type d -name "build-info" -prune \
    -o -type f -name "*.json" ! -name "*.dbg.json" -print |
    while IFS= read -r file; do
      contract_name=$(basename $file .json)
      src_file=$src_dir/$contract_name.ts
      echo "export const $contract_name = $(cat $file) as const;" >$src_file
    done

  echo "Cleaning up..."
  rm -rf council $contracts_dir $artifacts_dir cache
fi

process_exit_code=$?
