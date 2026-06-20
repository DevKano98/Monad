import { Moon, Sun } from "lucide-react";

import { connectWallet } from "../../services/wallet.service";
import { useAppStore } from "../../stores/app.store";

export function Header() {
  const darkMode = useAppStore((state) => state.darkMode);
  const toggleDarkMode = useAppStore((state) => state.toggleDarkMode);
  const lastEvent = useAppStore((state) => state.lastEvent);
  const walletAddress = useAppStore((state) => state.walletAddress);
  const setWalletAddress = useAppStore((state) => state.setWalletAddress);

  async function handleWalletConnect() {
    const address = await connectWallet();
    setWalletAddress(address);
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 dark:border-slate-800 dark:bg-slate-900">
      <div>
        <div className="text-sm text-slate-500">Realtime event</div>
        <div className="font-medium">{lastEvent}</div>
      </div>
      <div className="flex items-center gap-2">
        <button
          className="h-9 rounded-md border border-slate-300 px-3 text-sm dark:border-slate-700"
          onClick={handleWalletConnect}
        >
          {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "Connect wallet"}
        </button>
        <button
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-300 dark:border-slate-700"
          onClick={toggleDarkMode}
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}
