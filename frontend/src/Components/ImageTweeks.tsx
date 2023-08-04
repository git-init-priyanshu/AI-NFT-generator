import { useState } from "react";

const ImageTweeks = () => {
  const [height, setHeight] = useState<number>(512);
  const [width, setWidth] = useState<number>(512);
  const [samples, setSamples] = useState<number>(1);
  // const [isToggled, setIsToggled] = useState<boolean>(false);

  return (
    <>
      <div className="flex flex-col mb-5 ml-2">
        {/* Height */}
        <div className="flex gap-5">
          <label htmlFor="">Set Height</label>
          {height}
        </div>
        <input
          type="range"
          min="512"
          max="1024"
          value={height}
          onChange={(e) => setHeight(Number(e.target.value))}
          className=" mb-4"
        />
        {/* Width */}
        <div className="flex gap-5">
          <label htmlFor="">Set Width</label>
          {width}
        </div>
        <input
          type="range"
          min="512"
          max="1024"
          value={width}
          onChange={(e) => setWidth(Number(e.target.value))}
          className=" mb-4"
        />
        {/* Samples */}
        <div className="flex gap-5">
          <label htmlFor="">Set Samples</label>
          {samples}
        </div>
        <input
          type="range"
          min="1"
          max="4"
          value={samples}
          onChange={(e) => setSamples(Number(e.target.value))}
          className=" mb-4"
        />
        {/* NSFW */}
        <div className="flex gap-5">
          <label htmlFor="">Allow NSFW content</label>
        </div>
      </div>
    </>
  );
};

export default ImageTweeks;
