const express = require("express");
const router = express.Router();

var request = require("request");

router.post("/getImage", async (req, res) => {
  // from stable diffusion's docs
  var options = {
    method: "POST",
    url: "https://modelslab.com/api/v6/realtime/text2img",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      key: req.body.key,
      prompt: req.body.prompt,
      negative_prompt: "bad quality",
      width: "512",
      height: "512",
      safety_checker: false,
      seed: null,
      samples: 1,
      base64: false,
      webhook: null,
      track_id: null
    }),
  };

  request(options, (error, response) => {
    if (error) throw new Error(error);
    res.send(response.body);
    console.log(response.body);
  });
});

module.exports = router;
