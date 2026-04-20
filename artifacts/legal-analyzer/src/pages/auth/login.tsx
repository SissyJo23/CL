import { useState } from "react";
import { useLocation } from "wouter";
import { setToken } from "@/lib/api";

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function go() {
    try {
      const url = "https://caselight-api.onrender.com/api/auth/login";
      const body = JSON.stringify({ email, password });
      const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body });
      const d = await r.json();
      if (!r.ok) { setError(d.error); return; }
      setToken(d.token);
      setLocation("/cases");
    } catch (e) {
      setError(String(e));
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
