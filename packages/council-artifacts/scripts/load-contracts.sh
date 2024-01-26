echo "Downloading contracts..."

if [[ -z "${GITHUB_TOKEN}" ]]; then
  git clone git@github.com:delvtech/council.git council
else
 git clone https://$GITHUB_TOKEN@github.com/delvtech/council.git council
fi

# blow away old-contracts
rm -rf contracts
mkdir contracts

echo "Copying latest contracts..."
cp -R council/contracts/ contracts
rm -rf council

echo "Done!"