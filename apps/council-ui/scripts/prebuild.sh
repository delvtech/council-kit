#!/bin/bash
set -e

# Set the environment variables from the .env file if it exists
if [ -f .env ]; then
  set -o allexport
  source .env
  set +o allexport
fi

# Get the WalletConnect domain verification code from the
# WALLET_CONNECT_DOMAIN_VERIFICATION_CODE environment variable
verification_code=$WALLET_CONNECT_DOMAIN_VERIFICATION_CODE

# Save the verification code to Public/.well-known/walletconnect.txt
if [ -n "$verification_code" ]; then
  echo "Saving verification code to public/.well-known/walletconnect.txt"
  mkdir -p public/.well-known
  echo "$verification_code" >public/.well-known/walletconnect.txt
else
  echo "Verification code is empty. Skipping."
fi
