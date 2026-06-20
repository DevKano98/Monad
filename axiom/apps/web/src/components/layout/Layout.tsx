import { Outlet } from "react-router-dom";

import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { useSocket } from "../../hooks/useSocket";
import { useAppStore } from "../../stores/app.store";

export function Layout() {
  useSocket();
  const darkMode = useAppStore((state) => state.darkMode);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="relative min-h-screen overflow-hidden bg-canvas text-ink dark:bg-[#050608] dark:text-slate-100">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(73,79,223,0.12),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(0,168,126,0.08),_transparent_22%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(73,79,223,0.24),_transparent_28%),radial-gradient(circle_at_80%_12%,_rgba(230,30,73,0.12),_transparent_24%)]" />
        <Sidebar />
        <main className="relative min-h-screen pl-72">
          <Header />
          <div className="px-6 py-6 lg:px-8 lg:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
