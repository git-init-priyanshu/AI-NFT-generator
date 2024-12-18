const express = require("express");
const cors = require("cors");

const { generateImage } = require("./routes/generateImage")
const { saveImgAsNFT } = require("./routes/saveImgAsNFT")

const app = express();

app.use(express.json());
app.use(cors());

app.post("/api/generateImage", generateImage)
app.post("/api/saveAsNFT", saveImgAsNFT)

const PORT = 4000;
app.listen(PORT, () =>
  console.log(`🚀 Server ready at http://localhost:${PORT}`)
);
