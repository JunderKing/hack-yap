import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import AppHeader from "./components/AppHeader"
import Home from "./pages/Home"
import Stake from "./pages/Stake"
import Liquidity from "./pages/Liquidity"
import BgPiece from '@/assets/bg-piece.png'
import { Web3ModalProvider } from "./providers/Web3Modal"

function App() {
  return (
    <Web3ModalProvider>
      <Router>
        <AppHeader/>
        <div className="w-full bg-[url('@/assets/bg-piece.png')]" style={{
          minHeight: "calc(100vh - 80px)",
          backgroundSize: "60px 60px"
        }}>
          <Routes>
            <Route path="/" Component={Home}/>
            <Route path="/stake" Component={Stake}/>
            <Route path="/liquidity" Component={Liquidity}/>
          </Routes>
        </div>
      </Router>
    </Web3ModalProvider>
  )
}

export default App
