import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LoginPageEmail from "./pages/LoginPageEmail";
import LoginPageUsername from "./pages/LoginPageUsername";
import ForgotPassword from "./pages/ForgotPassword";
import CreateAccount from "./pages/CreateAccount";
import CheckEmail from "./pages/CheckEmail";
import Onboarding from "./pages/Onboarding";
import Homepage from "./pages/Home";
import { ToastContainer } from "react-toastify";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login-email" element={<LoginPageEmail />} />
        <Route path="/login-username" element={<LoginPageUsername />} />
        <Route path="/createaccount" element={<CreateAccount />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/checkemail" element={<CheckEmail />} />
        <Route path="/onboardingdb" element={<Onboarding />} />
        <Route path="/" element={<Homepage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer position="top-center" />
    </BrowserRouter>
  );
}
