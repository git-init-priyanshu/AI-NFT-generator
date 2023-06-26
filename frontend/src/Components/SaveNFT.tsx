import { useState, useEffect } from "react";
import axios from "axios";
import { ethers } from "ethers";

import abi from "../contract/contract_abi.json";

const contractAddress = "0xF05CdcC75b9264a5B0e3F4D53ce837Fe0327077F";

type saveProps = {
  image: string[];
};
type data = {
  provider_url: string;
  private_key: string;
};

const SaveNFT = ({ image }: saveProps) => {
  const [data, setData] = useState<data | null>(null);
  // const [URI, setURI] = useState<string | null>(null);

  // Connecting to deployed Contract
  // Getting Quicknode HTTP provider URL and Metamask Private key from backend
  useEffect(() => {
    const fetchData = async () => {
      const config = {
        method: "get",
        url: "https://ai-nft-generator-backend.onrender.com/api/getdata",
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axios(config);
      const data: data = response.data;
      setData(data);
    };
    fetchData();
  }, []);

  const saveToIpfs = async () => {
    // Store image to IPFS(Pinata)
    try {
      const response = await fetch(
        "https://ai-nft-generator-backend.onrender.com/api/saveImg",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            // Request payload
            imgURL: image[0],
          }),
        }
      );
      const data = await response.json();
      console.log(data.token_URI);

      data && mintNFT(data.token_URI);
    } catch (error) {
      console.log(error);
    }
  };

  const mintNFT = async (URI: string) => {
    // Getting provider
    const providerURL =
      "https://sparkling-thrumming-meme.matic-testnet.discover.quiknode.pro/1c377d190c3a329a0c796f579b19945abc9a1d16/";
    const provider = ethers.getDefaultProvider(providerURL);
    // Metamask private key
    const privateKey = data.private_key;
    // Getting signer
    const signer = new ethers.Wallet(privateKey, provider);

    // Getting the deployed contract
    const contract = new ethers.Contract(contractAddress, abi, signer);

    console.log(URI);
    const mintNFT = URI && (await contract.awardItem(`${URI}`));
    console.log(mintNFT);
  };

  return (
    <>
      <button
        onClick={saveToIpfs}
        className=" mx-2 rounded-md bg-neutral-700 p-2 hover:bg-neutral-800 bg-opacity-80 hover:bg-opacity-75"
      >
        Save generated image as NFT
      </button>
    </>
  );
};

export default SaveNFT;
