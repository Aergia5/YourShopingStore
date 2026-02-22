import { BASE_URL } from "../api/api";

export const PLACEHOLDER_IMAGE = "/images/placeholder.svg";

export const formatUrl = (url) => {
  if (!url) return null;
  if (Array.isArray(url)) url = url[0];
  if (typeof url === "object" && url !== null) {
    url = url.url || url.src || "";
  }
  url = String(url);
  if (!url) return null;

  if (url.startsWith("http")) return url;
  const base = BASE_URL.replace(/\/$/, "");
  const path = url.startsWith("/") ? url : "/" + url;
  try {
    return new URL(path, base + "/").href;
  } catch {
    return `${base}${path}`;
  }
};
