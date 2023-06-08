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
    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      data,
      {
        maxBodyLength: "Infinity",
        headers: {
          "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
          Authorization: `Bearer ${process.env.JWT}`,
        },
      }
    );
    // ipfsHash.push(response.data.IpfsHash);
    // console.log(response.data.IpfsHash);
  } catch (error) {
    console.log(error);
  }
};

router.get("/getURI", async (req, res) => {
  try {
    const config = {
      method: "get",
      url: "https://api.pinata.cloud/data/pinList?status=pinned&pinSizeMin=100",
      headers: {
        Authorization: `Bearer ${process.env.JWT}`,
      },
    };
    const response = await axios(config);

    let URI = [];
    let ipfsHash = response.data.rows;
    for (let i = 0; i < ipfsHash.length; i++) {
      const hash = ipfsHash[i].ipfs_pin_hash;

      URI.push(`https://gateway.pinata.cloud/ipfs/${hash}`);
    }
    res.send(URI);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
