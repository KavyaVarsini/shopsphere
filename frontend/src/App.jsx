import { useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("token"));

  return isAuth ? (
    <Dashboard />
  ) : (
    <Login onLogin={() => setIsAuth(true)} />
  );
}

export default App;
