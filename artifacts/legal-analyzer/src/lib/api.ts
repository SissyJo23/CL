export const API_BASE =
  import.meta.env.VITE_API_URL ?? "https://caselight-api.onrender.com";

export function getToken(): string | null {
  return localStorage.getItem("cl_token") || localStorage.getItem("authToken");
}

export function isDemoSession(): boolean {
  return getToken() === "demo-session";
}

export function isValidSession(): boolean {
  const token = getToken();
  return token === "demo-session" || Boolean(token && token.split(".").length === 2);
}

export function setToken(token: string): void {
  localStorage.setItem("cl_token", token);
  localStorage.setItem("authToken", token);
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("cl_mode");
}

export function clearToken(): void {
  localStorage.removeItem("cl_token");
  localStorage.removeItem("authToken");
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("cl_mode");
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> ?? {}),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return fetch(`${API_BASE}${path}`, { ...options, headers });
}
