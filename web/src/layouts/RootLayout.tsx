import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";

export function RootLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "32px 40px", maxWidth: 1280 }}>
        <Outlet />
      </main>
    </div>
  );
}
