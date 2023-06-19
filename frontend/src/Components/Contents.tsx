import { useState, useContext } from "react";
import Image from "./Image";
import SaveNFT from "./SaveNFT";
import { NFTcontext } from "./context/NFTcontext";

export default function InputPrompt() {
  const [image, setImage] = useState<string[]>([]);
  const [prompt, setPrompt] = useState<string>("");

  const { APIkey } = useContext(NFTcontext);

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
          key: APIkey,
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
    <div className=" flex w-full">
      <Image image={image[0]} />
      <div className=" w-1/2">
        <form onSubmit={fetchApi}>
          <input
            type="text"
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder=" Enter your prompt"
            className="outline-none rounded-md bg-neutral-700 bg-opacity-80 p-2 mx-2"
          />
          <button
            type="submit"
            className="mx-2 rounded-md bg-neutral-700 bg-opacity-80 p-2 hover:bg-neutral-800 hover:bg-opacity-75"
          >
            Generate
          </button>
        </form>
        <SaveNFT image={image} />
      </div>
    </div>
  );
}
