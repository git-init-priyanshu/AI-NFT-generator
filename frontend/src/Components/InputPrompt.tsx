import { useState } from "react";
import Image from "./Image";
// import SaveNftToMetamask from "./SaveNftToMetamask";

export default function InputPrompt() {
  const [image, setImage] = useState<string[]>([]);
  const [prompt, setPrompt] = useState<string>("");

  const fetchApi = async (e) => {
    e.preventDefault();
    console.log(prompt);
    try {
      const response = await fetch("http://localhost:5000/api/getImage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Request payload
          key: "eDQEK5xVfrT2FdUl8HEwVS6X2MuhB3VASGzsgbnPlmNM6wvb5aJK7WwZxxet",
          prompt: prompt,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch image");
      }

      const data = await response.json();
      console.log(data);
      setImage(data.output);
    } catch (error) {
      console.error(error);
    }
  };

  const saveNFT = async () => {
    try {
      // Store image to IPFS(piniata)
      await fetch("http://localhost:5000/api/saveImg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Request payload
          imgURL: image[0],
        }),
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Image image={image[0]} />
      <form onSubmit={fetchApi}>
        <input
          type="text"
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button type="submit">Generate</button>
      </form>
      <button onClick={saveNFT}>Save NFT</button>
    </>
  );
}
