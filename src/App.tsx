import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import LoginPageEmail from "./pages/LoginPageEmail";
import LoginPageUsername from "./pages/LoginPageUsername";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  return (
    <Router>
      <Toaster position="top-right" />

      <Routes>
        <Route path="/" element={<div>Home Page</div>} />

        <Route path="/login-email" element={<LoginPageEmail />} />
        <Route path="/login-username" element={<LoginPageUsername />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
