import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./components/home";
import Login from "./components/login";
import AuthProvider from "./AuthProvider";
import { useEffect } from "react";
import { firestore } from "./firebase"
function App() {

  // useEffect(() => {

  // add in colletion
  // firestore.collection("user").add({ body: "this is value" });

  // }, [])

  return (
    <>
      <AuthProvider>
        <Router>
          <Switch>
            <Route exact path="/login">
              <Login />
            </Route>
            <Route exact path="/">
              <Home />
            </Route>
          </Switch>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
