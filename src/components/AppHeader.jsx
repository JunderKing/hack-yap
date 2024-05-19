import IconLogo from '@/assets/logo.png'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { Link } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { hideAddr } from '../utils/helper'

export default function AppHeader() {
  const { open } = useWeb3Modal()
  const { address } = useAccount()
  const openNetwork = () => {
    open({ view: 'Networks'})
  }
  const openAccount = () => {
    open()
  }

  const menus = [
    {label: 'Home', path: '/'},
    {label: 'Stake', path: '/stake'},
    {label: 'Liquidity', path: '/liquidity'},
  ]
  return (
    <div className="w-full">
      <div className="w-full h-[80px] fixed top-[0] left-[0] bg-primary text-[20px] text-white z-10">
        <div className="max-w-[1180px] h-full mx-auto flex items-center justify-between">
          <Link to="/">
            <img className="w-[50px] h-[50px]" src={IconLogo}/>
          </Link>
          <div className="flex-1 ml-[100px] space-x-[54px]">
            {
              menus.map((item, index) => (
                <Link className="cursor-pointer" key={index} to={item.path}>{item.label}</Link>
              ))
            }
          </div>
          <div className="text-white flex items-center">
            <div className="px-[10px] leading-[39px] border-[1px] border-white rounded-[10px] cursor-pointer" onClick={openNetwork}>Launch</div>
            <div className="px-[10px] leading-[39px] border-[1px] border-white rounded-[10px] ml-[20px] cursor-pointer" onClick={openAccount}>{hideAddr(address) || "Connect Wallet"}</div>
          </div>
        </div>
      </div>

      <div className="w-full h-[80px]"></div>
    </div>
  )
}