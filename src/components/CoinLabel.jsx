import CoinUsdr from "@/assets/coin/coin-usdr.png"

export default function CoinLabel() {
  return (
    <div className="cursor-pointer rounded-[2px] border-[2px] border-[#26A17B] items-center inline-flex h-[40px] px-[10px]">
      <img className="w-[24px] h-[24px]" src={CoinUsdr}/>
      <div className="w-[45px] ml-[5px]">USDR</div>
    </div>
  )
}
