import { useState } from "react";
import { useLocation } from "wouter";
import { setToken, API_BASE } from "@/lib/api";

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function go() {
  try {
    // TEMPORARY BYPASS — skip real backend
    setToken("temp-debug-token-" + Date.now());
    setLocation("/cases");
  } catch (e) {
    setError("Login failed: " + String(e));
  }
}

  return (
    <div style={{padding:20}}>
      <h1>CaseLight</h1>
      <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" /><br/>
      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" /><br/>
      {error && <p>{error}</p>}
      <button onClick={go}>Sign In</button>
    </div>
  );
}
