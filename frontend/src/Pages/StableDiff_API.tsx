import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import AIimg from "../assets/965.AI processor.jpg";
import { NFTcontext } from "../Components/context/NFTcontext";

export default function StableDiffusionAPI() {
  const navigate = useNavigate();

  const { setAPIkey } = useContext(NFTcontext);

  const [text, setText] = useState<string>("");

  const handleOnSubmit = () => {
    setAPIkey(text);
    navigate("/generateNFT");
  };

  return (
    <div className=" flex justify-center items-center h-screen">
      <div className=" w-1/2">
        <img src={AIimg} alt="" className=" w-96 m-auto mb-8" />

        <form onSubmit={handleOnSubmit} className="flex gap-2">
          <input
            type="text"
            value={text}
            placeholder="Enter your Stable Diffusion API key here"
            className="gradient-outline rounded-md bg-neutral-700 bg-opacity-80 p-2 w-full"
            onChange={(e) => {
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
      </div>
    </div>
  );
}
