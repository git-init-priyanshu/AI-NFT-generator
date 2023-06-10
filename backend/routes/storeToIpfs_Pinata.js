const express = require("express");
const router = express.Router();

const axios = require("axios");
require("dotenv").config();

// const ipfsHash = [];
const axiosRetry = require("axios-retry");
const FormData = require("form-data");

// from pinata's doc
router.post("/saveImg", async (req, res) => {
  const src = req.body.imgURL;
  const response = await uploadToPinata(src);

  // Getting hash of latest upload
  const hash = response.IpfsHash;
  const url = `https://gateway.pinata.cloud/ipfs/${hash}`;
  // Uploading metadata
  const data = await uploadMetadata(url);
  const metadata_hash = data.IpfsHash;

  res.json({ token_URI: `https://gateway.pinata.cloud/ipfs/${metadata_hash}` });
});

const uploadToPinata = async (sourceUrl) => {
  return new Promise(async (resolve, reject) => {
    const axiosInstance = axios.create();
    axiosRetry(axiosInstance, { retries: 5 });

    const data = new FormData();

    try {
      const response = await axiosInstance(sourceUrl, {
        method: "GET",
        responseType: "stream",
      });
      data.append(`file`, response.data);

      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data,
        {
          maxBodyLength: Infinity,
          headers: {
            "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
            Authorization: `Bearer ${process.env.JWT}`,
          },
        }
      );
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
      var config = {
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.JWT}`,
        },
        data: metaData,
      };

      const res = await axios(config);

      resolve(res.data);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = router;
