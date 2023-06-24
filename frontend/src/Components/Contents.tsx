import React, { useState } from "react";
import Image from "./Image";
import SaveNFT from "./SaveNFT";

export default function InputPrompt() {
  const [image, setImage] = useState<string[]>([]);
  const [prompt, setPrompt] = useState<string>("");

  const fetchApi = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    const APIkey = sessionStorage.getItem("api-key");
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
      <div className=" w-1/2 h-calc">
        <Image image={image[0]} />

        <form
          onSubmit={fetchApi}
          className=" h-16 mt-2 w-full flex items-start"
        >
          <input
            type="text"
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder=" Enter your prompt"
            className="outline-none rounded-md bg-neutral-700 bg-opacity-80 p-2 w-full"
          />
          <button
            type="submit"
            className="ml-2 rounded-md bg-neutral-700 bg-opacity-80 p-2 hover:bg-neutral-800 hover:bg-opacity-75"
          >
            Generate
          </button>
        </form>
      </div>
      <div className=" w-1/2 h-calc">
        <SaveNFT image={image} />
      </div>
    </div>
  );
}
