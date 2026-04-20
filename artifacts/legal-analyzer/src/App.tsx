function AppRouter() {
  const [, setLocation] = useLocation();

  // TEMPORARY: Force show login page until backend login works
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />

      {/* Force root and all other paths to show login for now */}
      <Route path="/" component={Login} />
      <Route path="/cases" component={Login} />
      <Route path="/cases/new" component={Login} />
      <Route path="/cases/:id" component={Login} />
      <Route path="/cases/:id/pattern" component={Login} />
      <Route path="/cases/:id/relief" component={Login} />
      <Route path="/cases/:caseId/documents/:id" component={Login} />
      <Route path="/cases/:caseId/documents/:id/nomerit" component={Login} />
      <Route path="/cases/:id/court/new" component={Login} />
      <Route path="/cases/:caseId/court/:id/run" component={Login} />
      <Route path="/cases/:caseId/court/:id" component={Login} />
      <Route path="/cases/:caseId/motions" component={Login} />
      <Route path="/cases/:caseId/motions/:id" component={Login} />
      <Route path="/about" component={Login} />

      <Route component={NotFound} />
    </Switch>
  );
}
