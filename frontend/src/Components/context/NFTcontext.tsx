import { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

type state = {
  provider: any;
  signer: any;
  contract: object;
};

type data = {
  provider_url: string;
  private_key: string;
};

type ProviderProps = {
  children: ReactNode;
};

interface ContextType {
  URIArr: string[];
  state: state;
  setState: React.Dispatch<React.SetStateAction<state>>;
  account: string;
  setAccount: React.Dispatch<React.SetStateAction<string>>;
  data: data;
}

export const NFTcontext = createContext<ContextType | null>(null);

export const NFTprovider = ({ children }: ProviderProps) => {
  const [URIArr, setURIArr] = useState<string[]>([]);

  const [state, setState] = useState<state | null>(null);

  const [data, setData] = useState<data | null>(null);

  const [account, setAccount] = useState<string>("none");

  // Getting Quicknode HTTP provider URL and Metamask Private key from backend
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios("http://localhost:5000/api/getdata");
      const data: data = response.data;
      setData(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchArr = async () => {
      const response = await axios("http://localhost:5000/api/getURI");
      const data: string[] = response.data;

      setURIArr(data);
    };
    fetchArr();
  }, []);

  return (
    <NFTcontext.Provider
      value={{ URIArr, state, setState, account, setAccount, data }}
    >
      {children}
    </NFTcontext.Provider>
  );
};
