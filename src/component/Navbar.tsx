import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  // Logout: cukup hapus currentUser
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  return (
    <nav className="w-full bg-zinc-950 border-b border-zinc-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      {/* Logo → Home */}
      <button
        onClick={() => navigate("/home")}
        className="text-xl font-bold tracking-[0.3em] cursor-pointer"
      >
        TAXAVA
      </button>

      {/* Menu kanan */}
      <div className="flex items-center gap-4 text-zinc-300">
        <button
          onClick={() => navigate("/home")}
          className="px-4 py-2 rounded-full border border-zinc-700 text-sm font-semibold hover:bg-zinc-800 transition"
        >
          Home
        </button>

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

export default Navbar;
