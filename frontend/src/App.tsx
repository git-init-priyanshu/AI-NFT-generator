// import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import GenerateNFT from "./Pages/GenerateNFT";
import ShowMyNFTs from "./Pages/ShowMyNFTs";
import { NFTprovider } from "./Components/context/NFTcontext";
import StableDiffusionAPI from "./Pages/StableDiff_API";

const App = () => {
  return (
    <div className=" h-screen mx-10">
      <NFTprovider>
        <Router>
          <Routes>
            <Route path="/" element={<StableDiffusionAPI />} />
            <Route path="generateNFT" element={<GenerateNFT />} />
            <Route path="showMyNFTs" element={<ShowMyNFTs />} />
          </Routes>
        </Router>
      </NFTprovider>
    </div>
  );
};

export default App;
