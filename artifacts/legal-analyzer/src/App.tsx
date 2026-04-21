import { Route, Router as WouterRouter, Switch } from "wouter";
// Import your dashboard or main page here
import Dashboard from "@/pages/dashboard"; 

function App() {
  return (
    <WouterRouter>
      <Switch>
        {/* We are pointing the main paths to the Dashboard instead of Login */}
        <Route path="/" component={Dashboard} />
        <Route path="/login" component={Dashboard} />
        {/* This is the 'catch-all' that ensures you get in no matter what */}
        <Route component={Dashboard} />
      </Switch>
    </WouterRouter>
  );
}

export default App;
