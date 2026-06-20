import { API_URL } from "./api";

export function feedSocketUrl() {
  return API_URL.replace(/^http/, "ws") + "/ws/feed";
}
