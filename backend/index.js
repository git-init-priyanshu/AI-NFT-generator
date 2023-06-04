const express = require("express");
const app = express();
const port = 5000;

app.use(express.json());

const cors = require("cors");
app.use(cors());

app.post("/getImage", async (req, res) => {
  var request = require("request");
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

  request(options, function (error, response) {
    if (error) throw new Error(error);
    res.send(response.body);
    console.log(response.body);
  });
});

// Pinata
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const JWT = "8c3dcdf3-e5a3-4b4e-9edd-9e06a35168e0R";
app.post("/saveImg", (req, res) => {
  const pinFileToIPFS = async () => {
    const formData = new FormData();
    const src = req.body.imgURL;

    const file = fs.createReadStream(src);
    formData.append("file", file);

    const metadata = JSON.stringify({
      name: "File name",
    });
    formData.append("pinataMetadata", metadata);

    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", options);

    try {
      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          maxBodyLength: "Infinity",
          headers: {
            "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
            Authorization: JWT,
          },
        }
      );
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
