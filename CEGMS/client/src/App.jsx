import Dashboard from "./components/Dashboard/Dashboard.jsx";
import Profile from "./components/Profile/Profile.jsx";
import Sales from "./components/Sales/Sales.jsx";
import Purchase from "./components/Purchase/Purchase.jsx";
import Storage from "./components/Storage/Storage.jsx";
import Settings from "./components/Settings/Settings.jsx";
import "./../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login.jsx";
//import Password from "./components/Password/Profile.jsx";
//import Email from "./components/Email/Profile.jsx";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/" element={<Login />} />
        <Route path="/Profile" element={<Profile />} />

        <Route path="/Purchase" element={<Purchase />} />
        <Route path="/Sales" element={<Sales />} />
        <Route path="/Settings" element={<Settings />} />
        <Route path="/Storage" element={<Storage />} />
      </Routes>
    </Router>
  );
}

export default App;
