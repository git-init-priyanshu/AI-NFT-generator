const axios = require("axios");
const pinataWeb3 = require("pinata-web3")
const ethers = require("ethers");
require("dotenv").config();

const abi = require("../contract_abi.json");

const contractAddress = "0xF05CdcC75b9264a5B0e3F4D53ce837Fe0327077F";

const pinata = new pinataWeb3.PinataSDK({
  pinataJwt: process.env.PINATA_API_JWT || "",
  pinataGateway: "orange-general-mockingbird-357.mypinata.cloud",
});

const saveImgAsNFT = async (req, res) => {
  const { data: imgData } = req.body;

  try {
    // Uploading image to pinata
    const response = await pinata.upload.base64(imgData);
    if (!response) throw new Error({ success: false, msg: "Could not upload to IPFS" });
    console.log("Uploaded image to  pinata");

    // Getting hash of latest upload
    const hash = response.IpfsHash;
    const url = `https://gateway.pinata.cloud/ipfs/${hash}`;

    // Uploading metadata to pinata
    const metaData = await uploadMetadata(url);
    if (!metaData) return res.json({ success: false, msg: "Could not upload metadata to IPFS" })
    console.log("Uploaded metadata to pinata");

    // Getting final hash of the metadata
    const metadata_hash = metaData.IpfsHash;

    const token_URI = `https://gateway.pinata.cloud/ipfs/${metadata_hash}`;

    // Minting NFT
    const mintResponse = await mintNFT(token_URI);
    if (!mintResponse.success) throw new Error({ success: false, msg: mintResponse.msg });
    console.log("Minted the NFT");

    res.json({ success: true, data: mintResponse.data })
  } catch (error) {
    res.json({ success: false, msg: error.msg })
  }
}

module.exports = { saveImgAsNFT };

const uploadMetadata = async (url) => {
  var metaData = JSON.stringify({
    name: "My NFT",
    description: "Description of my NFT",
    image: `${url}`,
  });
  return new Promise(async (resolve, reject) => {
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
      resolve({ success: true, data: res.data });
    } catch (error) {
      reject({ success: false, msg: "Could not upload the metadata." });
    }
  });
};

const mintNFT = async (token_URI) => {
  return new Promise(async (resolve, reject) => {
    try {
      const privateKey = process.env.PRIVATE_KEY;
      const providerURL = process.env.QUICKNODE_URI;

      // Getting provider
      const provider = ethers.getDefaultProvider(providerURL);
      console.log("provider")

      // Getting signer
      const signer = new ethers.Wallet(privateKey, provider);
      console.log("signer")

      // Getting the deployed contract
      const contract = new ethers.Contract(contractAddress, abi, signer);
      console.log("contract")

      // Mint the NFT
      await contract.awardItem(`${token_URI}`);
      console.log("mint")

      resolve({ success: true, data: "Successfully minted the NFT" })
    } catch (error) {
      let errMsg = "Could not mint the NFT";
      if (error.info.error.code === -32000) errMsg = "Insufficient funds in your wallet. Please add funds to proceed with the transaction."
      reject({ success: false, msg: errMsg })
    }
  })
}
