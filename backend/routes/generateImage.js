// Don't need this route

const axios = require("axios");
require("dotenv").config();

const generateImage = async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.get(`https://image.pollinations.ai/prompt/${prompt}`);
    if (response.data) {
      const imgBuffer = Buffer.from(response.data);

      const data = {
        files: [{
          name: prompt + new Date().getTime(),
          size: imgBuffer.length,
          type: "jpeg"
        }],
        acl: "public-read",
        contentDisposition: 'inline'
      }
      const options = {
        method: 'POST',
        url: 'https://api.uploadthing.com/v6/uploadFiles',
        headers: {
          'Content-Type': 'application/json',
          'X-Uploadthing-Api-Key': process.env.UPLOADTHING_SECRET
        },
        data
      };
      const uploadResponse = await axios.request(options);
      res.json({ success: true, data: uploadResponse.data })
    }
  } catch (error) {
    res.json({ success: false, msg: error.response.statusText })
  }
}

module.exports = { generateImage };
