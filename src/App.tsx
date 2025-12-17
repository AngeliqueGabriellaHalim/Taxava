import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage.tsx";
import ForgotPassword from "./pages/ForgotPassword";
import CreateAccount from "./pages/CreateAccount";
import CheckEmail from "./pages/CheckEmail";
import Onboarding from "./pages/Onboarding";
import Homepage from "./pages/Home";
import CompanySetup from "./pages/CompanySetup";
import PropertySetup from "./pages/PropertySetup";
import ManageCompanies from "./pages/ManageCompanies.tsx";
import ManageProperties from "./pages/ManageProperties.tsx";
import EditCompany from "./pages/EditCompany.tsx";
import EditProperty from "./pages/EditProperty.tsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/createaccount" element={<CreateAccount />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/checkemail" element={<CheckEmail />} />
        <Route path="/onboardingdb" element={<Onboarding />} />
        <Route path="/company-setup" element={<CompanySetup />} />
        <Route path="/property-setup" element={<PropertySetup />} />
        <Route path="/manage-companies" element={<ManageCompanies />} />
        <Route path="/manage-properties" element={<ManageProperties />} />
        <Route path="/edit-company/:id" element={<EditCompany />} />
        <Route path="/edit-property/:id" element={<EditProperty />} />

        <Route path="/home" element={<Homepage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <ToastContainer position="top-center" />
    </BrowserRouter>
  );
}
