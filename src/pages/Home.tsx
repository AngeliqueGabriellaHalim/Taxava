// src/pages/Home.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../component/Navbar";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleCompany = () => {
    navigate("/manage-companies");
  };

  const handleProperty = () => {
    navigate("/manage-properties");
  };
  return (
    <div className="min-h-screen bg-[#191A1F] text-white flex flex-col">
      <Navbar />

      <main className="flex flex-1 items-center justify-center">
        <div className="flex flex-col md:flex-row gap-50">
          <div className="w-72 h-80 rounded-3xl bg-[#33343A] flex flex-col items-center justify-between py-10 shadow-lg">
            <div className="w-4 h-4 rounded-full bg-[#7C3AED]" />

            <div className="text-center">
              <p className="text-4xl font-semibold leading-tight">
                Company
                <br />
                Set Up
              </p>
            </div>

            <button
              type="button"
              onClick={handleCompany}
              className="px-10 py-2 rounded-full bg-[#7C3AED] text-sm font-semibold hover:opacity-90 active:translate-y-[1px] transition cursor-pointer"
            >
              View
            </button>
          </div>

          <div className="w-72 h-80 rounded-3xl bg-[#33343A] flex flex-col items-center justify-between py-10 shadow-lg">
            <div className="w-5 h-5 rounded-full border-4 border-[#7C3AED]" />

            <div className="text-center">
              <p className="text-4xl font-semibold leading-tight">
                Property
                <br />
                Set Up
              </p>
            </div>

            <button
              type="button"
              onClick={handleProperty}
              className="px-10 py-2 rounded-full bg-[#7C3AED] text-sm font-semibold hover:opacity-90 active:translate-y-[1px] transition"
            >
              Add Property
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;

// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// const Home: React.FC = () => {
//   return (
//     <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center px-6 relative">
//       <ul className="list-disc pl-6 marker:text-white">
//         <li>
//           <Link to={"/forgotPassword"}>forgotPassword</Link>
//         </li>
//         <li>
//           <Link to={"/onboardingdb"}>onboarding dashboard</Link>
//         </li>
//         <li>
//           <Link to={"/createaccount"}>Register</Link>
//         </li>
//         <li>
//           <Link to={"/checkemail"}>CheckEmail</Link>
//         </li>
//         <li>
//           <Link to={"/login-email"}>LoginPageEmail</Link>
//         </li>
//         <li>
//           <Link to={"/login-username"}>LoginPageUsername</Link>
//         </li>
//       </ul>
//     </div>
//   );
// };

// export default Home;
