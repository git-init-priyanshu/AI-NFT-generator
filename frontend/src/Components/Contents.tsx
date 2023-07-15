import React, { useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { Toaster, toast } from "react-hot-toast";

import GET_IMAGE_QUERY from "../Queries/getImage";
import Image from "./Image";
import SaveNFT from "./SaveNFT";
// import { toast } from "react-hot-toast/headless";

export default function InputPrompt() {
  const [image, setImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>("");

  const [getData, { loading, data, error }] = useLazyQuery(GET_IMAGE_QUERY);

  const fetchApi = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    const APIkey = sessionStorage.getItem("api-key");
    try {
      toast.promise(
        getData({
          variables: {
            key: APIkey,
            prompt: prompt,
          },
        }),
        {
          loading: "Generating Image...",
          success: <b>Success</b>,
          error: <b>Failed</b>,
        }
      );
    } catch (error) {
      console.error(error);
    }
  };
  if (data) {
    if (
      data.getImage.status === "success" &&
      image !== data.getImage.output[0]
    ) {
      console.log(data.getImage.status);
      setImage(data.getImage.output[0]);
    } else if (data.getImage.status === "processing") {
      console.log(data.getImage.status);
      toast.error(data.getImage.message);
    } else if (data.getImage.status === "error") {
      console.log(data.getImage.status);
      toast.error(data.getImage.message);
    }
  }

  return (
    <div className=" flex w-full">
      <div>
        <Toaster position="bottom-right" reverseOrder={false} />
      </div>
      <div className=" w-1/2 h-calc">
        <Image image={image} />

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
