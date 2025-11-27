import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import seedUsers from "../db/users.json";

type LoginMode = "email" | "username";

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [mode, setMode] = useState<LoginMode>("email");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loadUsers = (): User[] => {
    const data = localStorage.getItem("users");
    return data ? JSON.parse(data) : [];
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const localUsers = loadUsers();
    const allUsers: User[] = [...localUsers, ...seedUsers];

    const user = allUsers.find((u) => {
      if (mode === "email") {
        return (
          u.email.toLowerCase() === identifier.toLowerCase() &&
          u.password === password
        );
      } else {
        return (
          u.username.toLowerCase() === identifier.toLowerCase() &&
          u.password === password
        );
      }
    });

    if (!user) {
      toast.error("Invalid credentials. Please try again.");
      return;
    }

    toast.success(`Welcome back, ${user.username}!`);
    navigate("/onboardingdb");
  };

  const toggleMode = () => {
    setMode((prev) => (prev === "email" ? "username" : "email"));
    setIdentifier("");
  };

  const placeholderText =
    mode === "email" ? "Enter your email address" : "Enter your username";

  const toggleButtonText =
    mode === "email" ? "Log in with username" : "Log in with email";

  return (
    <div className="relative w-full h-screen flex items-center justify-start overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://awsimages.detik.net.id/community/media/visual/2019/02/20/403af26a-f60a-491e-a4df-87e6570802bb_169.jpeg?w=1200')",
        }}
      ></div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-violet-900/40 to-transparent"></div>

      {/* Noise layer */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>

      {/* Logo */}
      <div className="absolute top-6 right-8 text-xl tracking-[0.3em] font-semibold text-white">
        TAXAVA
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-[540px] max-w-[92%] p-14 text-white ml-24">
        <h1 className="text-4xl font-bold leading-tight mb-8">
          Log in <br />
          <span className="text-violet-400">to your account.</span>
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Identifier field (email/username) */}
          <input
            type={mode === "email" ? "email" : "text"}
            placeholder={placeholderText}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            className="w-full p-3 rounded-xl bg-white/20 placeholder-gray-300 text-white outline-none backdrop-blur-md"
          />

          {/* Password field */}
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 rounded-xl bg-white/20 placeholder-gray-300 text-white outline-none backdrop-blur-md"
          />

          {/* Forgot password */}
          <p className="text-sm">
            Forgot password?{" "}
            <Link
              to="/forgotPassword"
              className="text-indigo-400 underline cursor-pointer"
            >
              Click here
            </Link>
          </p>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={toggleMode}
              className="flex-1 h-12 rounded-full bg-neutral-700 text-sm font-semibold hover:bg-neutral-600 active:translate-y-[1px] transition cursor-pointer"
            >
              {toggleButtonText}
            </button>

            <button
              type="submit"
              className="flex-1 h-12 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 text-sm font-semibold shadow-lg hover:opacity-95 active:translate-y-[1px] transition cursor-pointer"
            >
              Log In
            </button>
          </div>

          {/* Create Account */}
          <div className="flex justify-center pt-4">
            <Link
              to="/createaccount"
              className="text-indigo-300 hover:underline"
            >
              I'm new to TAXAVA.
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
