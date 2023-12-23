// import React from "react";
import Contents from "../Components/Contents";
import ConnectWallet from "../Components/ConnectWallet";
import { Container } from "@mui/material";

export default function GenerateNFT() {
  return (
    <>
      <ConnectWallet />
      <Container
        sx={{ width: "100%", display: "flex", justifyContent: "center" }}
      >
        <Contents />
      </Container>
    </>
  );
}
