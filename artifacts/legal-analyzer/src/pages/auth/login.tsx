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
