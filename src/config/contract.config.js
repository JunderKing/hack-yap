import yapAbi from '@/config/abis/yapAbi.json'
import { erc20Abi } from 'viem'

const config = {
  yap: {
    abi: yapAbi,
    1337: '0x38B464c8CdA34a5C870Ff5d740F5eD9029aD54BE',
  },
  usdt: {
    abi: erc20Abi,
    1337: '0x54fe491263a4eDBb8D27EF77e483fea19B68bf84',
  },
  usdc: {
    abi: erc20Abi,
    1337: '0xD53589EAF3e44E0e60Ea8c0CBc9555c9Af8A15a6',
  },
  dai: {
    abi: erc20Abi,
    1337: '0x4C11e82962F997fdC24B4BD4A3cE5d0554E1E2fA',
  },
  usdr: {
    abi: erc20Abi,
    1337: '0xd47Db33EbC5aaDEE716321dF3631Bf78272C52E5',
  },
  dao: {
    abi: erc20Abi,
    1337: '0xdE882f78323877981A86CE36e669c0A8329C54F0',
  },
  usdt_usdr: {
    abi: erc20Abi,
    1337: '0x181d01bc615E9f85a6EFB5778c99923F5cCA7f19'
  },
  usdc_usdr: {
    abi: erc20Abi,
    1337: '0x181d01bc615E9f85a6EFB5778c99923F5cCA7f19'
  },
  dai_usdr: {
    abi: erc20Abi,
    1337: '0x181d01bc615E9f85a6EFB5778c99923F5cCA7f19'
  }
}

export function getContractConfig(name, chainId) {
  const contractConf = config[name]
  if (!contractConf) {
    return { abi: [], address: '0x0000000000000000000000000000000000000000' }
    // throw new Error("Wrong contract name: " + name)
  }
  const abi = contractConf.abi
  const address = contractConf[chainId]
  if (!address) {
    return { abi: [], address: '0x0000000000000000000000000000000000000000' }
    // throw new Error("Unsupported chain: " + chainId)
  }
  return { abi, address }
}