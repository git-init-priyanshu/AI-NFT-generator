import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import AIimg from "../assets/965.AI processor.jpg";
import { NFTcontext } from "../Components/context/NFTcontext";

export default function StableDiffusionAPI() {
  const navigate = useNavigate();

  const { setAPIkey } = useContext(NFTcontext);

  const [text, setText] = useState<string>("");

  const handleOnSubmit = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    if (text !== "") {
      sessionStorage.setItem("api-key", text);
      setAPIkey(text);
      navigate("/generateNFT");
    }
  };

  return (
    <div className=" flex justify-center items-center h-screen sm: w-full lg:">
      <div className="sm: w-80 lg: w-1/2 ">
        <img src={AIimg} alt="" className="img-shadow w-96 m-auto mb-8" />

        <form
          onSubmit={handleOnSubmit}
          className=" flex sm: flex-col  lg:flex-row gap-2"
        >
          <input
            type="text"
            value={text}
            placeholder="Enter your Stable Diffusion API key here"
            className="gradient-outline rounded-md bg-neutral-700 bg-opacity-80 p-2 w-full"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setText(e.target.value);
            }}
          />
          <div className="outline_gradient"></div>
          <button
            type="submit"
            className="rounded-md bg-neutral-700 bg-opacity-80 p-2 hover:bg-neutral-800 hover:bg-opacity-75"
          >
            Submit
          </button>
        </form>
        <p className=" text-center my-2 text-gray-300">
          Get your Stable Diffusion's API key{" "}
          <a
            className=" text-blue-400"
            target="_blank"
            href="https://stablediffusionapi.com/settings/api"
          >
            {" "}
            here
          </a>
        </p>
      </div>
      {/* <button onClick={()=>navigate("/doc/123")}>dynamic routes</button> */}
    </div>
  );
}
