// import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import GenerateNFT from "./Pages/GenerateNFT";
import ShowMyNFTs from "./Pages/ShowMyNFTs";
import { NFTprovider } from "./Components/context/NFTcontext";

const App: React.FC = () => {
  return (
    <NFTprovider>
      <Router>
        <Routes>
          <Route path="generateNFT" element={<GenerateNFT />} />
          <Route path="showNFT" element={<ShowMyNFTs />} />
        </Routes>
      </Router>
    </NFTprovider>
  );
};

export default App;
