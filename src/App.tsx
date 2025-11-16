import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import ForgotPassword from "./pages/ForgotPassword";

function App() {
  return (
    <Router>
      <Toaster position="top-right" />

      <Routes>
        <Route path="/forgotpassword" element={<ForgotPassword />} />

        <Route path="/" element={<div>Home Page</div>} />
      </Routes>
    </Router>
  );
}

export default App;
