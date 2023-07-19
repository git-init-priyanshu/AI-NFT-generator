import React, { useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { Toaster, toast } from "react-hot-toast";

import GET_IMAGE_QUERY from "../Queries/getImage";
import Image from "./Image";
import SaveNFT from "./SaveNFT";
import ImageTweeks from "./ImageTweeks";

export default function InputPrompt() {
  const [imgState, setImgState] = useState<string | null>(null);
  console.log(imgState);
  const [prompt, setPrompt] = useState<string>("");

  const [getData, { data: imgData }] = useLazyQuery(GET_IMAGE_QUERY);

  const getImage = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    const APIkey = sessionStorage.getItem("api-key");

    toast
      .promise(
        getData({
          variables: {
            key: APIkey,
            prompt: prompt,
          },
        }),
        {
          loading: "Generating Image...",
          success: "Success",
          error: "Some Error occured",
          /**
           * have to write code to handel error in backend
           * So that react toast displays the information correctly
           */
        }
      )
      .catch((err) => console.log(err));
  };
  if (imgData) {
    setImgState(imgData.getImage.output[0]);
  }

  return (
    <div className=" flex w-full">
      <div>
        <Toaster position="bottom-right" reverseOrder={false} />
      </div>
      <div className=" w-1/2 h-calc">
        {imgData && imgData.getImage.status === "success" ? (
          <Image image={imgData.getImage.output[0]} />
        ) : (
          <Image image={null} />
        )}

        <form
          onSubmit={getImage}
          className=" h-16 mt-2 w-full flex items-start"
        >
          <input
            type="text"
            id="prompt"
            value={prompt}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPrompt(e.target.value)
            }
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
        <ImageTweeks />
        <SaveNFT image={imgState} />
      </div>
    </div>
  );
}
