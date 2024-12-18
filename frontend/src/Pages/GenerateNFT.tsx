import { useState, useEffect, useContext } from "react";
import axios from 'axios';
import detectEthereumProvider from "@metamask/detect-provider";

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { NFTcontext } from "@/NFTcontext";
import { useToast } from "@/hooks/use-toast.ts";
import Navbar from "@/components/navbar"

import { formatBalance } from "../contract/utils/util.tsx";
import { LoaderCircle } from "lucide-react";

export default function CenteredLayout() {
  const { setAccount } = useContext(NFTcontext);
  const { toast } = useToast();

  const initialState = { accounts: ["none"], balance: "", chainId: "" };
  const [wallet, setWallet] = useState(initialState);
  const [isConnecting, setIsConnecting] = useState(false);
  const [prompt, setPrompt] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imgState, setImgState] = useState<string | null>(null);

  // Connecting to metamask
  useEffect(() => {
    const refreshAccounts = (accounts: any) => {
      if (accounts.length > 0) {
        updateWallet(accounts);
      } else {
        // if length 0, user is disconnected
        setWallet(initialState);
      }
    };

    const refreshChain = (chainId: any) => {
      setWallet((wallet) => ({ ...wallet, chainId }));
    };

    const getProvider = async () => {
      const provider = await detectEthereumProvider({ silent: true });

      if (provider) {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        refreshAccounts(accounts);
        window.ethereum.on("accountsChanged", refreshAccounts);
        window.ethereum.on("chainChanged", refreshChain);
      }
    };

    getProvider();

    return () => {
      window.ethereum?.removeListener("accountsChanged", refreshAccounts);
      window.ethereum?.removeListener("chainChanged", refreshChain);
    };
  }, []);

  const updateWallet = async (accounts: any) => {
    const balance = formatBalance(
      await window.ethereum!.request({
        method: "eth_getBalance",
        params: [accounts[0], "latest"],
      })
    );
    const chainId = await window.ethereum!.request({
      method: "eth_chainId",
    });
    setWallet({ accounts, balance, chainId });
  };

  const connectWallet = async () => {
    setIsConnecting(true);
    await window.ethereum
      .request({
        method: "eth_requestAccounts",
        params: [],
      })
      .then((accounts: ["none"]) => {
        updateWallet(accounts);
        accounts && setAccount(accounts[0]);
      })
      .catch((err: unknown) => {
        console.log(err);
      });
    setIsConnecting(false);
  };

  const SaveNFT = async () => {
    setIsUploading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/saveAsNFT`, { imgUrl: imgState });
      if (response.data.success) {
        toast({
          title: "Success",
          description: response.data.data
        })
        setIsUploading(false);
      }
    } catch (e) {
      console.log(e);
      toast({
        title: "Error",
        description: e.msg
      })
    } finally {
      setIsUploading(false);
    }
  };

  const disableConnect = Boolean(wallet) && isConnecting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsGenerating(true);
    try {
      const response = await axios.get(`https://image.pollinations.ai/prompt/${prompt}`, { responseType: 'blob' });
      if (!response) return setIsGenerating(false);

      const formData = new FormData();
      formData.append('image', response.data);

      const res = await axios.post(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
        formData
      )
      if (!res.data.success) return toast({
        title: "Error",
        description: "There was some error while generating the image"
      })
      setImgState(res.data.data.display_url);

      toast({
        title: "Success",
        description: "Image generated Successfully. Please wait while we prepare the image."
      })
    } catch (e) {
      console.log(e);
      toast({
        title: "Error",
        description: "There was some error while generating the image"
      })
    } finally {
      setPrompt("");
      setIsGenerating(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar wallet={wallet} connectWallet={connectWallet} disableConnect={disableConnect} />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <img
              src={imgState || "https://kzmopto23m9na9vkdrh5.lite.vusercontent.net/placeholder.svg?height=300&width=300"}
              alt="Generated img"
              className="w-full h-auto object-cover rounded"
            />
          </div>
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Input
              type="text"
              placeholder="Enter image URL"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-grow text-black bg-white"
            />
            <Button disabled={disableConnect || !prompt} type="submit">
              <p className={`${isGenerating ? "opacity-50" : ""}`}>Generate</p>
              {isGenerating ?
                <LoaderCircle className="animate-spin absolute" />
                : <></>
              }
            </Button>
          </form>
          <Button
            className="w-full relative"
            disabled={disableConnect || !imgState}
            onClick={SaveNFT}
          >
            <p className={`${isUploading ? "opacity-50" : ""}`}>Save as NFT</p>
            {isUploading ?
              <LoaderCircle className="animate-spin absolute" />
              : <></>
            }
          </Button>
        </div>
      </main>
    </div>
  )
}

