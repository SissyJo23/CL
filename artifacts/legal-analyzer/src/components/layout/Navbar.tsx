import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/auth";

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [health, setHealth] = useState<boolean>(false);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch("/api/health", { credentials: "include" });
        setHealth(res.ok);
      } catch {
        setHealth(false);
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-brand">CaseLight</div>
      <div className="navbar-status">
        {health ? (
          <span className="status-ok">● API OK</span>
        ) : (
          <span className="status-error">● API Down</span>
        )}
      </div>
      <button
        onClick={() => {
          logout();
          navigate("/login");
        }}
      >
        Logout
      </button>
    </nav>
  );
}
