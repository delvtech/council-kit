export const ReadAndWriteAnyStorage = {
  "_format": "hh-sol-artifact-1",
  "contractName": "ReadAndWriteAnyStorage",
  "sourceName": "contracts/mocks/StorageRead.sol",
  "abi": [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "slot",
          "type": "uint256"
        }
      ],
      "name": "readStorage",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "data",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "slot",
          "type": "uint256"
        },
        {
          "internalType": "bytes32",
          "name": "data",
          "type": "bytes32"
        }
      ],
      "name": "writeStorage",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ],
  "bytecode": "0x608060405234801561001057600080fd5b5060d68061001f6000396000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c80632cab8335146037578063e10af4ad146058575b600080fd5b604660423660046069565b5490565b60405190815260200160405180910390f35b606760633660046080565b9055565b005b6000602082840312156079578081fd5b5035919050565b600080604083850312156091578081fd5b5050803592602090910135915056fea2646970667358221220871b0b6ba3027b11273872d38a2f32ce3c0336068c4e5a2b654f37587c2f763764736f6c63430008030033",
  "deployedBytecode": "0x6080604052348015600f57600080fd5b506004361060325760003560e01c80632cab8335146037578063e10af4ad146058575b600080fd5b604660423660046069565b5490565b60405190815260200160405180910390f35b606760633660046080565b9055565b005b6000602082840312156079578081fd5b5035919050565b600080604083850312156091578081fd5b5050803592602090910135915056fea2646970667358221220871b0b6ba3027b11273872d38a2f32ce3c0336068c4e5a2b654f37587c2f763764736f6c63430008030033",
  "linkReferences": {},
  "deployedLinkReferences": {}
} as const;
