import BgLine from '@/assets/home/bg-line.png'
import Content1 from '@/assets/home/content-1.png'
import Content2 from '@/assets/home/content-2.png'

export default function Home() {
  return (
    <div className="w-[1180px] mx-auto pt-[50px] pb-[63px]">
      <div className="leading-[33px] text-[24px]">
        <div className="w-full h-[330px] relative">
          <img className="w-[278px] h-[131px] absolute right-[-19px] bottom-[-54px]" src={BgLine} style={{zIndex: 0}}/>
          <div className="w-full h-[330px] absolute right-[0] top-[0]">
            <div style={{zIndex: 1}}>
              “We'll see maybe a high single-digit number of general-purpose ones,<br/>
              and then you'll see stablecoins that are specific for specific use cases.<br/>
              Some of that might be interbank settlement, perhaps where tokenized deposits are used.<br/>
              And maybe there's a stablecoin optimized for digital goods.<br/>
              Uh, definitely, there has to be more competition on the general-purpose side.<br/>
              I think the current state of the industry is very concentrated,<br/>
              and that makes the whole structure vulnerable.<br/>
              It's important that we have more players there, and we're happy to contribute to that.<br/>
              And then each of us will find their own.”
            </div>
            <div className="text-right">-----PayPal crypto lead Jose Fernandez da Ponte</div></div>
          </div>
      </div>

      <div className="relative right-[55px] w-[840px] h-[138px] text-[30px] leading-[24px] pt-[60px] pl-[78px] bg-cover bg-center bg-[url('@/assets/home/bg-title.png')]">
        We need a stablecoin that adopts a tiered approach<br/>to both usage scenarios regulatory compliance
      </div>
      <img className="w-[1221px] h-[345px] mt-[25px] mb-[9px]" src={Content1}/>
      <div className="relative right-[55px] w-[840px] h-[138px] text-[30px] leading-[24px] pt-[69px] pl-[78px] bg-cover bg-center bg-[url('@/assets/home/bg-title.png')]">
        2Pool as the key to scaleble stablecoin
      </div>
      <img className="w-[1035px] h-[488px] ml-[60px]" src={Content2}/>
    </div>
  )
}