import { ethers } from "ethers";
import { useContext } from "react";
import { NFTcontext } from "./context/NFTcontext";

type saveProps = {
  image: string[];
};

const SaveNFT = ({ image }: saveProps) => {
  const { state } = useContext(NFTcontext);

  const saveToIpfs = async () => {
    try {
      // Store image to IPFS(piniata)
      await fetch("http://localhost:5000/api/saveImg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Request payload
          imgURL: image[0],
        }),
      });
    } catch (error) {
      console.log(error);
    }

    mintNFT();
  };

  const mintNFT = async () => {
    const { contract } = state;

    const amt = {
      value: ethers.utils.parseEther("0.001"),
      gasLimit: ethers.utils.parseEther("0.00000000001"),
    };
    const mint = await contract.awardItem("tokenURI", amt);
  };
  return <>{state ? <button onClick={saveToIpfs}>Save NFT</button> : ""}</>;
};

export default SaveNFT;
