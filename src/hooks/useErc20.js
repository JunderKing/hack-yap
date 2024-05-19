import { useAccount } from "wagmi"
import useContract from "./useContract"

export default function useErc20(name) {
  const erc20Contract = useContract(name)
  const {address} = useAccount()

  const mustApprove = async (spender, amount) => {
    if (!address) {
      throw new Error(`Please connect wallet`)
    }
    // 查询balance
    const balance = await erc20Contract.read('balanceOf', [address])
    if (balance < amount) {
      throw new Error(`Not enough ${name} balance: ${balance} < ${amount}`)
    }
    // 查询allowance
    const allowance = await erc20Contract.read('allowance', [address, spender])
    // approve
    if (allowance < amount) {
      await erc20Contract.write('approve', [spender, balance])
    }
  }

  const read = erc20Contract.read
  const write = erc20Contract.write

  return { mustApprove, read, write, address: erc20Contract.address }
}