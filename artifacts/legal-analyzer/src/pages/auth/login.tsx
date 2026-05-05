import { useState } from "react";
import { useLocation } from "wouter";
import { setAuthTokenGetter } from "@workspace/api-client-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("https://caselight-api.onrender.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
  localStorage.setItem("authToken", data.token);
  localStorage.setItem("isLoggedIn", "true");

  setAuthTokenGetter(() => localStorage.getItem("authToken"));

  setLocation("/home");
} else {
  alert("Access Denied");
}
        // ✅ Store REAL backend JWT
        localStorage.setItem("authToken", data.access_token);
        localStorage.setItem("isLoggedIn", "true");

        setAuthTokenGetter(() => localStorage.getItem("authToken"));

        setLocation("/home");
      } else {
        alert("Access Denied");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("System connection error.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full mb-4 p-3 border rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mb-6 p-3 border rounded"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-black text-white p-3 rounded"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
