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
    <header className="sticky top-0 z-10 border-b border-black/5 bg-white/70 px-6 py-4 backdrop-blur-xl dark:border-white/10 dark:bg-[#050608]/70 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-xl">
          <div className="inline-flex items-center rounded-full border border-black/5 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#494fdf] shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
            Realtime event
          </div>
          <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-ink dark:text-white">{lastEvent}</div>
          <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
            Spatial crash telemetry, ranked signals, and wallet-connected actions in a single control surface.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="inline-flex h-10 items-center rounded-full border border-black/10 bg-white px-4 text-sm font-medium text-ink shadow-sm transition-colors hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.08]"
            onClick={handleWalletConnect}
          >
            {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "Connect wallet"}
          </button>
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-ink shadow-sm transition-colors hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.08]"
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}
