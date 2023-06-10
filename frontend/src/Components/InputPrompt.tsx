import { useState } from "react";
import Image from "./Image";
import SaveNFT from "./SaveNFT";
// import SaveNftToMetamask from "./SaveNftToMetamask";

export default function InputPrompt() {
  const [image, setImage] = useState<string[]>([]);
  const [prompt, setPrompt] = useState<string>("");

  const fetchApi = async (e) => {
    e.preventDefault();
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
      setImage(data.output);
    } catch (error) {
      console.error(error);
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
      <SaveNFT image={image} />
    </>
  );
}
