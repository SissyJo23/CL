import { Route, Router as WouterRouter, Switch } from "wouter";
import Login from "@/pages/auth/login";
import Home from "@/pages/home";

function App() {
  return (
    <WouterRouter>
      <Switch>
        {/* This sets the login page as the first thing people see */}
        <Route path="/login" component={Login} />
        <Route path="/" component={Login} />
        {/* This is where we will go once the login works */}
        <Route path="/home" component={Home} />
        {/* If a page doesn't exist, send them back to login */}
        <Route component={Login} />
      </Switch>
    </WouterRouter>
  );
}

export default App;
