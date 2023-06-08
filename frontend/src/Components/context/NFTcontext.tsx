import { createContext, useState, useEffect } from "react";

interface ContextType {
  URIArr: string[];
}
interface ProviderProps extends React.PropsWithChildren<{}> {}

export const NFTcontext = createContext<ContextType | null>(null);

export const NFTprovider: React.FC<ProviderProps> = (props) => {
  const [URIArr, setURIArr] = useState<string[]>([]);

  useEffect(() => {
    const fetchArr = async () => {
      const response = await fetch("http://localhost:5000/api/getURI", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setURIArr(data);
    };
    fetchArr();
  }, []);

  return (
    <NFTcontext.Provider value={{ URIArr }}>
      {props.children}
    </NFTcontext.Provider>
  );
};
