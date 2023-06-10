import { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

type ProviderProps = {
  children: ReactNode;
};

interface ContextType {
  account: string;
  setAccount: React.Dispatch<React.SetStateAction<string>>;
}

export const NFTcontext = createContext<ContextType | null>(null);

export const NFTprovider = ({ children }: ProviderProps) => {
  const [account, setAccount] = useState<string>("none");

  return (
    <NFTcontext.Provider value={{ account, setAccount }}>
      {children}
    </NFTcontext.Provider>
  );
};
