import { readContract, waitForTransactionReceipt, writeContract } from "viem/actions"
import { getContractConfig } from "../config/contract.config"
import { config } from "../config/wagmi.config"
import { useAccount, useChainId, useClient, useConnectorClient } from "wagmi"
import { message } from "antd"

export default function useContract(name) {
  const chainId = useChainId()
  const { address: account } = useAccount()
  const { abi, address } = getContractConfig(name, chainId)
  const readClient = useClient({ config }) 
  const { data: writeClient } = useConnectorClient(config)

  const read = async (method, params = []) => {
    return await readContract(readClient, {
      abi, address,
      functionName: method,
      args: params
    })
  }

  const write = async (method, params = []) => {
    if (!account) {
      return message.error("Wallet not connected")
    }
    message.loading("Waitting for wallet sign...", 0)
    const hash = await writeContract(writeClient, {
      abi, address,
      functionName: method,
      args: params
    })
    message.destroy()
    message.loading("Waitting for block confirmation...", 0)
    await waitForTransactionReceipt(readClient, {
      confirmations: 1,
      hash 
    })
    message.destroy()
  }

  return { address, read, write }
}