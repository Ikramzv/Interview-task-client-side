import React from "react";
import { useSelector } from "react-redux";
import Home from "./components/Home";
import Login from "./components/Login";

function App() {
  const user = useSelector((state) => state.user);
  return user ? <Home /> : <Login />;
}

export default App;
