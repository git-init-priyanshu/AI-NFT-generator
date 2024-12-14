import { useState, useEffect, useContext } from "react";
import detectEthereumProvider from "@metamask/detect-provider";

import { NFTcontext } from "@/NFTcontext";
import { formatBalance, formatChainAsNum } from "../contract/utils/util.tsx";

import metamask from "../assets/MetaMask_Fox.svg.png";
import icon from "../assets/draw_svg20210625-19886-xh0lc.svg.png";

export default function SaveNftToMetamask() {
  const { setAccount } = useContext(NFTcontext);

  const initialState = { accounts: ["none"], balance: "", chainId: "" };
  const [wallet, setWallet] = useState(initialState);
  const [isConnecting, setIsConnecting] = useState(false);

  // Connecting to metamask
  useEffect(() => {
    const refreshAccounts = (accounts: any) => {
      if (accounts.length > 0) {
        updateWallet(accounts);
      } else {
        // if length 0, user is disconnected
        setWallet(initialState);
      }
    };

    const refreshChain = (chainId: any) => {
      setWallet((wallet) => ({ ...wallet, chainId }));
    };

    const getProvider = async () => {
      const provider = await detectEthereumProvider({ silent: true });

      if (provider) {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        refreshAccounts(accounts);
        window.ethereum.on("accountsChanged", refreshAccounts);
        window.ethereum.on("chainChanged", refreshChain);
      }
    };

    getProvider();

    return () => {
      window.ethereum?.removeListener("accountsChanged", refreshAccounts);
      window.ethereum?.removeListener("chainChanged", refreshChain);
    };
  }, []);

  const updateWallet = async (accounts: any) => {
    const balance = formatBalance(
      await window.ethereum!.request({
        method: "eth_getBalance",
        params: [accounts[0], "latest"],
      })
    );
    const chainId = await window.ethereum!.request({
      method: "eth_chainId",
    });
    setWallet({ accounts, balance, chainId });
  };

  const connectWallet = async () => {
    setIsConnecting(true);
    await window.ethereum
      .request({
        method: "eth_requestAccounts",
        params: [],
      })
      .then((accounts: ["none"]) => {
        updateWallet(accounts);
        accounts && setAccount(accounts[0]);
      })
      .catch((err: unknown) => {
        console.log(err);
      });
    setIsConnecting(false);
  };

  const disableConnect = Boolean(wallet) && isConnecting;

  return (
    <Paper
      // variant="outlined"
      elevation={2}
      square
      sx={{
        // backgroundColor: "gray",
        paddingX: "1rem",
        position: "relative",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: "4rem",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <img src={icon} alt="" className=" h-12" />
        <Typography component="h1" sx={{ color: "black" }}>
          AI NFT Generator
        </Typography>
      </Box>

      {wallet.accounts.length > 0 && (
        <Chip
          sx={{ color: "white", padding: "0.5rem" }}
          label={
            wallet.accounts[0] !== "none" ? wallet.accounts[0] : "Account: none"
          }
          variant="filled"
          color="primary"
        />
      )}

      <Box sx={{ display: "flex", alignItems: "center" }}>
        {wallet.accounts[0] !== "none" ? (
          <Box sx={{ display: "flex" }}>
            <Box
              sx={{
                borderRadius: "0.375rem",
                display: "flex",
                padding: "0.5rem",
                alignItems: "center",
                borderRightWidth: "1px",
                borderTopRightRadius: "0px",
                borderBottomRightRadius: "0px",
              }}
            >
              {wallet.balance} MATIC
            </Box>
            <Box
              sx={{
                display: "flex",
                borderRightWidth: "1px",
                padding: "0.5rem",
                alignItems: "center",
              }}
              className="display"
            >
              ChainId: {formatChainAsNum(wallet.chainId)}
            </Box>

            <Box
              sx={{
                borderRadius: "0.375rem",
                display: "flex",
                padding: "0.5rem",
                alignItems: "center",
                borderRightWidth: "1px",
                borderTopRightRadius: "0px",
                borderBottomRightRadius: "0px",
                ":hover": {
                  cursor: "pointer",
                },
              }}
              // className="hover:cursor-pointer"
            >
              <Box className="circle"></Box>
            </Box>
          </Box>
        ) : (
          <Button
            variant="contained"
            disabled={disableConnect}
            onClick={connectWallet}
          >
            <img src={metamask} className=" w-8 mr-2" />
            Connect
          </Button>
        )}
      </Box>
    </Paper>
  );
}
