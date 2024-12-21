const axios = require("axios");
const ethers = require("ethers");
const axiosRetry = require("axios-retry");
const FormData = require("form-data");
require("dotenv").config();

const abi = require("../contract_abi.json");

const contractAddress = "0xF05CdcC75b9264a5B0e3F4D53ce837Fe0327077F";

const saveImgAsNFT = async (req, res) => {
  const { imgUrl } = req.body;
  console.log(imgUrl);

  try {
    const response = await uploadToPinata(imgUrl);
    if (!response) return res.json({ success: false, msg: "Could not upload to IPFS" })
    console.log("Uploaded image to  pinata");

    // Getting hash of latest upload
    const hash = response.IpfsHash;
    const url = `https://gateway.pinata.cloud/ipfs/${hash}`;

    // Uploading metadata
    const metaData = await uploadMetadata(url);
    if (!metaData) return res.json({ success: false, msg: "Could not upload metadata to IPFS" })
    console.log("Uploaded metadata to pinata");

    // Getting final hash of the metadata
    const metadata_hash = metaData.IpfsHash;

    const token_URI = `https://gateway.pinata.cloud/ipfs/${metadata_hash}`;

    // Minting NFT
    const mintResponse = await mintNFT(token_URI);
    if (!mintResponse.success) return res.json({ success: false, msg: mintResponse.msg });
    console.log("Minted the NFT");

    res.json({ success: true, data: mintResponse.data })
  } catch (error) {
    console.log(error);
    res.json({ success: false, msg: error.msg })
  }
}

module.exports = { saveImgAsNFT };

const uploadToPinata = async (sourceUrl) => {
  return new Promise(async (resolve, reject) => {
    // const axiosInstance = axios.create();
    // axiosRetry(axiosInstance, { retries: 5 });

    const data = new FormData();

    try {
      const response = await axios.get(sourceUrl, {
        responseType: "stream",
      });
      data.append(`file`, response.data, "image.jpg");

      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data,
        {
          maxBodyLength: Infinity,
          headers: {
            "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
            Authorization: `Bearer ${process.env.PINATA_API_JWT}`,
          },
        },
      );
      console.log("here2")
      resolve(res.data); // Resolve the promise with the desired value
    } catch (error) {
      reject(error); // Reject the promise with the error
    }
  });
};

const uploadMetadata = async (url) => {
  return new Promise(async (resolve, reject) => {
    var metaData = JSON.stringify({
      name: "My NFT",
      description: "Description of my NFT",
      image: `${url}`,
    });
    try {
      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        metaData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.PINATA_API_JWT}`,
          },
        }
      );

      resolve(res.data);
    } catch (error) {
      reject(error);
    }
  });
};

const mintNFT = async (token_URI) => {
  try {
    const privateKey = process.env.PRIVATE_KEY;
    const providerURL = process.env.QUICKNODE_URI;

    // Getting provider
    console.log("provider")
    const provider = ethers.getDefaultProvider(providerURL);
    // Getting signer
    console.log("signer")
    const signer = new ethers.Wallet(privateKey, provider);
    // Getting the deployed contract
    console.log("contract")
    const contract = new ethers.Contract(contractAddress, abi, signer);

    // Mint the NFT
    console.log("mint")
    await contract.awardItem(`${token_URI}`);
    console.log("Success")

    return { success: true, data: "Successfully minted the NFT" }
  } catch (error) {
    console.log(error);
    return { success: false, msg: "Could not mint the NFT" }
  }
}
