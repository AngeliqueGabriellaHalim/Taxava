import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../component/Navbar";

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  hasOnboarded: boolean;
}

const steps = [
  { title: "Company Setup" },
  { title: "Property Setup" },
  { title: "You're all set !" },
];

const Onboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  // --- Utility Functions for Local Storage ---
  const loadUsers = (): User[] => {
    const data = localStorage.getItem("users");
    return data ? JSON.parse(data) : [];
  };

  const saveUsers = (users: User[]) => {
    localStorage.setItem("users", JSON.stringify(users));
  };

  const updateCurrentUserOnboardStatus = () => {
    const currentUserStr = localStorage.getItem("currentUser");
    if (!currentUserStr) return;

    const currentUser: User = JSON.parse(currentUserStr);

    // 1. Perbarui user di local storage 'users'
    const localUsers = loadUsers();
    const updatedLocalUsers = localUsers.map((u) => {
      // Cari berdasarkan ID atau email
      if (u.id === currentUser.id && u.email === currentUser.email) {
        return { ...u, hasOnboarded: true };
      }
      return u;
    });
    saveUsers(updatedLocalUsers);

    // 2. Perbarui 'currentUser' di local storage
    const updatedCurrentUser = { ...currentUser, hasOnboarded: true };
    localStorage.setItem("currentUser", JSON.stringify(updatedCurrentUser));
  };
  // -------------------------------------------

  const handleStepClick = (index: number) => {
    if (index === currentStep) {
      // Jika ini adalah langkah terakhir
      if (index === steps.length - 1) {
        updateCurrentUserOnboardStatus();
        // Arahkan ke dashboard utama setelah selesai
        navigate("/home");
      } else {
        // Pindah ke langkah berikutnya
        setCurrentStep(index + 1);
      }
    }
  };

  const handleViewClick = (index: number) => {
    console.log("View clicked for step", index);
    // Tambahkan logika navigasi atau tampilan detail di sini jika diperlukan
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col">
      {/* Navbar */}
      <Navbar />
      <div className="min-h-screen bg-neutral-900 text-white px-6 py-10 relative">
        {/* skip atas kanan */}
        <Link
          to="/home"
          className="absolute top-6 right-8 text-sm underline text-neutral-300 hover:text-white transition"
        >
          I’d like to skip and <br /> go to main dashboard.
        </Link>

        {/* judul */}
        <div className="mt-20 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to your onboarding dashboard
          </h1>
          <p className="text-neutral-300 text-sm max-w-xl mx-auto">
            Let’s set up your company and properties to start managing your
            assets efficiently.
          </p>
        </div>

        {/* progress lingkaran */}
        <div className="flex items-center justify-center gap-20 mt-16 mb-10">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-10 h-10 rounded-full transition ${i <= currentStep ? "bg-violet-500" : "bg-neutral-700"
                }`}
            ></div>
          ))}
        </div>

        {/* cards */}
        <div className="flex justify-center gap-8 flex-wrap mt-6">
          {steps.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            const isFinal = index === 2; // card terakhir

            const buttonLabel = isFinal
              ? "Complete set up"
              : isCompleted
                ? "View"
                : "Get Started";

            const handleClick = () => {
              if (isActive) {
                handleStepClick(index);
              } else if (isCompleted) {
                handleViewClick(index);
              }
            };

            return (
              <div
                key={index}
                className="bg-neutral-800/80 w-64 h-48 rounded-xl p-6 flex flex-col items-center justify-between shadow-lg"
              >
                <h2 className="text-lg font-semibold text-center">
                  {step.title}
                </h2>

                <button
                  onClick={handleClick}
                  // Hanya aktifkan jika index <= currentStep
                  disabled={index > currentStep}
                  className={`w-full h-12 rounded-full text-sm font-semibold transition shadow-lg
                    ${isFinal
                      ? "bg-violet-500 hover:opacity-90"
                      : isActive
                        ? "bg-violet-600 hover:opacity-90"
                        : isCompleted
                          ? "bg-violet-500 hover:opacity-90"
                          : "bg-neutral-600"
                    }
                    ${index > currentStep
                      ? "opacity-40 cursor-not-allowed"
                      : "cursor-pointer"
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
