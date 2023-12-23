import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Outlet,
} from "react-router-dom";

import GenerateNFT from "./Pages/GenerateNFT";
import ShowMyNFTs from "./Pages/ShowMyNFTs";
import { NFTprovider } from "./Components/context/NFTcontext";
import StableDiffusionAPI from "./Pages/StableDiff_API";
import "./App.css";

// Defining router
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      {/* <Route index element={<StableDiffusionAPI />} /> */}
      <Route index element={<GenerateNFT />} />
      <Route path="/showMyNFTs" element={<ShowMyNFTs />} />
    </Route>
  )
);

const App = () => {
  // Defining Apollo Client
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: "https://ai-nft-generator-backend.onrender.com/graphql", //For Production
    // uri: "http://localhost:4000/graphql" //For development 
  });

  return (
      <ApolloProvider client={client}>
        <NFTprovider>
          <RouterProvider router={router} />
        </NFTprovider>
      </ApolloProvider>
  );
};

function Root() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default App;
