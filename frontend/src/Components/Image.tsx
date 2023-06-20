export default function Image(props: { image: string }) {
  return (
    <div className=" bg-neutral-600 w-full h-full">
      <div className=" image">
        <img src={props.image} alt="" />
      </div>
    </div>
  );
}
