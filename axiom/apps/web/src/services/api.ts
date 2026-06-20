const API_URL = normalizeApiUrl(import.meta.env.VITE_API_URL ?? "http://localhost:8000");

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}/v1${path}`, {
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    ...init
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || `Request failed with ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export { API_URL };

function normalizeApiUrl(url: string) {
  return url.replace(/\/+$/, "").replace(/\/v1$/, "");
}
