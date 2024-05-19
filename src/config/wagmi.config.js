import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { mainnet } from 'wagmi/chains'
import { devnet } from './chain.config.js'

export const projectId = 'a90a884e669bce814bd7a8062277cb63'
export const config = defaultWagmiConfig({
  chains: [devnet, mainnet],
  projectId,
  metadata: {
    name: 'Web3Modal',
    description: 'Web3Modal Example',
    url: 'https://ifgames.org', // origin must match your domain & subdomain
    icons: ['https://avatars.githubusercontent.com/u/37784886']
  },
})