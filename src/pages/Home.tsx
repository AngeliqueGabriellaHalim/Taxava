import React, { useState } from "react";
import { Link } from "react-router-dom";
const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center px-6 relative">
      <p>
        <Link to={"/forgotPassword"}>forgotPassword</Link>
      </p>
      <br></br>
      <p>
        <Link to={"/onboardingdb"}>onboarding dashboard</Link>
      </p>
    </div>
  );
};

export default Home;
