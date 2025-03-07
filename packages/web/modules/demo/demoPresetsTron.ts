import { App, AppCreationModes, AppStatuses } from '@modules/firebase';
import { DEMO_NFT_BYTECODE, DEMO_TOKEN_BYTECODE } from './demoByteCodes';
import { Environments } from '@core/enums/environments';
import { Blockchains } from '@core/enums/blockchains';

export const DEMO_APPS_TRON: App[] = [
  {
    createdDateUTC: 1695439343685,
    appId: '71ce49da-a386-40ce-b8ef-d03db5d8af35',
    name: 'BlockFabric Imported Contract',
    description: '',
    userId: '0200e8b8-4a41-442f-972b-c61299b3486f',
    appCreationMode: AppCreationModes.Import,
    appCreationSource: {
      transactionHashTestnet: '',
      transactionHashMainnet: '84e1e023a15c521c6afc59b462c2cbaa10a614da5b887faed34903689e9b0f3b',
    },
    status: AppStatuses.Deployed,
    deployments: [
      {
        environment: Environments.Mainnet,
        blockchain: Blockchains.TRON,
        createdDateUTC: 1684460157000,
        contractAddress: 'TSirzn8bNjqQsfKokKpGrz3LtfLuoBkuRg',
        walletAddress: 'TGPvG2H2LcDScYy8z3yh9yCfm8PsikcVEH',
        transactionHash: '84e1e023a15c521c6afc59b462c2cbaa10a614da5b887faed34903689e9b0f3b',
      },
    ],
  },
  {
    createdDateUTC: 1694877170430,
    appId: '762261d8-39e1-4243-9f6a-46b3e59a0da6',
    name: 'BlockFabric Sample NFT',
    description: '',
    appCreationMode: AppCreationModes.Template,
    appCreationSource: {
      templateId: '2',
      templateName: 'ERC721 NFT Contract',
    },
    userId: '0200e8b8-4a41-442f-972b-c61299b3486f',
    contractByteCode: DEMO_NFT_BYTECODE,
    contractAbi: [
      {
        inputs: [
          {
            name: 'baseTokenURI',
            internalType: 'string',
            type: 'string',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
      },
      {
        inputs: [
          {
            indexed: true,
            name: 'owner',
            internalType: 'address',
            type: 'address',
          },
          {
            indexed: true,
            name: 'approved',
            internalType: 'address',
            type: 'address',
          },
          {
            indexed: true,
            name: 'tokenId',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
        name: 'Approval',
        anonymous: false,
        type: 'event',
      },
      {
        inputs: [
          {
            indexed: true,
            name: 'owner',
            internalType: 'address',
            type: 'address',
          },
          {
            indexed: true,
            name: 'operator',
            internalType: 'address',
            type: 'address',
          },
          {
            indexed: false,
            name: 'approved',
            internalType: 'bool',
            type: 'bool',
          },
        ],
        name: 'ApprovalForAll',
        anonymous: false,
        type: 'event',
      },
      {
        inputs: [
          {
            indexed: true,
            name: 'previousOwner',
            internalType: 'address',
            type: 'address',
          },
          {
            indexed: true,
            name: 'newOwner',
            internalType: 'address',
            type: 'address',
          },
        ],
        name: 'OwnershipTransferred',
        anonymous: false,
        type: 'event',
      },
      {
        inputs: [
          {
            indexed: true,
            name: 'from',
            internalType: 'address',
            type: 'address',
          },
          {
            indexed: true,
            name: 'to',
            internalType: 'address',
            type: 'address',
          },
          {
            indexed: true,
            name: 'tokenId',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
        name: 'Transfer',
        anonymous: false,
        type: 'event',
      },
      {
        outputs: [],
        inputs: [
          {
            name: 'to',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'tokenId',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
        name: 'approve',
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        outputs: [
          {
            name: '',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
        inputs: [
          {
            name: 'owner',
            internalType: 'address',
            type: 'address',
          },
        ],
        name: 'balanceOf',
        stateMutability: 'view',
        type: 'function',
      },
      {
        outputs: [
          {
            name: '',
            internalType: 'string',
            type: 'string',
          },
        ],
        inputs: [],
        name: 'baseURI',
        stateMutability: 'view',
        type: 'function',
      },
      {
        outputs: [
          {
            name: '',
            internalType: 'address',
            type: 'address',
          },
        ],
        inputs: [
          {
            name: 'tokenId',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
        name: 'getApproved',
        stateMutability: 'view',
        type: 'function',
      },
      {
        outputs: [
          {
            name: '',
            internalType: 'bool',
            type: 'bool',
          },
        ],
        inputs: [
          {
            name: 'owner',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'operator',
            internalType: 'address',
            type: 'address',
          },
        ],
        name: 'isApprovedForAll',
        stateMutability: 'view',
        type: 'function',
      },
      {
        outputs: [],
        inputs: [],
        name: 'mint',
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        outputs: [
          {
            name: '',
            internalType: 'string',
            type: 'string',
          },
        ],
        inputs: [],
        name: 'name',
        stateMutability: 'view',
        type: 'function',
      },
      {
        outputs: [
          {
            name: '',
            internalType: 'address',
            type: 'address',
          },
        ],
        inputs: [],
        name: 'owner',
        stateMutability: 'view',
        type: 'function',
      },
      {
        outputs: [
          {
            name: '',
            internalType: 'address',
            type: 'address',
          },
        ],
        inputs: [
          {
            name: 'tokenId',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
        name: 'ownerOf',
        stateMutability: 'view',
        type: 'function',
      },
      {
        outputs: [],
        inputs: [],
        name: 'renounceOwnership',
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        outputs: [],
        inputs: [
          {
            name: 'from',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'to',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'tokenId',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
        name: 'safeTransferFrom',
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        outputs: [],
        inputs: [
          {
            name: 'from',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'to',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'tokenId',
            internalType: 'uint256',
            type: 'uint256',
          },
          {
            name: 'data',
            internalType: 'bytes',
            type: 'bytes',
          },
        ],
        name: 'safeTransferFrom',
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        outputs: [],
        inputs: [
          {
            name: 'operator',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'approved',
            internalType: 'bool',
            type: 'bool',
          },
        ],
        name: 'setApprovalForAll',
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        outputs: [
          {
            name: '',
            internalType: 'bool',
            type: 'bool',
          },
        ],
        inputs: [
          {
            name: 'interfaceId',
            internalType: 'bytes4',
            type: 'bytes4',
          },
        ],
        name: 'supportsInterface',
        stateMutability: 'view',
        type: 'function',
      },
      {
        outputs: [
          {
            name: '',
            internalType: 'string',
            type: 'string',
          },
        ],
        inputs: [],
        name: 'symbol',
        stateMutability: 'view',
        type: 'function',
      },
      {
        outputs: [
          {
            name: '',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
        inputs: [
          {
            name: 'index',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
        name: 'tokenByIndex',
        stateMutability: 'view',
        type: 'function',
      },
      {
        outputs: [
          {
            name: '',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
        inputs: [
          {
            name: 'owner',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'index',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
        name: 'tokenOfOwnerByIndex',
        stateMutability: 'view',
        type: 'function',
      },
      {
        outputs: [
          {
            name: '',
            internalType: 'string',
            type: 'string',
          },
        ],
        inputs: [
          {
            name: 'tokenId',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
        name: 'tokenURI',
        stateMutability: 'view',
        type: 'function',
      },
      {
        outputs: [
          {
            name: '',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
        inputs: [],
        name: 'totalSupply',
        stateMutability: 'view',
        type: 'function',
      },
      {
        outputs: [],
        inputs: [
          {
            name: 'from',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'to',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'tokenId',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
        name: 'transferFrom',
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        outputs: [],
        inputs: [
          {
            name: 'newOwner',
            internalType: 'address',
            type: 'address',
          },
        ],
        name: 'transferOwnership',
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
    contractCode:
      '// SPDX-License-Identifier: MIT\npragma solidity 0.8.18;\n\nimport "@openzeppelin/contracts/token/ERC721/ERC721.sol";\nimport "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";\nimport "@openzeppelin/contracts/access/Ownable.sol";\n\ncontract BlockfabricTronNft is ERC721, ERC721Enumerable, Ownable {\n    string private _baseTokenURI;\n    uint256 private _tokenIdCounter;\n\n    constructor(string memory baseTokenURI) ERC721("BFTronNFT", "NFTN") {\n        _baseTokenURI = baseTokenURI;\n    }\n\n    function _baseURI() internal view virtual override returns (string memory) {\n        return _baseTokenURI;\n    }\n\n    function _beforeTokenTransfer(address from, address to, uint256 firstTokenId, uint256 batchSize)\n        internal\n        virtual\n        override(ERC721, ERC721Enumerable)\n    {\n        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);\n    }\n\n    function supportsInterface(bytes4 interfaceId)\n        public\n        view\n        virtual\n        override(ERC721, ERC721Enumerable)\n        returns (bool)\n    {\n        return super.supportsInterface(interfaceId);\n    }\n\n    // Public function to expose the base URI\n    function baseURI() public view returns (string memory) {\n        return _baseTokenURI;\n    }\n\n    // Minting function restricted to the owner\n    function mint() public onlyOwner {\n        _mint(msg.sender, _tokenIdCounter);\n        _tokenIdCounter++;\n    }\n}',
    status: AppStatuses.Compiled,
    deployments: [
      {
        environment: Environments.Mainnet,
        blockchain: Blockchains.TRON,
        createdDateUTC: 1695432954787,
        contractAddress: 'TX9mtqA3hz7T2enMjhhDxiQ62CURzAz4pE',
        walletAddress: 'TGPvG2H2LcDScYy8z3yh9yCfm8PsikcVEH',
        transactionHash: 'c600c44d1a15ca7ada2aa0af0f07da665cf52c0f42106da5a25aad6da30fb998',
      },
      {
        environment: Environments.Testnet,
        blockchain: Blockchains.TRON,
        createdDateUTC: 1695435027620,
        contractAddress: 'TE9AqmmkoGsNPCUYsnV5FExWBFyaaNuWZM',
        walletAddress: 'TGPvG2H2LcDScYy8z3yh9yCfm8PsikcVEH',
        transactionHash: '0c6971470bd091f6f04a71730176385f4bf54ded9e61c42ece2bf42c092ad719',
      },
    ],
  },
  {
    createdDateUTC: 1694769233554,
    appId: 'cf94697d-573f-4a35-9b7e-2a4dbf23fbb0',
    name: 'BlockFabric Sample Token',
    description: '',
    appCreationMode: AppCreationModes.Template,
    appCreationSource: {
      templateId: '1',
      templateName: 'ERC20 Token Contract',
    },
    userId: '0200e8b8-4a41-442f-972b-c61299b3486f',
    contractByteCode: DEMO_TOKEN_BYTECODE,
    contractAbi: [
      {
        inputs: [
          {
            name: 'initialSupply',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
      },
      {
        inputs: [
          {
            indexed: true,
            name: 'owner',
            internalType: 'address',
            type: 'address',
          },
          {
            indexed: true,
            name: 'spender',
            internalType: 'address',
            type: 'address',
          },
          {
            indexed: false,
            name: 'value',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
        name: 'Approval',
        anonymous: false,
        type: 'event',
      },
      {
        inputs: [
          {
            indexed: true,
            name: 'from',
            internalType: 'address',
            type: 'address',
          },
          {
            indexed: true,
            name: 'to',
            internalType: 'address',
            type: 'address',
          },
          {
            indexed: false,
            name: 'value',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
        name: 'Transfer',
        anonymous: false,
        type: 'event',
      },
      {
        outputs: [
          {
            name: '',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
        inputs: [
          {
            name: 'owner',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'spender',
            internalType: 'address',
            type: 'address',
          },
        ],
        name: 'allowance',
        stateMutability: 'view',
        type: 'function',
      },
      {
        outputs: [
          {
            name: '',
            internalType: 'bool',
            type: 'bool',
          },
        ],
        inputs: [
          {
            name: 'spender',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'amount',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
        name: 'approve',
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        outputs: [
          {
            name: '',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
        inputs: [
          {
            name: 'account',
            internalType: 'address',
            type: 'address',
          },
        ],
        name: 'balanceOf',
        stateMutability: 'view',
        type: 'function',
      },
      {
        outputs: [
          {
            name: '',
            internalType: 'uint8',
            type: 'uint8',
          },
        ],
        inputs: [],
        name: 'decimals',
        stateMutability: 'view',
        type: 'function',
      },
      {
        outputs: [
          {
            name: '',
            internalType: 'bool',
            type: 'bool',
          },
        ],
        inputs: [
          {
            name: 'spender',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'subtractedValue',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
        name: 'decreaseAllowance',
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        outputs: [
          {
            name: '',
            internalType: 'bool',
            type: 'bool',
          },
        ],
        inputs: [
          {
            name: 'spender',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'addedValue',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
        name: 'increaseAllowance',
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        outputs: [
          {
            name: '',
            internalType: 'string',
            type: 'string',
          },
        ],
        inputs: [],
        name: 'name',
        stateMutability: 'view',
        type: 'function',
      },
      {
        outputs: [
          {
            name: '',
            internalType: 'string',
            type: 'string',
          },
        ],
        inputs: [],
        name: 'symbol',
        stateMutability: 'view',
        type: 'function',
      },
      {
        outputs: [
          {
            name: '',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
        inputs: [],
        name: 'totalSupply',
        stateMutability: 'view',
        type: 'function',
      },
      {
        outputs: [
          {
            name: '',
            internalType: 'bool',
            type: 'bool',
          },
        ],
        inputs: [
          {
            name: 'to',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'amount',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
        name: 'transfer',
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        outputs: [
          {
            name: '',
            internalType: 'bool',
            type: 'bool',
          },
        ],
        inputs: [
          {
            name: 'from',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'to',
            internalType: 'address',
            type: 'address',
          },
          {
            name: 'amount',
            internalType: 'uint256',
            type: 'uint256',
          },
        ],
        name: 'transferFrom',
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
    contractCode:
      '// SPDX-License-Identifier: MIT\npragma solidity 0.8.18;\n\nimport "@openzeppelin/contracts/token/ERC20/ERC20.sol";\n\ncontract BlockfabricTronToken is ERC20 {\n    constructor(uint256 initialSupply) ERC20("BlockFabric Tron Token", "BFTT") {\n        _mint(msg.sender, initialSupply);\n    }\n}',
    status: AppStatuses.Compiled,
    deployments: [
      {
        environment: Environments.Testnet,
        blockchain: Blockchains.TRON,
        createdDateUTC: 1694923305434,
        contractAddress: 'TRaGggHkr9YVswe3e5ZYCit1rdSCKXaoN6',
        walletAddress: 'TGPvG2H2LcDScYy8z3yh9yCfm8PsikcVEH',
        transactionHash: '17e84247a31622392e8948379083942bdb259452453723cd76a94d8d3838b194',
      },
    ],
  },
];
