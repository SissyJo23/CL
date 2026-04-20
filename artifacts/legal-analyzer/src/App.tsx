import { Route, Router as WouterRouter, Switch } from "wouter";
import Login from "@/pages/auth/login";
import Register from "@/pages/auth/register";

function App() {
  return (
    <WouterRouter>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/" component={Login} />
        <Route component={Login} />
      </Switch>
    </WouterRouter>
  );
}

export default App;
