import { createContext, useState, useEffect } from "react";

interface ContextType {
  URIArr: string[];
}
interface ProviderProps extends React.PropsWithChildren<{}> {}

export const NFTcontext = createContext<ContextType | null>(null);

export const NFTprovider: React.FC<ProviderProps> = (props) => {
  const [URIArr, setURIArr] = useState<string[]>([
    "https://gateway.pinata.cloud/ipfs/QmUF88MQpgZPkqPMsZLu4TptmrNCJ3uBEij1PKQ4afeiHd",
    "https://gateway.pinata.cloud/ipfs/QmZFfqo3P61aoyooLUoLJqqPfEUoG9MgxdrJAbXeDRQurW",
    "https://gateway.pinata.cloud/ipfs/QmVdaSQ6rrPsn2aELog2ZpVFcQcFSc54SSRgssiRfEAZ5U",
    "https://gateway.pinata.cloud/ipfs/QmQEHvAMxU5PMAGtUmrQpnpvTNrT8EQDdV1kEzg4iGfkZi",
    "https://gateway.pinata.cloud/ipfs/QmYHmmyS8AHn2qhpSPDB22LiRC9DgK51Reoxkh1sg3VHnc",
  ]);

  // useEffect(() => {
  //   const fetchArr = async () => {
  //     const response = await fetch("http://localhost:5000/api/getURI", {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     const data = await response.json();
  //     setURIArr(data);
  //   };
  //   fetchArr();
  // }, []);

  return (
    <NFTcontext.Provider value={{ URIArr }}>
      {props.children}
    </NFTcontext.Provider>
  );
};
