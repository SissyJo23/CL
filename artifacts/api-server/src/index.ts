app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;

  // TEMP LOGIN — allows any credentials
  res.json({
    token: "dev-token",
    user: {
      email,
    },
  });
});
