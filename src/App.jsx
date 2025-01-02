import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./components/Login/LoginForm";
import HomePage from "./components/Home/HomePage";

function App() {
  const predefinedCredentials = [
    { username: "drupad", password: "123" },
    { username: "chandhan", password: "user@321#" },
  ];

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState("");

  const handleLogin = (username, password) => {
    const isValidUser = predefinedCredentials.some(
      (cred) => cred.username === username && cred.password === password
    );
    setCurrentUser(username)
    if (isValidUser) {
      setIsLoggedIn(true);
    } else {
      alert("Invalid username or password");
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
        <Route
          path="/home"
          element={isLoggedIn ? <HomePage currentUser={currentUser}/> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
