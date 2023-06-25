const express = require("express");
const serverless = require("serverless-http");

// const port = 5000;

const app = express();

app.use(express.json());

const cors = require("cors");
app.use(cors());

// Available Routes
app.use("/api", require("./routes/getImage_StableDiffusion"));
app.use("/api", require("./routes/storeToIpfs_Pinata"));
app.use("/api", require("./routes/getData"));

module.exports.handler = serverless(app);

// app.listen(port, () => {
//   console.log(`Listening on port ${port}`);
// });
