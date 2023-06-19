export default function Image(props: { image: string }) {
  return (
    <div className=" w-1/2">
      <div className=" image">
        <img src={props.image} alt="" />
      </div>
    </div>
  );
}
