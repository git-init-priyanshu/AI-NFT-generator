const express = require("express");
const app = express();
const port = 5000;

app.use(express.json());

const cors = require("cors");
app.use(cors());

// Available Routes
app.use("/api", require("./routes/getImage_StableDiffusion"));
app.use("/api", require("./routes/storeToIpfs_Pinata"));

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
