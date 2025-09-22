const DEFAULT_BACKEND_ORIGIN = "http://localhost:8000";

const rawEnv = [
  import.meta.env.VITE_API_URL,
  import.meta.env.VITE_API_BASE_URL,
  import.meta.env.VITE_API_BASE,
  import.meta.env.VITE_BACKEND_URL,
  import.meta.env.VITE_API_ORIGIN,
].find((v) => typeof v === "string" && v.trim().length > 0) || "";

/** Trim trailing slash */
const trimRightSlash = (s = "") => s.replace(/\/+$/, "");

/** If a value includes '/api' at the end, strip it to get the backend origin */
const normalizeEnvBackendOrigin = (value) => {
  if (!value) return value;
  let v = value.trim();

  // If they passed a full API base like 'https://x.y/api' normalize to origin only
  // so that our computed API_BASE_URL = `${BACKEND_ORIGIN}/api` doesn't become '/api/api'
  const m = v.match(/^(https?:\/\/[^]+?)\/api\/?$/i);
  if (m) return trimRightSlash(m[1]);

  return trimRightSlash(v);
};

export const BACKEND_ORIGIN =
  normalizeEnvBackendOrigin(rawEnv) || DEFAULT_BACKEND_ORIGIN;

export const API_BASE_URL = `${BACKEND_ORIGIN}/api`;
export const PUBLIC_API_BASE_URL = `${API_BASE_URL}/public`;

const isAbsoluteUrl = (value = "") => /^https?:\/\//i.test(value);

const replaceLocalhostOrigin = (url) => {
  if (url?.startsWith(DEFAULT_BACKEND_ORIGIN)) {
    return `${BACKEND_ORIGIN}${url.slice(DEFAULT_BACKEND_ORIGIN.length)}`;
  }
  return url;
};

export const resolveBackendUrl = (path = "") => {
  if (!path) return BACKEND_ORIGIN;

  if (isAbsoluteUrl(path)) return replaceLocalhostOrigin(path);

  if (path.startsWith("/")) return `${BACKEND_ORIGIN}${path}`;

  return `${BACKEND_ORIGIN}/${path}`;
};

export const resolveApiUrl = (path = "") => {
  if (!path) return API_BASE_URL;

  if (isAbsoluteUrl(path)) return replaceLocalhostOrigin(path);

  if (path.startsWith("/")) return `${API_BASE_URL}${path}`;

  return `${API_BASE_URL}/${path}`;
};

if (typeof window !== "undefined") {
  window.__CURCMS_BACKEND_ORIGIN__ = BACKEND_ORIGIN;
  window.__CURCMS_API_BASE_URL__ = API_BASE_URL;
}
