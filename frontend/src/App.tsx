import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Outlet,
} from "react-router-dom";

import { NFTprovider } from "@/NFTcontext";

import "./App.css";
import GenerateNFT from "./Pages/GenerateNFT";
import { Toaster } from "./components/ui/toaster";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route index element={<GenerateNFT />} />
    </Route>
  )
);

const App = () => {
  return (
    <NFTprovider>
      <RouterProvider router={router} />
      <Toaster />
    </NFTprovider>
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
