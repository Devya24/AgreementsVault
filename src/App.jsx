import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./components/Login/LoginForm";
import DrawerAppBar from "./components/AppBar/AppBar";
import HomePage from "./components/Home/HomePage";
import ExcelDocs from "./components/ExcelDocs/ExcelDocs";

function App() {
  const predefinedCredentials = [
    { username: "drupad", password: "123" },
    { username: "chandhan", password: "321" },
  ];

  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  const handleLogin = (username, password) => {
    const isValidUser = predefinedCredentials.some(
      (cred) => cred.username === username && cred.password === password
    );
    if (isValidUser) {
      setIsLoggedIn(true);
      localStorage.setItem("isLoggedIn", "true");
    } else {
      alert("Invalid username or password");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
  };

  return (
    <Router>
      <Routes>
        <Route element={isLoggedIn ? <DrawerAppBar onLogout={handleLogout} /> : <Navigate to="/" />}>
          {/* All these routes will be visible under DrawerAppBar */}
          <Route path="/home" element={<HomePage />} />
          <Route path="/exceldocs" element={<ExcelDocs />} />
        </Route>

        {/* Login route */}
        <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
      </Routes>
    </Router>
  );
}

export default App;
