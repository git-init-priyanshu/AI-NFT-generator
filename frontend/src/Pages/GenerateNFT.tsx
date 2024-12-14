import { useState, useEffect, useContext } from "react";
import { ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { NFTcontext } from "@/NFTcontext";
import { useToast } from "@/hooks/use-toast.ts";
import Navbar from "@/components/navbar"

import abi from "../contract/contract_abi.json";
import { formatBalance, formatChainAsNum } from "../contract/utils/util.tsx";

const contractAddress = "0xF05CdcC75b9264a5B0e3F4D53ce837Fe0327077F";

export default function CenteredLayout() {
  const { setAccount } = useContext(NFTcontext);
  const { toast } = useToast();

  const initialState = { accounts: ["none"], balance: "", chainId: "" };
  const [wallet, setWallet] = useState(initialState);
  const [isConnecting, setIsConnecting] = useState(false);
  const [imgState, setImgState] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>("");

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

  const getImage = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    const APIkey =
      "eDQEK5xVfrT2FdUl8HEwVS6X2MuhB3VASGzsgbnPlmNM6wvb5aJK7WwZxxet";

    // toast
    //   .promise(
    //     getData({
    //       variables: {
    //         key: APIkey,
    //         prompt: prompt,
    //       },
    //     }),
    //     {
    //       loading: "Generating Image...",
    //       success: (res) => {
    //         setImgState(res.data.getImage.output[0]);
    //         return "success";
    //       },
    //       error: "Some Error occured",
    //       /**
    //        * have to write code to handel error in backend
    //        * So that react toast displays the information correctly
    //        */
    //     }
    //   )
    //   .catch((err) => console.log(err));
  };

  const SaveNFT = ({ image }: saveProps) => {
    // const [uploadToPinata, { data }] = useLazyQuery(UPLOAD_TO_PINATA_QUERY);
    //
    // const saveToIpfs = async () => {
    //   // Store image to IPFS(Pinata)
    //   toast
    //     .promise(
    //       uploadToPinata({
    //         variables: {
    //           url: image,
    //         },
    //       }),
    //       {
    //         loading: "Uploading Image...",
    //         success: <b>Successfully Uploaded</b>,
    //         error: <b>Failed</b>,
    //       }
    //     )
    //     .then(() => {
    //       console.log(data);
    //       mintNFT(data.uploadToPinata.token_URI);
    //     })
    //     .catch((err) => console.log(err));
    // };
    //
    // const mintNFT = async (URI: string) => {
    //   // Getting provider
    //   const providerURL = process.env.QUICKNODE_URI;
    //   const provider = ethers.getDefaultProvider(providerURL);
    //   // Metamask private key
    //   const privateKey = process.env.PRIVATE_KEY;
    //   // Getting signer
    //   const signer = new ethers.Wallet(privateKey, provider);
    //
    //   // Getting the deployed contract
    //   const contract = new ethers.Contract(contractAddress, abi, signer);
    //
    //   console.log(URI);
    //   const mintNFT = URI && (await contract.awardItem(`${URI}`));
    //   console.log(mintNFT);
  };

  const disableConnect = Boolean(wallet) && isConnecting;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "click"
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar wallet={wallet} connectWallet={connectWallet} disableConnect={disableConnect} />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <img
              src={imgState ?? "https://kzmopto23m9na9vkdrh5.lite.vusercontent.net/placeholder.svg?height=300&width=300"}
              alt="Centered image"
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
            <Button disabled={disableConnect} type="submit">Submit</Button>
          </form>
        </div>
      </main>
    </div>
  )
}

