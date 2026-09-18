import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DataProvider } from "./context/DataContext";
import { RootLayout } from "./layouts/RootLayout";
import { Home } from "./pages/Home";
import { MapPage } from "./pages/MapPage";
import { Analyses } from "./pages/Analyses";
import { Catalogue } from "./pages/Catalogue";

export function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<RootLayout />}>
            <Route index element={<Home />} />
            <Route path="carte" element={<MapPage />} />
            <Route path="analyses" element={<Analyses />} />
            <Route path="catalogue" element={<Catalogue />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DataProvider>
  );
}
