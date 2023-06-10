export default function Image(props: { image: string }) {
  return (
    <div
      style={{ height: "512px", width: "512px", backgroundColor: "black" }}
      className=" shadow-red-700 rounded-lg"
    >
      <img src={props.image} alt="" />;
    </div>
  );
}
