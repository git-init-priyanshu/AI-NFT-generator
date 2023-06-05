const express = require("express");
const router = express.Router();

const axios = require("axios");
require("dotenv").config();

const ipfsHash = [];
const axiosRetry = require("axios-retry");
const FormData = require("form-data");

router.post("/saveImg", async (req, res) => {
  const src = req.body.imgURL;
  uploadToPinata(src);
});

const uploadToPinata = async (sourceUrl) => {
  const axiosInstance = axios.create();
  axiosRetry(axiosInstance, { retries: 5 });

  const data = new FormData();

  const response = await axiosInstance(sourceUrl, {
    method: "GET",
    responseType: "stream",
  });
  data.append(`file`, response.data);

  try {
    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      data,
      {
        maxBodyLength: "Infinity",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
          pinata_api_key: process.env.API_KEY,
          pinata_secret_api_key: process.env.API_SECRET,
        },
      }
    );
    ipfsHash.push(res.IpfsHash);
  } catch (error) {
    console.log(error);
  }
};

module.exports = router;
