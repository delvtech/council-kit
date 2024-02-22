export const MockCoreVoting = {
  "_format": "hh-sol-artifact-1",
  "contractName": "MockCoreVoting",
  "sourceName": "contracts/mocks/MockCoreVoting.sol",
  "abi": [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "approvedVaults",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "vault",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "what",
          "type": "bool"
        }
      ],
      "name": "setVault",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ],
  "bytecode": "0x608060405234801561001057600080fd5b50610192806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c8063627f66c61461003b578063af7a060c146100a1575b600080fd5b61009f610049366004610122565b73ffffffffffffffffffffffffffffffffffffffff91909116600090815260208190526040902080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0016911515919091179055565b005b6100c46100af366004610101565b60006020819052908152604090205460ff1681565b604051901515815260200160405180910390f35b803573ffffffffffffffffffffffffffffffffffffffff811681146100fc57600080fd5b919050565b600060208284031215610112578081fd5b61011b826100d8565b9392505050565b60008060408385031215610134578081fd5b61013d836100d8565b915060208301358015158114610151578182fd5b80915050925092905056fea264697066735822122068a8e308aedfe2b4e7bf6e998de1ff9dd5b4271f63e2c371d001a6c21ccd48e164736f6c63430008030033",
  "deployedBytecode": "0x608060405234801561001057600080fd5b50600436106100365760003560e01c8063627f66c61461003b578063af7a060c146100a1575b600080fd5b61009f610049366004610122565b73ffffffffffffffffffffffffffffffffffffffff91909116600090815260208190526040902080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0016911515919091179055565b005b6100c46100af366004610101565b60006020819052908152604090205460ff1681565b604051901515815260200160405180910390f35b803573ffffffffffffffffffffffffffffffffffffffff811681146100fc57600080fd5b919050565b600060208284031215610112578081fd5b61011b826100d8565b9392505050565b60008060408385031215610134578081fd5b61013d836100d8565b915060208301358015158114610151578182fd5b80915050925092905056fea264697066735822122068a8e308aedfe2b4e7bf6e998de1ff9dd5b4271f63e2c371d001a6c21ccd48e164736f6c63430008030033",
  "linkReferences": {},
  "deployedLinkReferences": {}
} as const;
