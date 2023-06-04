// import React from "react";

export default function Image(props: { image: string }) {
  return (
    <div style={{ height: "512px", width: "512px", backgroundColor: "white" }}>
      <img src={props.image} alt="" />;
    </div>
  );
}
