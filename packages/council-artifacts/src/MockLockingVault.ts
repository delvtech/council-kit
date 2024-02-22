export const MockLockingVault = {
  "_format": "hh-sol-artifact-1",
  "contractName": "MockLockingVault",
  "sourceName": "contracts/mocks/MockLockingVault.sol",
  "abi": [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "delegation",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "fundedAccount",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "firstDelegation",
          "type": "address"
        }
      ],
      "name": "deposit",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "deposits",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ],
  "bytecode": "0x608060405234801561001057600080fd5b50610270806100206000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c8063eed50a3214610046578063f45346dc146100a6578063fc7e286d146100bb575b600080fd5b61007c6100543660046101a1565b60016020526000908152604090205473ffffffffffffffffffffffffffffffffffffffff1681565b60405173ffffffffffffffffffffffffffffffffffffffff90911681526020015b60405180910390f35b6100b96100b43660046101c2565b6100e9565b005b6100db6100c93660046101a1565b60006020819052908152604090205481565b60405190815260200161009d565b73ffffffffffffffffffffffffffffffffffffffff83166000908152602081905260408120805484929061011e9084906101fd565b909155505073ffffffffffffffffffffffffffffffffffffffff928316600090815260016020526040902080547fffffffffffffffffffffffff000000000000000000000000000000000000000016919093161790915550565b803573ffffffffffffffffffffffffffffffffffffffff8116811461019c57600080fd5b919050565b6000602082840312156101b2578081fd5b6101bb82610178565b9392505050565b6000806000606084860312156101d6578182fd5b6101df84610178565b9250602084013591506101f460408501610178565b90509250925092565b60008219821115610235577f4e487b710000000000000000000000000000000000000000000000000000000081526011600452602481fd5b50019056fea264697066735822122036f5cad091144400ffc5c61b17106673e10b044d7422ccb70c7b2ee7a6d8a5de64736f6c63430008030033",
  "deployedBytecode": "0x608060405234801561001057600080fd5b50600436106100415760003560e01c8063eed50a3214610046578063f45346dc146100a6578063fc7e286d146100bb575b600080fd5b61007c6100543660046101a1565b60016020526000908152604090205473ffffffffffffffffffffffffffffffffffffffff1681565b60405173ffffffffffffffffffffffffffffffffffffffff90911681526020015b60405180910390f35b6100b96100b43660046101c2565b6100e9565b005b6100db6100c93660046101a1565b60006020819052908152604090205481565b60405190815260200161009d565b73ffffffffffffffffffffffffffffffffffffffff83166000908152602081905260408120805484929061011e9084906101fd565b909155505073ffffffffffffffffffffffffffffffffffffffff928316600090815260016020526040902080547fffffffffffffffffffffffff000000000000000000000000000000000000000016919093161790915550565b803573ffffffffffffffffffffffffffffffffffffffff8116811461019c57600080fd5b919050565b6000602082840312156101b2578081fd5b6101bb82610178565b9392505050565b6000806000606084860312156101d6578182fd5b6101df84610178565b9250602084013591506101f460408501610178565b90509250925092565b60008219821115610235577f4e487b710000000000000000000000000000000000000000000000000000000081526011600452602481fd5b50019056fea264697066735822122036f5cad091144400ffc5c61b17106673e10b044d7422ccb70c7b2ee7a6d8a5de64736f6c63430008030033",
  "linkReferences": {},
  "deployedLinkReferences": {}
} as const;
