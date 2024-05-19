import CoinUsdt from "@/assets/coin/coin-usdt.png"
import CoinUsdc from "@/assets/coin/coin-usdc.png"
import CoinDai from "@/assets/coin/coin-dai.png"
import { useState } from "react"

export default function CoinSelect(props) {
  const [optionStatus, setOptionStatus] = useState(false)
  const options = [
    {label: 'USDT', value: 'usdt', icon: CoinUsdt},
    {label: 'USDC', value: 'usdc', icon: CoinUsdc},
    {label: 'Dai', value: 'dai', icon: CoinDai},
  ]
  const value = props.value || 'usdt'
  const selectedCoin = options.find(i => i.value == value)
  const [curCoin, setCurCoin] = useState(selectedCoin)
  const handleSelect = (coin) => {
    setCurCoin(coin)
    props.onSelect(coin.value)
    setOptionStatus(false)
  }
  return (
    <div className="relative">
      <div className="cursor-pointer rounded-[2px] border-[2px] border-[#26A17B] items-center inline-flex h-[40px] px-[10px]"
        onClick={() => setOptionStatus(!optionStatus)}>
        <img className="w-[24px] h-[24px]" src={curCoin.icon}/>
        <div className="w-[45px] ml-[5px]">{curCoin.label}</div>
        <div>V</div>
      </div>
      {

        optionStatus &&
        <div className="absolute top-[39px] right-0 border-[1px] border-[#26A17B] bg-[url('@/assets/bg-piece.png')]" style={{
          backgroundSize: "60px 60px",
          zIndex: 100,
        }}>
          {
            options.map((item, index) => (
              <div className="flex items-center h-[33px] px-[10px] cursor-pointer" onClick={() => handleSelect(item)} key={index}>
                <img className="w-[24px] h-[24px] mr-[10px]" src={item.icon}/>
                <div>{item.label}</div>
              </div>
            ))
          }
        </div>
      }
    </div>
  )
}
