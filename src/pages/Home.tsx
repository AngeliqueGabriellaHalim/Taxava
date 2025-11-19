import React, { useState } from "react";
import { Link } from "react-router-dom";
const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center px-6 relative">
      <ul className="list-disc pl-6 marker:text-white">
        <li>
          <Link to={"/forgotPassword"}>forgotPassword</Link>
        </li>
        <li>
          <Link to={"/onboardingdb"}>onboarding dashboard</Link>
        </li>
        <li>
          <Link to={"/createaccount"}>Register</Link>
        </li>
        <li>
          <Link to={"/checkemail"}>CheckEmail</Link>
        </li>
      </ul>
    </div>
  );
};

export default Home;
