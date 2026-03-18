import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserSite from "./UserSite.jsx";
import AdminPanel from "./AdminPanel.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserSite />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}