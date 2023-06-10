const express = require("express");
const router = express.Router();
require("dotenv").config();

router.get("/getdata", (req, res) => {
  const data = {
    provider_url: process.env.PROVIDER_URL,
    private_key: process.env.PRIVATE_KEY,
  };

  res.send(data);
});

module.exports = router;
