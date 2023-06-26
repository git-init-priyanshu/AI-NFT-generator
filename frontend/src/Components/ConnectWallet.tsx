import { useState, useEffect, useContext } from "react";
import detectEthereumProvider from "@metamask/detect-provider";

import { NFTcontext } from "./context/NFTcontext";
import { formatBalance, formatChainAsNum } from "../contract/utils/util.tsx";

import metamask from "../assets/MetaMask_Fox.svg.png";
import icon from "../assets/icons8-old-vmware-logo.svg";

export default function SaveNftToMetamask() {
  const { setAccount } = useContext(NFTcontext);

  const initialState = { accounts: ["none"], balance: "", chainId: "" };
  const [wallet, setWallet] = useState(initialState);
  const [isConnecting, setIsConnecting] = useState(false);

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
      .catch((err: any) => {
        console.log(err);
      });
    setIsConnecting(false);
  };

  const disableConnect = Boolean(wallet) && isConnecting;

  return (
    <div className=" flex justify-between items-center h-16">
      <div className=" flex items-center gap-3">
        <img src={icon} alt="" className=" h-10" />
        <h1>AI NFT Generator</h1>
      </div>

      {wallet.accounts.length > 0 && (
        <div className="rounded-md bg-neutral-700 bg-opacity-80 p-2 ">
          {wallet.accounts[0] !== "none" ? wallet.accounts[0] : "Account: none"}
        </div>
      )}

      <div className="flex items-center">
        {wallet.accounts[0] !== "none" ? (
          <div className=" flex">
            <div className="rounded-md bg-neutral-700 bg-opacity-80 p-2 flex items-center rounded-r-none border-r border-neutral-500 ">
              {wallet.balance} MATIC
            </div>
            <div className=" bg-neutral-700 bg-opacity-80 p-2 flex items-center border-r border-neutral-500">
              ChainId: {formatChainAsNum(wallet.chainId)}
            </div>

            <div className="rounded-md bg-neutral-700 bg-opacity-80 p-2 flex items-center rounded-l-none hover:cursor-pointer">
              <div className=" circle"></div>
            </div>
          </div>
        ) : (
          <button
            disabled={disableConnect}
            onClick={connectWallet}
            className="flex items-center rounded-md bg-neutral-700 bg-opacity-80 p-2  hover:bg-neutral-800 hover:bg-opacity-75"
          >
            <img src={metamask} className=" w-8 mr-2" />
            Connect
          </button>
        )}
      </div>
    </div>
  );
}
