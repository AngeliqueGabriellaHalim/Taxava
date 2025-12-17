import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  // Logout dengan hapus currentuser dari localstorage
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };
  const handleHome = () => {
    const user = localStorage.getItem("currentUser");
    if (user) {
      const userObj = JSON.parse(user);
      if (userObj.hasOnboarded) {
        navigate("/home");
      } else {
        navigate("/onboardingdb");
      }
    }
  };

  return (
    <nav className="w-full bg-zinc-950 border-b-2 border-zinc-900  px-6 py-4 flex items-center justify-between sticky top-0 z-50 h-[12vh]">
      {/* Logo navigate ke Home */}
      <button
        onClick={handleHome}
        className="text-xl font-bold tracking-[0.3em] cursor-pointer"
      >
        TAXAVA
      </button>

      {/* Menu kanan */}
      <div className="flex items-center gap-4 text-zinc-300">
        <button
          onClick={handleHome}
          className="px-4 py-2 rounded-full border hover:bg-linear-to-r hover:opacity-90
 hover:from-indigo-600 hover:to-[#7C3AED] border-zinc-700 text-sm font-semibold  transition cursor-pointer"
        >
          Home
        </button>

        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded cursor-pointer bg-red-600 hover:bg-red-400 text-sm font-semibold shadow-md transition"
        >
          Log out
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
