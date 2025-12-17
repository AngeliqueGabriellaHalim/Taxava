// src/pages/Home.tsx
import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Navbar from "../component/Navbar";
import { getPropertiesByUser } from "../utils/getProperty";
import { getCompaniesByUser } from "../utils/getCompany";

type User = {
  id: number;
  email: string;
  username: string;
  password: string;
};
const Home: React.FC = () => {
  const navigate = useNavigate();
  // ambil user yang sedang login dari localStorage
  const currentUser: User | null = (() => {
    try {
      const raw = localStorage.getItem("currentUser");
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  })();
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const userCompanies = getCompaniesByUser(currentUser.id);
  const userProperties = getPropertiesByUser(currentUser.id);
  const hasCompany = userCompanies.length > 0;
  const hasProperty = userProperties.length > 0;

  const handleCompanyAction = () => {
    if (hasCompany) {
      navigate("/manage-companies");
    } else {
      navigate("/company-setup");
    }
  };

  const handlePropertyAction = () => {
    if (hasProperty) {
      navigate("/manage-properties");
    } else {
      navigate("/property-setup");
    }
  };

  return (
    <div className="min-h-screen bg-[#191A1F] text-white flex flex-col">
      <Navbar />

      <main className="flex flex-1 items-center justify-center">
        <div className="flex flex-col md:flex-row gap-64">
          {/* COMPANY CARD */}
          <div className="w-72 h-80 rounded-3xl bg-[#33343A] flex flex-col items-center justify-between py-10 shadow-lg">
            {/* filled jika ada company, outline jika belum */}
            {hasCompany ? (
              <div className="w-4 h-4 rounded-full bg-[#7C3AED]" />
            ) : (
              <div className="w-5 h-5 rounded-full border-4 border-[#7C3AED]" />
            )}

            <div className="text-center">
              <p className="text-4xl font-semibold leading-tight">
                Company
                <br />
                Set Up
              </p>
            </div>

            <button
              type="button"
              onClick={handleCompanyAction}
              className="px-10 py-2 rounded-full bg-[#7C3AED] text-sm font-semibold hover:opacity-90 active:translate-y-px transition cursor-pointer"
            >
              {hasCompany ? "View" : "Add Company"}
            </button>
          </div>

          {/* PROPERTY CARD */}
          <div className="w-72 h-80 rounded-3xl bg-[#33343A] flex flex-col items-center justify-between py-10 shadow-lg">
            {/* filled jika ada property, outline jika belum */}
            {hasProperty ? (
              <div className="w-4 h-4 rounded-full bg-[#7C3AED]" />
            ) : (
              <div className="w-5 h-5 rounded-full border-4 border-[#7C3AED]" />
            )}

            <div className="text-center">
              <p className="text-4xl font-semibold leading-tight">
                Property
                <br />
                Set Up
              </p>
            </div>

            <button
              type="button"
              onClick={handlePropertyAction}
              className="px-10 py-2 rounded-full bg-[#7C3AED] text-sm font-semibold hover:opacity-90 active:translate-y-px transition"
            >
              {hasProperty ? "View" : "Add Property"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
