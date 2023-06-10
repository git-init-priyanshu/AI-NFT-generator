import { useState, useEffect, useContext } from "react";
// import { ethers } from "ethers";
import detectEthereumProvider from "@metamask/detect-provider";

import { NFTcontext } from "./context/NFTcontext";
import { formatBalance, formatChainAsNum } from "../contract/utils/util.tsx";

export default function SaveNftToMetamask() {
  const { setAccount } = useContext(NFTcontext);
  // const { setAccount } = useContext(NFTcontext);

  const [hasProvider, setHasProvider] = useState<boolean | null>(null);
  const initialState = { accounts: ["none"], balance: "", chainId: "" };
  const [wallet, setWallet] = useState(initialState);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
      setHasProvider(Boolean(provider));

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
        setError(false);
        updateWallet(accounts);
        accounts && setAccount(accounts[0]);
      })
      .catch((err: any) => {
        setError(true);
        setErrorMessage(err.message);
      });
    setIsConnecting(false);
  };

  const disableConnect = Boolean(wallet) && isConnecting;

  return (
    <div className="App">
      <div>Injected Provider {hasProvider ? "DOES" : "DOES NOT"} Exist</div>

      {window.ethereum?.isMetaMask && wallet.accounts.length < 1 && (
        <button disabled={disableConnect} onClick={connectWallet}>
          Connect MetaMask
        </button>
      )}
      {/* <button onClick={connectWallet}>Connect Metamask</button> */}

      {wallet.accounts.length > 0 && (
        <>
          <div>Wallet Accounts: {wallet.accounts[0]}</div>
          <div>Wallet Balance: {wallet.balance}</div>
          <div>Hex ChainId: {wallet.chainId}</div>
          <div>Numeric ChainId: {formatChainAsNum(wallet.chainId)}</div>
        </>
      )}
      {error && (
        <div onClick={() => setError(false)}>
          <strong>Error:</strong> {errorMessage}
        </div>
      )}
    </div>
  );
}
