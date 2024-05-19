export const devnet = {
  id: 1337,
  name: 'DevNet',
  network: 'eth',
  nativeCurrency: {
    decimals: 18,
    name: 'ETH',
    symbol: 'ETH'
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.charsoft.tech'],
      webSocket: ['wss://rpc.charsoft.tech']
    },
    public: {
      http: ['https://rpc.charsoft.tech'],
      webSocket: ['wss://rpc.charsoft.tech']
    }
  },
  blockExplorers: {
    etherscan: {
      name: 'BscScan',
      url: 'http://block.charsoft.tech'
    },
    default: {
      name: 'BscScan',
      url: 'http://block.charsoft.tech'
    }
  },
  contracts: {
  }
}