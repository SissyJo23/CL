import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // This sends your credentials to the 'Master Key' door on Render
      const response = await fetch("https://caselight-api.onrender.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // This is the 'Handshake' that unlocks the app
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user", JSON.stringify(data.user));
        setLocation("/home"); 
      } else {
        alert("Access Denied: Please use 'admin@caselight.com' and 'password123'");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("System connection error. Give it 60 seconds and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center", 
      height: "100vh",
      backgroundColor: "#f4f7f6",
      fontFamily: "sans-serif"
    }}>
      <div style={{ 
        padding: "40px", 
        backgroundColor: "white", 
        borderRadius: "12px", 
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        width: "350px"
      }}>
        <h2 style={{ textAlign: "center", color: "#1a202c", marginBottom: "24px" }}>CaseLight Access</h2>
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <input 
            type="email" 
            placeholder="Admin Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: "12px", borderRadius: "6px", border: "1px solid #cbd5e0", outline: "none" }}
            required
          />
          <input 
            type="password" 
            placeholder="Master Key (password123)" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: "12px", borderRadius: "6px", border: "1px solid #cbd5e0", outline: "none" }}
            required
          />
          <Button type="submit" disabled={isLoading} style={{ backgroundColor: "#2d3748", color: "white", padding: "12px", borderRadius: "6px" }}>
            {isLoading ? "Validating..." : "Unlock Dashboard"}
          </Button>
        </form>
      </div>
    </div>
  );
}
