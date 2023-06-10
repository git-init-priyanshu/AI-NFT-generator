import { useContext } from "react";
import { NFTcontext } from "../Components/context/NFTcontext";

const ShowMyNFTs = () => {
  const { URIArr } = useContext(NFTcontext);
  return (
    <div>
      {URIArr.map((URI, index) => (
        <img key={index} src={URI} alt={`NFT ${index}`} />
      ))}
    </div>
  );
};

export default ShowMyNFTs;
