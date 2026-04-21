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
      // This sends your email/password to the 'Master Key' door we just built
      const response = await fetch("https://caselight-api.onrender.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // This is the 'Handshake' that lets you in
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user", JSON.stringify(data.user));
        setLocation("/home"); 
      } else {
        alert("Invalid credentials. Try your admin email and password123.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("System connection error. Please try again in 1 minute.");
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
        borderRadius: "8px", 
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        width: "320px"
      }}>
        <h2 style={{ textAlign: "center", color: "#2c3e50" }}>CaseLight Login</h2>
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <input 
            type="email" 
            placeholder="Admin Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ddd" }}
            required
          />
          <input 
            type="password" 
            placeholder="password123" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ddd" }}
            required
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Unlocking..." : "Enter CaseLight"}
          </Button>
        </form>
      </div>
    </div>
  );
}
