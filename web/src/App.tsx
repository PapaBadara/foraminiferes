import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DataProvider } from "./context/DataContext";
import { RootLayout } from "./layouts/RootLayout";
import { Landing } from "./pages/Landing";
import { Home } from "./pages/Home";
import { MapPage } from "./pages/MapPage";
import { Analyses } from "./pages/Analyses";
import { Catalogue } from "./pages/Catalogue";
import { Bibliographie } from "./pages/Bibliographie";

export function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <Routes>
          <Route index element={<Landing />} />
          <Route element={<RootLayout />}>
            <Route path="accueil" element={<Home />} />
            <Route path="carte" element={<MapPage />} />
            <Route path="analyses" element={<Analyses />} />
            <Route path="catalogue" element={<Catalogue />} />
            <Route path="bibliographie" element={<Bibliographie />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DataProvider>
  );
}
