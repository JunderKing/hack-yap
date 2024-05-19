import { useEffect, useState } from "react"
import CoinSelect from "../components/CoinSelect"
import CoinLabel from "../components/CoinLabel"
import useContract from "../hooks/useContract"
import useErc20 from "../hooks/useErc20"
import { message } from "antd"
import { useAccount } from "wagmi"
import { divDecimal } from "../utils/helper"

export default function Stake() {
  const [activeTab, setActiveTab] = useState('stake')
  const [amount, setAmount] = useState(0)
  const [usdBalance, setUsdBalance] = useState(0)
  const [usdrBalance, setUsdrBalance] = useState(0)
  const yapContract = useContract('yap')
  const usdtToken = useErc20('usdt')
  const usdcToken = useErc20('usdc')
  const daiToken = useErc20('dai')
  const usdrToken = useErc20('usdr')
  const { address } = useAccount()
  let usdToken = usdtToken

  const refreshPage = async () => {
    let amount = await usdToken.read("balanceOf", [address])
    setUsdBalance(divDecimal(amount))
    amount = await usdrToken.read("balanceOf", [address])
    setUsdrBalance(divDecimal(amount))
  }
  useEffect(() => {
    refreshPage()
  }, [])

  const onCoinSelect = async (coin) => {
    if (coin === 'usdt') {
      usdToken = usdtToken
    } else if (coin === 'usdc') {
      usdToken = usdcToken
    } else if (coin === 'dai') {
      usdToken = daiToken
    }
    let amount = await usdToken.read("balanceOf", [address])
    setUsdBalance(divDecimal(amount))
  }

  const handleStake = async () => {
    if (amount <= 0) {
      return message.error("Wrong amount")
    }
    // approve
    await usdToken.mustApprove(yapContract.address, amount * 10 ** 18)
    // stake
    await yapContract.write('deposit', [usdToken.address, amount * 10 ** 18])
    refreshPage()
  }

  const handleUnstake = async () => {
    console.log("unstake")
    if (amount <= 0) {
      return message.error("Wrong amount")
    }
    // approve
    await usdrToken.mustApprove(yapContract.address, amount * 10 ** 18)
    // stake
    await yapContract.write('withdraw', [usdToken.address, amount * 10 ** 18])
    refreshPage()
  }

  return (
    <div className="w-[1360px] py-[30px] mx-auto">
      <div className="w-[1360px] h-[594px] pt-[87px] bg-cover bg-center bg-[url('@/assets/stake/bg-main.png')]">
        <div className="w-[482px] h-[414px] mx-auto bg-cover bg-center bg-[url('@/assets/stake/bg-form.png')]">
          <div className="flex items-center justify-between text-[20px] leading-[35px] px-[35px] pt-[15px]">
            <div className="flex items-center">
              <div className="px-[15px] cursor-pointer rounded-[2px] border-[2px] border-[#26A17B]"
                style={{borderColor: activeTab === 'stake' ? '#26A17B' : 'rgba(0,0,0,0)'}} onClick={() => setActiveTab('stake')}>Stake</div>
              <div className="px-[15px] cursor-pointer rounded-[2px] border-[2px]"
                style={{borderColor: activeTab === 'unstake' ? '#26A17B' : 'rgba(0,0,0,0)'}} onClick={() => setActiveTab('unstake')}>Unstake</div>
            </div>
            <div>USDT APY 15.9%</div>
          </div>

          <div className="w-[412px] h-[86px] mx-auto mt-[1px] flex items-center justify-between px-[20px] relative">
            <div className="flex-1 flex-col justify-center">
              <div className="text-[20px] text-[#555]">You {activeTab === 'stake' ? 'stake' : 'payback'}</div>
              <input className="w-[250px] h-[45px] text-[50px] leading-[50px]" value={amount} onChange={(e) => setAmount(e.target.value)}/>
            </div>
            { activeTab === 'stake' ? <CoinSelect onSelect={onCoinSelect}/> : <CoinLabel/>}
            <div className="absolute bottom-[-3px] right-[22px] cursor-pointer"
              onClick={() => setAmount(activeTab == 'stake' ? usdBalance : usdrBalance)}
            >balance: {activeTab == 'stake' ? usdBalance : usdrBalance}</div>
          </div>

          <div className="w-[412px] h-[97px] mx-auto mt-[5px] flex items-center justify-between px-[20px] relative">
            <div className="flex-1 flex-col justify-center">
              <div className="text-[20px] text-[#555]">You {activeTab === 'stake' ? 'receive' : 'unstake'}</div>
              <input className="w-[250px] h-[45px] text-[50px] leading-[50px]" value={amount} onChange={(e) => setAmount(e.target.value)}/>
            </div>
            { activeTab !== 'stake' ? <CoinSelect onSelect={onCoinSelect}/> : <CoinLabel/>}
            <div className="absolute bottom-[0px] right-[22px] cursor-pointer"
              onClick={() => setAmount(activeTab == 'stake' ? usdrBalance : usdBalance)}>
                balance: {activeTab == 'stake' ? usdrBalance : usdBalance}
            </div>
          </div>

          <div className="w-[412px] h-[53px] flex items-center justify-center mt-[28px] mx-auto">
            USDR will be available to claime 7 days after unstaking
          </div>

          <div className="w-[412px] h-[53px] text-[40px] flex items-center justify-center mt-[20px] mx-auto cursor-pointer"
            onClick={ activeTab === 'stake' ? handleStake : handleUnstake}>
            { activeTab === 'stake' ? 'Stake' : 'Unstake' }
          </div>

        </div>
      </div>
    </div>
  )
}