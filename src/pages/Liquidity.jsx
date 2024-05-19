import { useEffect, useState } from "react";
import CoinSelect from "../components/CoinSelect";
import CoinUsdr from "@/assets/coin/coin-usdr.png"
import CoinUsdc from "@/assets/coin/coin-usdc.png"
import CoinDai from "@/assets/coin/coin-dai.png"
import CoinUsdt from "@/assets/coin/coin-usdt.png"
import useErc20 from "../hooks/useErc20";
import { useAccount } from "wagmi";
import { divDecimal } from "../utils/helper";
import { message } from "antd";
import useContract from "../hooks/useContract";

export default function Liquidity() {
  const [activeTab, setActiveTab] = useState('lock')
  const [amount, setAmount] = useState(0)
  const [lpBalance, setLpBalance] = useState(0)
  const {address} = useAccount()
  const yapContract = useContract('yap')
  const usdtLp = useErc20('usdt_usdr')
  const usdcLp = useErc20('usdc_usdr')
  const daiLp = useErc20('dai_usdr')
  const usdrToken = useErc20('usdr')
  let usdLp = usdtLp

  const prices = [
    {icon: CoinUsdt, label: 'USDT', price: 1.025},
    {icon: CoinDai, label: 'DAI', price: 0.983},
    {icon: CoinUsdc, label: 'USDC', price: 1.011},
    {icon: CoinUsdr, label: 'USDR', price: 1.01},
  ]

  const refreshPage = async () => {
    let amount = await usdLp.read("balanceOf", [address])
    setLpBalance(divDecimal(amount))
  }

  const refreshLpBalance = async (coin) => {
    if (coin === 'usdt') {
      usdLp = usdtLp
    } else if (coin === 'usdc') {
      usdLp = usdcLp
    } else if (coin === 'dai') {
      usdLp = daiLp
    }
    let amount = await usdLp.read("balanceOf", [address])
    setLpBalance(divDecimal(amount))
  }

  const handleCoinSelect = (coin) => {
    refreshLpBalance(coin)
  }
  useEffect(() => {
    refreshPage()
  }, [])

  const handleLock = async () => {
    if (amount <= 0) {
      return message.error("Wrong amount")
    }
    // approve
    await usdLp.mustApprove(yapContract.address, amount * 10 ** 18)
    // stake
    await yapContract.write('lock', [usdLp.address, amount * 10 ** 18])
    refreshPage()
  }

  const handleUnlock = async () => {
    if (amount <= 0) {
      return message.error("Wrong amount")
    }
    // approve
    await usdrToken.mustApprove(yapContract.address, amount * 10 ** 18)
    // stake
    await yapContract.write('unlock', [usdLp.address, amount * 10 ** 18])
    refreshPage()
  }

  return (
    <div className="w-[1360px] mx-auto py-[30px]">
      <div className="w-[1360px] h-[132px] py-[20px] px-[40px] flex items-center justify-between bg-cover bg-center bg-[url('@/assets/liquidity/bg-top.png')]">
        {
          prices.map((item, index) => (
            <div className="w-[305px] h-[92px] px-[20px] py-[12px]" key={index}>
              <div className="flex items-center">
                <img className="w-[24px] h-[24px]" src={item.icon}/>
                <div className="text-[20px] ml-[7px]">{item.label}</div>
              </div>
              <div className="text-[50px] leading-[50px]">${item.price}</div>
            </div>
          ))
        }
      </div>
      <div className="w-full flex justify-center mt-[20px]">
        {/* <div>
          <div className="w-[858px] h-[55px] bg-cover bg-center bg-[url('@/assets/liquidity/bg-table.png')]"></div>
        </div> */}

        <div className="w-[482px] h-[414px] bg-cover bg-center bg-[url('@/assets/liquidity/bg-form.png')]">
          <div className="flex items-center justify-between text-[20px] leading-[35px] px-[35px] pt-[15px]">
            <div className="flex items-center">
              <div className="px-[15px] cursor-pointer rounded-[2px] border-[2px] border-[#26A17B]"
                style={{borderColor: activeTab === 'lock' ? '#26A17B' : 'rgba(0,0,0,0)'}} onClick={() => setActiveTab('lock')}>Lock</div>
              <div className="px-[15px] cursor-pointer rounded-[2px] border-[2px]"
                style={{borderColor: activeTab === 'unlock' ? '#26A17B' : 'rgba(0,0,0,0)'}} onClick={() => setActiveTab('unlock')}>Unlock</div>
            </div>
            <div>USDT APY 15.9%</div>
          </div>

          {/* <div className="w-[412px] h-[86px] mx-auto mt-[1px] flex items-center justify-between px-[20px]">
            <div className="flex-1 flex-col justify-center">
              <div className="text-[20px] text-[#555]">You stake</div>
              <input className="w-[250px] h-[45px] text-[50px] leading-[50px]" value="0"/>
            </div>
            <CoinSelect/>
          </div> */}

          <div className="w-[412px] h-[185px] mx-auto mt-[5px] flex items-center justify-between px-[20px] relative">
            <div className="flex-1 flex-col justify-center">
              <div className="text-[20px] text-[#555]">You {activeTab === 'lock' ? 'lock' : 'unlock'}</div>
              <input className="w-[250px] h-[45px] text-[50px] leading-[50px]" value={amount} onChange={(e) => setAmount(e.target.value)}/>
            </div>
            <CoinSelect onSelect={handleCoinSelect}/>
            <div className="absolute bottom-[0px] right-[22px] cursor-pointer"
              onClick={() => setAmount(activeTab == 'lock' ? lpBalance : lpBalance)}>
                balance: {activeTab == 'lock' ? lpBalance : lpBalance}
            </div>
          </div>

          <div className="w-[412px] h-[53px] flex items-center justify-center mt-[28px] mx-auto">
            USDR will be available to claime 7 days after unlocking
          </div>

          <div className="w-[412px] h-[53px] text-[40px] flex items-center justify-center mt-[20px] mx-auto cursor-pointer"
            onClick={activeTab === 'lock' ? handleLock : handleUnlock}
          >
            {activeTab === 'lock' ? 'Lock' : 'Unlock'}
          </div>
        </div>
      </div>
    </div>
  )
}