import { createContext, useState, ReactNode } from "react";

type ProviderProps = {
  children: ReactNode;
};

interface ContextType {
  account: string;
  setAccount: React.Dispatch<React.SetStateAction<string>>;
  APIkey: string;
  setAPIkey: React.Dispatch<React.SetStateAction<string>>;
}

export const NFTcontext = createContext<ContextType | null>(null);

export const NFTprovider = ({ children }: ProviderProps) => {
  const [account, setAccount] = useState<string>("none");

  const [APIkey, setAPIkey] = useState<string>("");

  return (
    <NFTcontext.Provider value={{ account, setAccount, APIkey, setAPIkey }}>
      {children}
    </NFTcontext.Provider>
  );
};
