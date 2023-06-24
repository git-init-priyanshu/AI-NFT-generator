export default function Image(props: { image: string }) {
  return (
    <div className=" bg-neutral-600 w-full h-full flex items-center justify-center overflow-hidden">
      <div className=" image">
        <img src={props.image} alt="" className="" />
      </div>
    </div>
  );
}
