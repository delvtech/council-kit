export const Airdrop = {
  "_format": "hh-sol-artifact-1",
  "contractName": "Airdrop",
  "sourceName": "contracts/features/Airdrop.sol",
  "abi": [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_governance",
          "type": "address"
        },
        {
          "internalType": "bytes32",
          "name": "_merkleRoot",
          "type": "bytes32"
        },
        {
          "internalType": "contract IERC20",
          "name": "_token",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_expiration",
          "type": "uint256"
        },
        {
          "internalType": "contract ILockingVault",
          "name": "_lockingVault",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "who",
          "type": "address"
        }
      ],
      "name": "authorize",
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
      "name": "authorized",
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
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "totalGrant",
          "type": "uint256"
        },
        {
          "internalType": "bytes32[]",
          "name": "merkleProof",
          "type": "bytes32[]"
        },
        {
          "internalType": "address",
          "name": "destination",
          "type": "address"
        }
      ],
      "name": "claim",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "delegate",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "totalGrant",
          "type": "uint256"
        },
        {
          "internalType": "bytes32[]",
          "name": "merkleProof",
          "type": "bytes32[]"
        },
        {
          "internalType": "address",
          "name": "destination",
          "type": "address"
        }
      ],
      "name": "claimAndDelegate",
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
      "name": "claimed",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "who",
          "type": "address"
        }
      ],
      "name": "deauthorize",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "expiration",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "who",
          "type": "address"
        }
      ],
      "name": "isAuthorized",
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
      "inputs": [],
      "name": "lockingVault",
      "outputs": [
        {
          "internalType": "contract ILockingVault",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
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
          "name": "destination",
          "type": "address"
        }
      ],
      "name": "reclaim",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "rewardsRoot",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "who",
          "type": "address"
        }
      ],
      "name": "setOwner",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "token",
      "outputs": [
        {
          "internalType": "contract IERC20",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ],
  "bytecode": "0x60c06040523480156200001157600080fd5b50604051620011483803806200114883398101604081905262000034916200019f565b6000849055606083901b6001600160601b031916608052600280546001600160a01b0319166001600160a01b0383811691821790925560405163095ea7b360e01b8152600481019190915260001960248201528591859184918491849184919083169063095ea7b390604401602060405180830381600087803b158015620000bb57600080fd5b505af1158015620000d0573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190620000f6919062000206565b5050600380546001600160a01b0319163317905550505060a084905250620001209050856200012b565b505050505062000248565b6003546001600160a01b031633146200017d5760405162461bcd60e51b815260206004820152601060248201526f29b2b73232b9103737ba1037bbb732b960811b604482015260640160405180910390fd5b600380546001600160a01b0319166001600160a01b0392909216919091179055565b600080600080600060a08688031215620001b7578081fd5b8551620001c4816200022f565b602087015160408801519196509450620001de816200022f565b606087015160808801519194509250620001f8816200022f565b809150509295509295909350565b60006020828403121562000218578081fd5b8151801515811462000228578182fd5b9392505050565b6001600160a01b03811681146200024557600080fd5b50565b60805160601c60a051610ebb6200028d6000396000818161015e01526107f101526000818161025001528181610322015281816108a901526109870152610ebb6000f3fe608060405234801561001057600080fd5b50600436106100ea5760003560e01c8063b6a5d7de1161008c578063d2a0434511610066578063d2a043451461022b578063fc0c546a1461024b578063fc772c8b14610272578063fe9fbb8014610285576100ea565b8063b6a5d7de146101c5578063b9181611146101d8578063c884ef831461020b576100ea565b8063217863b7116100c8578063217863b71461012a57806327c97fa5146101465780634665096d146101595780638da5cb5b14610180576100ea565b806309ed28f1146100ef5780630a33e8c21461010457806313af403514610117575b600080fd5b6101026100fd366004610d9f565b610298565b005b610102610112366004610d2a565b6103a6565b610102610125366004610cd8565b610502565b61013360005481565b6040519081526020015b60405180910390f35b610102610154366004610cd8565b6105ca565b6101337f000000000000000000000000000000000000000000000000000000000000000081565b6003546101a09073ffffffffffffffffffffffffffffffffffffffff1681565b60405173ffffffffffffffffffffffffffffffffffffffff909116815260200161013d565b6101026101d3366004610cd8565b610697565b6101fb6101e6366004610cd8565b60046020526000908152604090205460ff1681565b604051901515815260200161013d565b610133610219366004610cd8565b60016020526000908152604090205481565b6002546101a09073ffffffffffffffffffffffffffffffffffffffff1681565b6101a07f000000000000000000000000000000000000000000000000000000000000000081565b610102610280366004610cd8565b61076e565b6101fb610293366004610cd8565b610a0a565b6102d68585858580806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250610a3992505050565b6040517fa9059cbb00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff8281166004830152602482018790527f0000000000000000000000000000000000000000000000000000000000000000169063a9059cbb90604401602060405180830381600087803b15801561036657600080fd5b505af115801561037a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061039e9190610cf2565b505050505050565b73ffffffffffffffffffffffffffffffffffffffff8516610428576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601460248201527f5a65726f20616464722064656c65676174696f6e00000000000000000000000060448201526064015b60405180910390fd5b6104668685858580806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250610a3992505050565b6002546040517ff45346dc00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff83811660048301526024820189905287811660448301529091169063f45346dc90606401600060405180830381600087803b1580156104e257600080fd5b505af11580156104f6573d6000803e3d6000fd5b50505050505050505050565b60035473ffffffffffffffffffffffffffffffffffffffff163314610583576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601060248201527f53656e646572206e6f74206f776e657200000000000000000000000000000000604482015260640161041f565b600380547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff92909216919091179055565b60035473ffffffffffffffffffffffffffffffffffffffff16331461064b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601060248201527f53656e646572206e6f74206f776e657200000000000000000000000000000000604482015260640161041f565b73ffffffffffffffffffffffffffffffffffffffff16600090815260046020526040902080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00169055565b60035473ffffffffffffffffffffffffffffffffffffffff163314610718576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601060248201527f53656e646572206e6f74206f776e657200000000000000000000000000000000604482015260640161041f565b61076b8173ffffffffffffffffffffffffffffffffffffffff16600090815260046020526040902080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00166001179055565b50565b60035473ffffffffffffffffffffffffffffffffffffffff1633146107ef576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601060248201527f53656e646572206e6f74206f776e657200000000000000000000000000000000604482015260640161041f565b7f00000000000000000000000000000000000000000000000000000000000000004211610878576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600b60248201527f4e6f742065787069726564000000000000000000000000000000000000000000604482015260640161041f565b6040517f70a082310000000000000000000000000000000000000000000000000000000081523060048201526000907f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff16906370a082319060240160206040518083038186803b15801561090057600080fd5b505afa158015610914573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109389190610d12565b6040517fa9059cbb00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff8481166004830152602482018390529192507f00000000000000000000000000000000000000000000000000000000000000009091169063a9059cbb90604401602060405180830381600087803b1580156109cd57600080fd5b505af11580156109e1573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a059190610cf2565b505050565b73ffffffffffffffffffffffffffffffffffffffff811660009081526004602052604090205460ff165b919050565b6040517fffffffffffffffffffffffffffffffffffffffff0000000000000000000000003360601b16602082015260348101839052600090605401604051602081830303815290604052805190602001209050610a998260005483610bae565b610aff576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600d60248201527f496e76616c69642050726f6f6600000000000000000000000000000000000000604482015260640161041f565b336000908152600160205260409020548390610b1c908690610e05565b1115610b84576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601060248201527f436c61696d656420746f6f206d75636800000000000000000000000000000000604482015260640161041f565b3360009081526001602052604081208054869290610ba3908490610e05565b909155505050505050565b600082610bbb8584610bc4565b14949350505050565b600081815b8451811015610c3057610c1c82868381518110610c0f577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b6020026020010151610c38565b915080610c2881610e1d565b915050610bc9565b509392505050565b6000818310610c54576000828152602084905260409020610c63565b60008381526020839052604090205b9392505050565b803573ffffffffffffffffffffffffffffffffffffffff81168114610a3457600080fd5b60008083601f840112610c9f578182fd5b50813567ffffffffffffffff811115610cb6578182fd5b6020830191508360208260051b8501011115610cd157600080fd5b9250929050565b600060208284031215610ce9578081fd5b610c6382610c6a565b600060208284031215610d03578081fd5b81518015158114610c63578182fd5b600060208284031215610d23578081fd5b5051919050565b60008060008060008060a08789031215610d42578182fd5b86359550610d5260208801610c6a565b945060408701359350606087013567ffffffffffffffff811115610d74578283fd5b610d8089828a01610c8e565b9094509250610d93905060808801610c6a565b90509295509295509295565b600080600080600060808688031215610db6578081fd5b8535945060208601359350604086013567ffffffffffffffff811115610dda578182fd5b610de688828901610c8e565b9094509250610df9905060608701610c6a565b90509295509295909350565b60008219821115610e1857610e18610e56565b500190565b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff821415610e4f57610e4f610e56565b5060010190565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fdfea2646970667358221220235f3af62ae73550ce81dabeb3a3fa288aa7cbc73da26cbb1cc092181cab7d5064736f6c63430008030033",
  "deployedBytecode": "0x608060405234801561001057600080fd5b50600436106100ea5760003560e01c8063b6a5d7de1161008c578063d2a0434511610066578063d2a043451461022b578063fc0c546a1461024b578063fc772c8b14610272578063fe9fbb8014610285576100ea565b8063b6a5d7de146101c5578063b9181611146101d8578063c884ef831461020b576100ea565b8063217863b7116100c8578063217863b71461012a57806327c97fa5146101465780634665096d146101595780638da5cb5b14610180576100ea565b806309ed28f1146100ef5780630a33e8c21461010457806313af403514610117575b600080fd5b6101026100fd366004610d9f565b610298565b005b610102610112366004610d2a565b6103a6565b610102610125366004610cd8565b610502565b61013360005481565b6040519081526020015b60405180910390f35b610102610154366004610cd8565b6105ca565b6101337f000000000000000000000000000000000000000000000000000000000000000081565b6003546101a09073ffffffffffffffffffffffffffffffffffffffff1681565b60405173ffffffffffffffffffffffffffffffffffffffff909116815260200161013d565b6101026101d3366004610cd8565b610697565b6101fb6101e6366004610cd8565b60046020526000908152604090205460ff1681565b604051901515815260200161013d565b610133610219366004610cd8565b60016020526000908152604090205481565b6002546101a09073ffffffffffffffffffffffffffffffffffffffff1681565b6101a07f000000000000000000000000000000000000000000000000000000000000000081565b610102610280366004610cd8565b61076e565b6101fb610293366004610cd8565b610a0a565b6102d68585858580806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250610a3992505050565b6040517fa9059cbb00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff8281166004830152602482018790527f0000000000000000000000000000000000000000000000000000000000000000169063a9059cbb90604401602060405180830381600087803b15801561036657600080fd5b505af115801561037a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061039e9190610cf2565b505050505050565b73ffffffffffffffffffffffffffffffffffffffff8516610428576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601460248201527f5a65726f20616464722064656c65676174696f6e00000000000000000000000060448201526064015b60405180910390fd5b6104668685858580806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250610a3992505050565b6002546040517ff45346dc00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff83811660048301526024820189905287811660448301529091169063f45346dc90606401600060405180830381600087803b1580156104e257600080fd5b505af11580156104f6573d6000803e3d6000fd5b50505050505050505050565b60035473ffffffffffffffffffffffffffffffffffffffff163314610583576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601060248201527f53656e646572206e6f74206f776e657200000000000000000000000000000000604482015260640161041f565b600380547fffffffffffffffffffffffff00000000000000000000000000000000000000001673ffffffffffffffffffffffffffffffffffffffff92909216919091179055565b60035473ffffffffffffffffffffffffffffffffffffffff16331461064b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601060248201527f53656e646572206e6f74206f776e657200000000000000000000000000000000604482015260640161041f565b73ffffffffffffffffffffffffffffffffffffffff16600090815260046020526040902080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00169055565b60035473ffffffffffffffffffffffffffffffffffffffff163314610718576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601060248201527f53656e646572206e6f74206f776e657200000000000000000000000000000000604482015260640161041f565b61076b8173ffffffffffffffffffffffffffffffffffffffff16600090815260046020526040902080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00166001179055565b50565b60035473ffffffffffffffffffffffffffffffffffffffff1633146107ef576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601060248201527f53656e646572206e6f74206f776e657200000000000000000000000000000000604482015260640161041f565b7f00000000000000000000000000000000000000000000000000000000000000004211610878576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600b60248201527f4e6f742065787069726564000000000000000000000000000000000000000000604482015260640161041f565b6040517f70a082310000000000000000000000000000000000000000000000000000000081523060048201526000907f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff16906370a082319060240160206040518083038186803b15801561090057600080fd5b505afa158015610914573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109389190610d12565b6040517fa9059cbb00000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff8481166004830152602482018390529192507f00000000000000000000000000000000000000000000000000000000000000009091169063a9059cbb90604401602060405180830381600087803b1580156109cd57600080fd5b505af11580156109e1573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a059190610cf2565b505050565b73ffffffffffffffffffffffffffffffffffffffff811660009081526004602052604090205460ff165b919050565b6040517fffffffffffffffffffffffffffffffffffffffff0000000000000000000000003360601b16602082015260348101839052600090605401604051602081830303815290604052805190602001209050610a998260005483610bae565b610aff576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600d60248201527f496e76616c69642050726f6f6600000000000000000000000000000000000000604482015260640161041f565b336000908152600160205260409020548390610b1c908690610e05565b1115610b84576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601060248201527f436c61696d656420746f6f206d75636800000000000000000000000000000000604482015260640161041f565b3360009081526001602052604081208054869290610ba3908490610e05565b909155505050505050565b600082610bbb8584610bc4565b14949350505050565b600081815b8451811015610c3057610c1c82868381518110610c0f577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b6020026020010151610c38565b915080610c2881610e1d565b915050610bc9565b509392505050565b6000818310610c54576000828152602084905260409020610c63565b60008381526020839052604090205b9392505050565b803573ffffffffffffffffffffffffffffffffffffffff81168114610a3457600080fd5b60008083601f840112610c9f578182fd5b50813567ffffffffffffffff811115610cb6578182fd5b6020830191508360208260051b8501011115610cd157600080fd5b9250929050565b600060208284031215610ce9578081fd5b610c6382610c6a565b600060208284031215610d03578081fd5b81518015158114610c63578182fd5b600060208284031215610d23578081fd5b5051919050565b60008060008060008060a08789031215610d42578182fd5b86359550610d5260208801610c6a565b945060408701359350606087013567ffffffffffffffff811115610d74578283fd5b610d8089828a01610c8e565b9094509250610d93905060808801610c6a565b90509295509295509295565b600080600080600060808688031215610db6578081fd5b8535945060208601359350604086013567ffffffffffffffff811115610dda578182fd5b610de688828901610c8e565b9094509250610df9905060608701610c6a565b90509295509295909350565b60008219821115610e1857610e18610e56565b500190565b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff821415610e4f57610e4f610e56565b5060010190565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fdfea2646970667358221220235f3af62ae73550ce81dabeb3a3fa288aa7cbc73da26cbb1cc092181cab7d5064736f6c63430008030033",
  "linkReferences": {},
  "deployedLinkReferences": {}
} as const;
