import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import seedUsers from "../db/users.json";
import { Baseline, Mail, Lock, User } from "lucide-react";

type LoginMode = "email" | "username";

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  hasOnboarded: boolean;
}

const LoginPage: React.FC = () => {
  const [mode, setMode] = useState<LoginMode>("email");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("currentUser");

    if (user) {
      const userObj = JSON.parse(user);
      if (userObj.hasOnboarded) {
        navigate("/home");
      } else {
        navigate("/onboardingdb");
      }
    }
  }, []);

  const loadUsers = (): User[] => {
    const data = localStorage.getItem("users");
    // pastikan data dari localStorage memiliki properti hasOnboarded
    return data ? JSON.parse(data) : [];
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const localUsers = loadUsers();

    // gabungkan user local dan seed users
    // nilai default hasOnboarded: false
    const allUsers: User[] = [
      ...localUsers,
      ...(seedUsers as User[]).map((u) => ({
        ...u,
        hasOnboarded: u.hasOnboarded ?? false,
      })),
    ];

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

    localStorage.setItem("currentUser", JSON.stringify(user));

    toast.success(`Welcome back, ${user.username}!`);

    if (user.hasOnboarded) {
      navigate("/home"); // sudah onboarding, langsung ke home
    } else {
      navigate("/onboardingdb"); // belum onboarding, ke halaman onboarding
    }
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
        className="absolute inset-0 bg-cover bg-center brightness-75"
        style={{
          backgroundImage:
            "url('https://awsimages.detik.net.id/community/media/visual/2019/02/20/403af26a-f60a-491e-a4df-87e6570802bb_169.jpeg?w=1200')",
        }}
      ></div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-r/oklch from-[#06012F]/87 from-35% via-transparent via-65% to-lightgray/20"></div>

      {/* Noise layer */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>

      <div
        className="absolute top-10 right-16 text-3xl tracking-[0.3em] font-semibold text-white"
        style={{ textShadow: "0 0 20px #06012F" }}
      >
        TAXAVA
      </div>
      {/* Login Card */}
      <div className="relative z-10 min-w-[540px] max-w-[92%] p-14 flex flex-col gap-y-6 text-white ml-24">
        <h1 className="text-6xl font-bold leading-tight mb-8">
          Log in <br />
          <div className="flex flex-row">
            <span>to your account </span>
            <div className="w-4 h-4  ml-2 mb-2 rounded-full bg-[#7C3AED] self-end" />
          </div>
        </h1>

        <form
          onSubmit={handleLogin}
          className="space-y-4 flex gap-y-2 flex-col"
        >
          <div className="relative w-full">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-100 z-100">
              {mode === "email" ? <Mail size={24} /> : <User size={24} />}
            </div>

            {/* identifier field (email/username) */}
            <input
              type={mode === "email" ? "email" : "text"}
              placeholder={placeholderText}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              autoComplete="username"
              required
              className="w-full p-4 rounded-xl bg-white/20 placeholder-gray-300 text-white text-lg outline-none backdrop-blur-md pl-14"
            />
          </div>
          {/* Password field */}
          <div className="relative w-full">
            <div className="absolute z-100 left-4 top-1/2 -translate-y-1/2 text-gray-100">
              <Lock size={24} />
            </div>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="w-full p-4 rounded-xl bg-white/20 placeholder-gray-300 text-white outline-none backdrop-blur-md text-lg pl-14"
            />
          </div>
          {/* Forgot password */}
          <p className="text-m">
            Forgot password?{" "}
            <Link
              to="/forgotPassword"
              className="text-[#a77bf2] hover:underline cursor-pointer"
            >
              Click here
            </Link>
          </p>

          {/* Buttons */}
          <div className="flex gap-6 pt-2">
            <button
              type="button"
              onClick={toggleMode}
              className="flex-1 h-12 rounded-full bg-neutral-700 text-m font-semibold hover:bg-neutral-600  transition cursor-pointer"
            >
              {toggleButtonText}
            </button>

            <button
              type="submit"
              className="flex-1 h-12 rounded-full  bg-linear-to-r from-[#7C3AED] to-indigo-900 text-m font-semibold shadow-lg hover:opacity-75  transition cursor-pointer"
            >
              Log In
            </button>
          </div>

          {/* Create Account */}
          <div className="flex justify-center pt-4">
            <Link
              to="/createaccount"
              className="text-[#a77bf2] hover:underline"
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
