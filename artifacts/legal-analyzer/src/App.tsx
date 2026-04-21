import { Route, Router as WouterRouter, Switch } from "wouter";
// We are changing 'Dashboard' to 'Home' because that is the file you actually have
import Home from "@/pages/home"; 

function App() {
  return (
    <WouterRouter>
      <Switch>
        {/* This forces the app to show the Home/Dashboard immediately */}
        <Route path="/" component={Home} />
        <Route path="/login" component={Home} />
        {/* Catch-all: If anything goes wrong, just show the Home page */}
        <Route component={Home} />
      </Switch>
    </WouterRouter>
  );
}

export default App;
