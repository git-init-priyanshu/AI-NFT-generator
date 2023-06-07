import { useState, useEffect } from "react";
import { ethers } from "ethers";

import abi from "../abi/contract_abi.json";

declare global {
  interface Window {
    ethereum?: any; // declares the ethereum property
  }
}

export default function SaveNftToMetamask() {
  const [state, setState] = useState<{
    provider: any;
    signer: any;
    contract: object;
  }>({
    provider: null,
    signer: null,
    contract: null,
  });

  const [URIArr, setURIArr] = useState<string[]>([]);

  const [account, setAccount] = useState("none");

  useEffect(() => {
    const fetchArr = async () => {
      const response = await fetch("http://localhost:5000/api/getURI", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setURIArr(data);
    };
    fetchArr();
  }, []);

  // Connecting to metamask
  const connectWallet = async () => {
    const contractAddress = ""; //paste your deployed contract address here
    const contractABI = abi;
    try {
      // If metamask is installed
      // Then we have ethereum in the window object
      const { ethereum } = window;

      if (ethereum) {
        const account: string = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        setAccount(account);
        setState({ provider, signer, contract });
      } else {
        alert("Please install metamask");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return <button onClick={connectWallet}>Connect to metamask</button>;
}
