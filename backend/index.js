const express = require("express");
const cors = require("cors");

const { generateImage } = require("./routes/generateImage")
const { saveImgAsNFT } = require("./routes/saveImgAsNFT")

const app = express();
app.use(express.json({ limit: "10mb" }));

const whitelist = [
  'http://localhost:5173',
  'https://ainft.pbcreates.xyz',
  'https://ai-nft-generator.netlify.app'
]
const corsOptions = {
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
app.use(cors(corsOptions));

// Routes
app.get("/api/health", (req, res) =>{
  console.log("Health route triggered");
  res.send("Server is in good health.");
})
app.post("/api/generateImage", generateImage)
app.post("/api/saveAsNFT", saveImgAsNFT)

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`🚀 Server ready at http://localhost:${PORT}`)
);
