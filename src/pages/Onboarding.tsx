import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, Navigate, useLocation } from "react-router-dom";
import Navbar from "../component/Navbar";
import { getCompaniesByUser } from "../utils/getCompany";
import { getPropertiesByUser } from "../utils/getProperty";
import {
  getCurrentUser,
  loadAllUsers,
  saveUsersToLocal,
} from "../utils/getUser";

const steps = [
  { title: "Company Setup", path: "/company-setup" },
  { title: "Property Setup", path: "/property-setup" },
  { title: "You're all set !" },
];

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = getCurrentUser();

  const [setupStatus, setSetupStatus] = useState({
    hasCompany: false,
    hasProperty: false,
  });
  const [currentStep, setCurrentStep] = useState(0);

   const updateSetupAndStep = useCallback(() => {
    if (!currentUser) return;

    const companies = getCompaniesByUser(currentUser.id);
    const properties = getPropertiesByUser(currentUser.id);

    const status = {
      hasCompany: companies.length > 0,
      hasProperty: properties.length > 0,
    };

    setSetupStatus(status);

    if (status.hasCompany && status.hasProperty) {
      setCurrentStep(2);
    } else if (status.hasCompany) {
      setCurrentStep(1);
    } else {
      setCurrentStep(0);
    }
  }, [currentUser]);

  useEffect(() => {
    const handler = () => updateSetupAndStep();

    setTimeout(handler, 0); 
    window.addEventListener("focus", handler);

    return () => {
      window.removeEventListener("focus", handler);
    };
  }, [updateSetupAndStep, location.key]);


  // Redirect jika tidak login
  if (!currentUser) return <Navigate to="/login" replace />;

  // Redirect jika sudah onboarding
  if (currentUser.hasOnboarded) return <Navigate to="/home" replace />;

  const finalizeOnboarding = () => {
    const allUsers = loadAllUsers();
    const updatedUsers = allUsers.map((u) =>
      u.id === currentUser.id ? { ...u, hasOnboarded: true } : u
    );

    saveUsersToLocal(updatedUsers);
    localStorage.setItem(
      "currentUser",
      JSON.stringify({ ...currentUser, hasOnboarded: true })
    );

    navigate("/home", { replace: true });
  };

  const handleStepAction = (index: number) => {
    if (index === 0) {
      if (setupStatus.hasCompany) {
        navigate("/manage-companies");
      } else {
        navigate(steps[0].path!);
      }
      return;
    }

    if (index === 1) {
      if (setupStatus.hasProperty) {
        navigate("/manage-properties");
      } else {
        navigate(steps[1].path!);
      }
      return;
    }

    if (index === 2 && currentStep === 2) {
      finalizeOnboarding();
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col">
      <Navbar />
      <div className="min-h-screen bg-neutral-900 text-white px-6 py-10 relative">
        <p
          onClick={finalizeOnboarding}
          className="absolute top-6 right-8 text-sm underline text-neutral-300 hover:text-white transition cursor-pointer text-right"
        >
          I’d like to skip and <br /> go to main dashboard.
        </p>

        <div className="mt-20 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to your onboarding dashboard
          </h1>
          <p className="text-neutral-300 text-sm max-w-xl mx-auto">
            Let’s set up your company and properties to start managing your
            assets efficiently.
          </p>
        </div>

        <div className="flex items-center justify-center gap-20 mt-16 mb-10">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-10 h-10 rounded-full transition ${
                i <= currentStep
                  ? "bg-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.5)]"
                  : "bg-neutral-700"
              }`}
            ></div>
          ))}
        </div>

        <div className="flex justify-center gap-8 flex-wrap mt-6">
          {steps.map((step, index) => {
            const isDisabled =
              (index === 1 && currentStep < 1) ||
              (index === 2 && currentStep < 2);
            const buttonLabel =
              index === 2
                ? "Complete set up"
                : index < currentStep
                ? "View"
                : "Get Started";

            return (
              <div
                key={index}
                className="bg-neutral-800/80 w-64 h-48 rounded-xl p-6 flex flex-col items-center justify-between shadow-lg"
              >
                <h2 className="text-lg font-semibold text-center">
                  {step.title}
                </h2>
                <p className="text-xs text-zinc-400">
                  {index === 0 &&
                    (setupStatus.hasCompany
                      ? "Status: Completed"
                      : "Status: Pending")}
                  {index === 1 &&
                    (setupStatus.hasProperty
                      ? "Status: Completed"
                      : "Status: Pending")}
                  {index === 2 &&
                    (currentStep === 2
                      ? "Ready to Finish"
                      : "Pending Requirements")}
                </p>

                <button
                  onClick={() => handleStepAction(index)}
                  disabled={isDisabled}
                  className={`w-full h-12 rounded-full text-sm font-semibold transition shadow-lg ${
                    isDisabled
                      ? "bg-neutral-600 opacity-40 cursor-not-allowed"
                      : "bg-violet-500 hover:opacity-90 active:scale-95"
                  }`}
                >
                  {buttonLabel}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
