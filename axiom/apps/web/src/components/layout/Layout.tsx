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
      <div className="min-h-screen bg-surface text-ink dark:bg-slate-950 dark:text-slate-100">
        <Sidebar />
        <main className="min-h-screen pl-64">
          <Header />
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
