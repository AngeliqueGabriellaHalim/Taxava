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
    <div className="min-h-screen bg-linear-to-r/hsl from-[#191A1F] from-5% to-[#06012F] text-white flex flex-col">
      <Navbar />
      <div className="bg-linear-to-r from-indigo-600 to-[#7C3AED] bg-[#7C3AED] rounded-r-full w-[40%] h-16 absolute top-[77%] "></div>
      <main className="flex flex-1 items-center justify-between">
        <div className="flex w-20%  px-[15vh]">
          <p className="text-6xl font-light">
            Welcome, <br />
            <span className="text-[20vh] font-medium">
              {currentUser.username}!
            </span>
          </p>
        </div>
        <div className="flex flex-row  md:flex-row pl-[17vh] gap-[15vh] pr-[20vh] box-border">
          {/* COMPANY CARD */}
          <div className="w-2xs h-3xl rounded-3xl gap-12  bg-[#2a2c30]/80  flex flex-col items-center justify-evenly py-10 shadow-md shadow-gray-700">
            {/* filled jika ada company, outline jika belum */}
            {hasCompany ? (
              <div className="w-8 h-8 rounded-full bg-linear-to-r from-indigo-600 to-[#7C3AED] bg-[#7C3AED] " />
            ) : (
              <div className="w-10 h-10 rounded-full border-4 border-[#7C3AED]" />
            )}

            <div className="text-center">
              <p className="text-4xl font-semibold leading-tight">
                Company <br /> Set Up
              </p>
            </div>

            <button
              type="button"
              onClick={handleCompanyAction}
              className="px-10 py-2 rounded-full bg-linear-to-r from-indigo-600 to-[#7C3AED] bg-[#7C3AED] text-md font-semibold hover:opacity-80 active:translate-y-px transition cursor-pointer"
            >
              {hasCompany ? "View" : "Add Company"}
            </button>
          </div>

          {/* PROPERTY CARD */}
          <div className="w-2xs h-3xl rounded-3xl gap-12 bg-[#2a2c30]/80 flex flex-col items-center justify-evenly py-10 shadow-md shadow-gray-700">
            {/* filled jika ada property, outline jika belum */}
            {hasProperty ? (
              <div className="w-8 h-8 rounded-full bg-linear-to-r from-indigo-600 to-[#7C3AED] bg-[#7C3AED]" />
            ) : (
              <div className="w-10 h-10 rounded-full border-4 border-[#7C3AED]" />
            )}

            <div className="text-center">
              <p className="text-4xl font-semibold leading-tight">
                Property
                <br /> Set Up
              </p>
            </div>

            <button
              type="button"
              onClick={handlePropertyAction}
              className="px-10 py-2 rounded-full bg-linear-to-r from-indigo-600 to-[#7C3AED] bg-[#7C3AED] text-md font-semibold hover:opacity-80 cursor-pointer active:translate-y-px transition"
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
