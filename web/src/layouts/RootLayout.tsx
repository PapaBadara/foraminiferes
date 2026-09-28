import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { FilterFab } from "../components/FilterFab";

export function RootLayout() {
  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />
      <main style={{ padding: "32px 40px", maxWidth: 1280, margin: "0 auto" }}>
        <Outlet />
      </main>
      <FilterFab />
    </div>
  );
}
