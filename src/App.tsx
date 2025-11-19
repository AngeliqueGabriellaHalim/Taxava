import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ForgotPassword from "./pages/ForgotPassword";
import Onboarding from "./pages/Onboarding";
import Homepage from "./pages/Home";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* halaman login */}
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/onboardingdb" element={<Onboarding />} />
        <Route path="/" element={<Homepage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer position="top-center" />
    </BrowserRouter>
  );
}
