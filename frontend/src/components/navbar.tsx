import { Button } from "@/components/ui/button"
import { BrainCircuit } from "lucide-react"
import metamask from "../assets/MetaMask_Fox.svg.png";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

type NavbarPropType = {
  wallet: any,
  connectWallet: any,
  disableConnect: boolean,
}
export default function Navbar({ wallet, connectWallet, disableConnect }: NavbarPropType) {
  const { toast } = useToast();

  const [isMetamaskInstalled, setIsMetamaskInstalled] = useState(false);
  useEffect(() => {
    if (window.ethereum) {
      setIsMetamaskInstalled(true);
    }
  }, [window])

  const handleOnClick = () => {
    if (!isMetamaskInstalled) return toast({
      title: "Metamask not installed",
      description: "Install the metamask wallet to use this function."
    })

    connectWallet();
  }

  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-md">
      <div className="flex items-center gap-2">
        <BrainCircuit className="text-black" />
        <p className="text-black font-bold">AI NFT</p>
      </div>
      {wallet.accounts.length > 0 && (
        <div className="text-black">
          {wallet.accounts[0] !== "none" ? wallet.accounts[0] : "Account: none"}
        </div>
      )}
      <Button disabled={disableConnect} onClick={handleOnClick} className="flex gap-2">
        <img src={metamask} className="w-8" />
        {wallet.accounts[0] !== "none" ? <p>Connected</p> : <p>Connect</p>}
      </Button>
    </nav>
  )
}

