import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./components/Login/LoginForm";
import DrawerAppBar from "./components/AppBar/AppBar";

function App() {
  const predefinedCredentials = [
    { username: "drupad", password: "123" },
    { username: "chandhan", password: "321" },
  ];

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState("");

  const handleLogin = (username, password) => {
    const isValidUser = predefinedCredentials.some(
      (cred) => cred.username === username && cred.password === password
    );
    if (isValidUser) {
      setIsLoggedIn(true);
      setCurrentUser(username);
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
          element={
            isLoggedIn ? (
              <DrawerAppBar currentUser={currentUser} >
                {/* <HomePage currentUser={currentUser} /> */}
              </DrawerAppBar>
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
