import { Button } from "@/components/ui/button"
import { BrainCircuit } from "lucide-react"
import metamask from "../assets/MetaMask_Fox.svg.png";

type NavbarPropType = {
  wallet: any,
  connectWallet: any,
  disableConnect: boolean,
}
export default function Navbar({ wallet, connectWallet, disableConnect }: NavbarPropType) {
  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-md">
      <div className="flex items-center gap-2">
        <BrainCircuit className="text-black" />
        <p className="text-black font-bold">AI NFT</p>
      </div>
      {/* <div className="text-black">My Website</div> */}
      {wallet.accounts.length > 0 && (
        <div className="text-black">
          {wallet.accounts[0] !== "none" ? wallet.accounts[0] : "Account: none"}
        </div>
      )}
      <Button disabled={disableConnect} onClick={connectWallet} className="flex gap-2">
        <img src={metamask} className="w-8" />
        {wallet.accounts[0] !== "none" ? <p>Connected</p> : <p>Connect</p>}
      </Button>
    </nav>
  )
}

