const express = require("express");
const router = express.Router();

var request = require("request");

router.post("/getImage", async (req, res) => {
  var options = {
    method: "POST",
    url: "https://stablediffusionapi.com/api/v3/text2img",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      key: req.body.key,
      prompt: req.body.prompt,
      negative_prompt: null,
      width: "512",
      height: "512",
      samples: "1",
      num_inference_steps: "20",
      seed: null,
      guidance_scale: 7.5,
      safety_checker: "yes",
      multi_lingual: "no",
      panorama: "no",
      self_attention: "no",
      upscale: "no",
      embeddings_model: "embeddings_model_id",
      webhook: null,
      track_id: null,
    }),
  };

  request(options, (error, response) => {
    if (error) throw new Error(error);
    res.send(response.body);
    console.log(response.body);
  });
});

module.exports = router;
