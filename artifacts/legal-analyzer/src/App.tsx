import { Route, Router as WouterRouter, Switch } from "wouter";
import Login from "@/pages/auth/login";
import Home from "@/pages/home";

function App() {
  return (
    <WouterRouter>
      <Switch>
        {/* Home page */}
        <Route path="/" component={Home} />

        {/* Login page */}
        <Route path="/login" component={Login} />

        {/* Explicit home route */}
        <Route path="/home" component={Home} />

        {/* Fallback */}
        <Route component={Login} />
      </Switch>
    </WouterRouter>
  );
}

export default App;
