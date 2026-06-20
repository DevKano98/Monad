declare global {
  interface Window {
    ethereum?: {
      request<T>(args: { method: string; params?: unknown[] }): Promise<T>;
    };
  }
}

export async function connectWallet(): Promise<string> {
  if (!window.ethereum) {
    throw new Error("No EIP-1193 wallet found");
  }
  const accounts = await window.ethereum.request<string[]>({ method: "eth_requestAccounts" });
  return accounts[0];
}
