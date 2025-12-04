import React from "react";
import { useNavigate } from "react-router-dom";

const NavbarHome: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  return (
    <nav className="w-full bg-zinc-950 border-b border-zinc-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <div
        className="text-xl font-bold tracking-[0.2em] cursor-pointer"
        onClick={() => navigate("/home")}
      >
        TAXAVA
      </div>

      <div className="flex items-center gap-6 text-zinc-300">
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded bg-red-600 hover:bg-red-400 text-sm font-semibold shadow-md transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default NavbarHome;
