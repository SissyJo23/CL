const API_BASE = "https://caselight-api.onrender.com";

export function getToken(): string | null {
  return localStorage.getItem("cl_token");
}

export function setToken(token: string): void {
  localStorage.setItem("cl_token", token);
}

export function clearToken(): void {
  localStorage.removeItem("cl_token");
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
