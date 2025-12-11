import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, Navigate, useLocation } from "react-router-dom";
import Navbar from "../component/Navbar";
import { getCompaniesByUser } from "../utils/getCompany";
import { getPropertiesByUser } from "../utils/getProperty";

// --- Interfaces ---

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  hasOnboarded: boolean;
}

// Interface Company dan Property tidak perlu didefinisikan lagi di sini 

const steps = [
  { title: "Company Setup", path: "/company-setup", type: "company" },
  { title: "Property Setup", path: "/property-setup", type: "property" },
  { title: "You're all set !" },
];


// --- Utility Functions for Local Storage & User ---

const loadUsers = (): User[] => {
  const data = localStorage.getItem("users");
  return data ? JSON.parse(data) : [];
};

const saveUsers = (users: User[]) => {
  localStorage.setItem("users", JSON.stringify(users));
};

const getCurrentUser = (): User | null => {
  const raw = localStorage.getItem("currentUser");
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// status
const checkSetupStatus = (userId: number): { hasCompany: boolean, hasProperty: boolean } => {
  // Memastikan Company ada (JSON + Local Storage)
  const companies = getCompaniesByUser(userId);
  const hasCompany = companies.length > 0;

  // cek properti milik user
  const properties = getPropertiesByUser(userId);
  const hasProperty = properties.length > 0;

  return {
    hasCompany,
    hasProperty,
  };
};
// -------------------------------------------

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation(); // <-- PENTING: Gunakan useLocation
  const currentUser = getCurrentUser();

  // State untuk menyimpan status setup
  const [setupStatus, setSetupStatus] = useState({ hasCompany: false, hasProperty: false });

  // ttate langkah saat ini
  const [currentStep, setCurrentStep] = useState(0);

  // --- handleer untuk direct jika belum login ---
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // periksa status Onboarding di luar useEffect untuk redirect segera
  if (currentUser.hasOnboarded) {
    return <Navigate to="/home" replace />;
  }

  //  memperbarui status setup dan currentStep
  const updateSetupAndStep = useCallback(() => {
    const status = checkSetupStatus(currentUser.id);
    setSetupStatus(status);

    // logika berurutan
    if (status.hasCompany && status.hasProperty) {
      setCurrentStep(2); // langkah 3: Selesai
    } else if (status.hasCompany) {
      setCurrentStep(1); // langkah 2: Property Setup
    } else {
      setCurrentStep(0); // langkah 1: Company Setup
    }
  }, [currentUser.id]); // Tambahkan currentUser.id sebagai dependency

  // --- efek untuk memuat status saat komponen dimuat dan saat navigasi kembali ---
  useEffect(() => {
    // 1. Panggil saat pertama kali dimuat atau saat location.key berubah (navigasi internal)
    updateSetupAndStep();

    // listener untuk refresh status saat tab browser kembali fokus
    window.addEventListener('focus', updateSetupAndStep);

    return () => {
      window.removeEventListener('focus', updateSetupAndStep);
    };
    // PENTING: Menambahkan location.key sebagai dependency. 
    // Saat navigasi terjadi dan komponen di-render ulang, location.key berubah, 
    // yang memicu pemanggilan updateSetupAndStep().
  }, [updateSetupAndStep, location.key]);


  const updateCurrentUserOnboardStatus = () => {
    //  jika status menunjukkan COMPLETE
    if (currentStep !== 2) {
      return;
    }

    // perbarui user di local storage 'users'
    const localUsers = loadUsers();
    const updatedLocalUsers = localUsers.map((u) => {
      if (u.id === currentUser.id) {
        return { ...u, hasOnboarded: true };
      }
      return u;
    });
    saveUsers(updatedLocalUsers);

    // update currentUser di local storage
    const updatedCurrentUser = { ...currentUser, hasOnboarded: true };
    localStorage.setItem("currentUser", JSON.stringify(updatedCurrentUser));

    // navigasi completed
    navigate("/home", { replace: true });
  };

  // ---  tombol Get Started/Complete Setup ---
  const handleStepAction = (index: number) => {
    const step = steps[index];

    if (index === 0) { // Company Setup
      if (!setupStatus.hasCompany) {
        navigate(step.path!); // Get Started
      } else {
        navigate("/manage-companies"); // View
      }
    } else if (index === 1) { // Property Setup
      // Tombol Get Started untuk Property hanya aktif jika Company sudah selesai (currentStep >= 1)
      if (currentStep >= 1 && !setupStatus.hasProperty) {
        navigate(step.path!); // Get Started
      } else if (setupStatus.hasProperty) {
        navigate("/manage-properties"); // View
      }
    } else if (index === 2) { // Complete Setup
      if (currentStep === 2) {
        updateCurrentUserOnboardStatus();
      }
    }
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
            const isCompleted = index < currentStep;
            const isActive = index === currentStep;
            const isFinal = index === 2;

            let buttonLabel = "Get Started";
            if (isFinal) {
              buttonLabel = "Complete set up";
            } else if (isCompleted) {
              buttonLabel = "View";
            }

            // step by step disabled:
            // langkah 1: Tidak disabled (selalu bisa Get Started atau View)
            // langkah 2: Disabled jika Company belum selesai (currentStep < 1)
            // langkah 3: Disabled jika Company/Property belum selesai (currentStep < 2)
            const isDisabled = (index === 1 && currentStep < 1) || (index === 2 && currentStep < 2);


            return (
              <div
                key={index}
                className="bg-neutral-800/80 w-64 h-48 rounded-xl p-6 flex flex-col items-center justify-between shadow-lg"
              >
                <h2 className="text-lg font-semibold text-center">
                  {step.title}
                </h2>
                {/* Tampilkan Status di Card */}
                <p className="text-xs text-zinc-400">
                  {index === 0 && (setupStatus.hasCompany ? "Status: Completed" : "Status: Pending")}
                  {index === 1 && (setupStatus.hasProperty ? "Status: Completed" : "Status: Pending")}
                  {index === 2 && (setupStatus.hasCompany && setupStatus.hasProperty ? "Ready to Finish" : "Pending Requirements")}
                </p>

                <button
                  onClick={() => handleStepAction(index)}
                  disabled={isDisabled}
                  className={`w-full h-12 rounded-full text-sm font-semibold transition shadow-lg
                    ${isDisabled
                      ? "bg-neutral-600 opacity-40 cursor-not-allowed"
                      : "bg-violet-500 hover:opacity-90 cursor-pointer"
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