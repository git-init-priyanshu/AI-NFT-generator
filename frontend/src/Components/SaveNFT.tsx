import { ethers } from "ethers";
import { useLazyQuery } from "@apollo/client";
import { Toaster, toast } from "react-hot-toast";

import UPLOAD_TO_PINATA_QUERY from "../Queries/uploadToPinata";
import abi from "../contract/contract_abi.json";

const contractAddress = "0xF05CdcC75b9264a5B0e3F4D53ce837Fe0327077F";

type saveProps = {
  image: string;
};

const SaveNFT = ({ image }: saveProps) => {
  const [uploadToPinata, { data }] = useLazyQuery(UPLOAD_TO_PINATA_QUERY);

  const saveToIpfs = async () => {
    // Store image to IPFS(Pinata)
    toast
      .promise(
        uploadToPinata({
          variables: {
            url: image,
          },
        }),
        {
          loading: "Uploading Image...",
          success: <b>Successfully Uploaded</b>,
          error: <b>Failed</b>,
        }
      )
      .then(() => {
        console.log(data);
        mintNFT(data.uploadToPinata.token_URI);
      })
      .catch((err) => console.log(err));
  };

  const mintNFT = async (URI: string) => {
    // Getting provider
    const providerURL = process.env.QUICKNODE_URI;
    const provider = ethers.getDefaultProvider(providerURL);
    // Metamask private key
    const privateKey = process.env.PRIVATE_KEY;
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
      <div>
        <Toaster position="bottom-right" reverseOrder={false} />
      </div>
      <button
        onClick={saveToIpfs}
        className="rounded-md bg-neutral-700 p-2 hover:bg-neutral-800 bg-opacity-80 hover:bg-opacity-75 sm:mx-0 sm: w-full  lg:mx-2 w-auto "
      >
        Save generated image as NFT
      </button>
    </>
  );
};

export default SaveNFT;
