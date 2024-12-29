require("dotenv").config();

const generateImage = async (req, res) => {
  console.log("/api/generateImage")
  const { prompt } = req.body;

  const headers = new Headers();
  headers.append("x-apihub-key", process.env.AI_API_KEY);
  headers.append("x-apihub-host", "Visionary-LLM.allthingsdev.co");
  headers.append("x-apihub-endpoint", "a3a236af-e072-405a-8c4c-e540af401c08");

  const requestOptions = {
    method: "GET",
    headers,
    redirect: "follow"
  };

  try {
    const response = await fetch(`https://Visionary-LLM.proxy-production.allthingsdev.co/generate?prompt=${prompt}`, requestOptions)
    if (!response) new Error({ success: false, msg: "Could not generate the image." });

    const result = await response.json();
    const url = result.img_url;

    console.log("Generated img", url);
    res.json({ success: true, data: url })
  } catch (error) {
    console.log(error);
    res.json({ success: false, msg: error.msg })
  }
}

module.exports = { generateImage };
