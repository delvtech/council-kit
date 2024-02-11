#!/bin/bash
set -e

# SETTINGS
default_branch="main"
default_repo_url="git@github.com:delvtech/council.git"
src_dir_name="src"
max_file_size=1000000 # 1MB

# Skip the build if the src directory already exists
if [ -d "$src_dir_name" ]; then
  echo "Src path ($src_dir_name) already exists. Skipping src build."
  exit 0
fi

# Echo usage
echo ""
echo "+"
echo "|  $0"
echo "|  Builds typescript src files from the council repo."
echo "|"
echo "|  Usage: $0 [branch] [repo_url]"
echo "|"
echo "|    branch:    The branch to clone. (default: $default_branch)"
echo "|    repo_url:  The url of the git repository to clone. (default: $default_repo_url)"
echo "+"
echo ""

branch=${1:-$default_branch}
repo_url=${2:-$default_repo_url}
temp_dir=$(mktemp -d "council-temp.XXXXXX")

# Echo settings
echo "Branch: $branch"
echo "Repo URL: $repo_url"
echo "Source directory: $src_dir_name"
echo "Max file size: $max_file_size bytes"
echo ""

git clone --depth 1 "$repo_url" --branch "$branch" "$temp_dir"

echo "Compiling contracts..."
(
  cd "$temp_dir"
  yarn
  npx hardhat compile
)

echo "Creating typescript files..."

# Reset the src folder
rm -rf "$src_dir_name"
mkdir "$src_dir_name"

# Loop through all the json files in the artifacts directory that aren't in the
# build-info directory and aren't debug files.
find "$temp_dir"/artifacts \
  -type d -name "build-info" -prune \
  -o -type f -name "*.json" ! -name "*.dbg.json" -print |
  while IFS= read -r file; do

    # Ignore the contract if the file is too large. This prevents TSC from
    # throwing errors while trying to parse large files and prevents the script
    # from processing files we probably don't want to be importing into our
    # codebase.
    file_size=$(wc -c <"$file")
    if [ "$file_size" -gt "$max_file_size" ]; then
      echo "WARNING: File $file is too large ($(echo $file_size | tr -d ' ') bytes) and will be omitted."
      continue
    fi

    contract_name=$(basename $file .json)

    # Write the contract to a typescript file as a named export with `as const`
    # to prevent typescript from widening the type of the contract.
    src_file="$src_dir_name/$contract_name.ts"
    echo "export const $contract_name = $(cat $file) as const;" >$src_file
  done

echo "Cleaning up..."
rm -rf "$temp_dir"
