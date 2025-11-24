import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage.tsx";
import ForgotPassword from "./pages/ForgotPassword";
import CreateAccount from "./pages/CreateAccount";
import CheckEmail from "./pages/CheckEmail";
import Onboarding from "./pages/Onboarding";
import Homepage from "./pages/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import MainLayout from "./component/MainLayout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/createaccount" element={<CreateAccount />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/checkemail" element={<CheckEmail />} />
        {/* Di bawah ini buat pages yang pengen paling atas nya ada navbar*/}
        {/* <Route path="/" element={<MainLayout />}>
          <Route path="/onboardingdb" element={<Onboarding />} />
          <Route path="/" element={<Homepage />} />
        </Route> */}
        <Route path="/onboardingdb" element={<Onboarding />} />
        <Route path="/" element={<Homepage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <ToastContainer position="top-center" />
    </BrowserRouter>
  );
}
