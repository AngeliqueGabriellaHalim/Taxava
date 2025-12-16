import React, { useState } from "react";
import type { FormEvent } from "react";
import { toast } from "react-toastify";
import usersDB from "../db/users.json";
import { Mail, User, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  hasOnboarded: boolean;
}

interface NewUserInput {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

const CreateAccount: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<NewUserInput>({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const loadUsers = (): User[] => {
    const data = localStorage.getItem("users");
    return data ? JSON.parse(data) : [];
  };

  const saveUsers = (users: User[]) => {
    localStorage.setItem("users", JSON.stringify(users));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (form.password !== form.passwordConfirm) {
      toast.error("Passwords do not match.");
      return;
    }

    const localUsers = loadUsers();

    const usersFromSeed = (usersDB as User[]).map((u) => ({
      ...u,
      hasOnboarded: u.hasOnboarded ?? false,
    }));
    const allUsers = [...usersFromSeed, ...localUsers];

    const existsInMock = usersFromSeed.some(
      (user) =>
        user.email.toLowerCase() === form.email.toLowerCase() ||
        user.username.toLowerCase() === form.username.toLowerCase()
    );

    const existsInLocal = localUsers.some(
      (u) =>
        u.email.toLowerCase() === form.email.toLowerCase() ||
        u.username.toLowerCase() === form.username.toLowerCase()
    );

    console.log("usersDB:", usersDB);
    console.log("localUsers:", localUsers);
    console.log("existsInMock:", existsInMock);
    console.log("existsInLocal:", existsInLocal);

    if (existsInMock || existsInLocal) {
      toast.error(`Username or Email is already used.`);
      return;
    }

    const newUser: User = {
      id: allUsers.length > 0 ? allUsers[allUsers.length - 1].id + 1 : 1,
      username: form.username,
      email: form.email,
      password: form.password,
      hasOnboarded: false,
    };

    const updated = [...localUsers, newUser];
    saveUsers(updated);

    localStorage.setItem("currentUser", JSON.stringify(newUser));

    toast.success(`Account created successfully for ${form.username}!`);

    // Arahkan ke onboarding
    navigate("/onboardingdb");

    setForm({
      username: "",
      email: "",
      password: "",
      passwordConfirm: "",
    });
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white grid grid-cols-2 relative">
      <div
        className="absolute inset-0 bg-cover bg-center brightness-75"
        style={{
          backgroundImage:
            "url('https://awsimages.detik.net.id/community/media/visual/2019/02/20/403af26a-f60a-491e-a4df-87e6570802bb_169.jpeg?w=1200')",
        }}
      ></div>
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-r/oklch from-lightgray/25 from-5% to-[#06012F]/100"></div>

      {/* Noise layer */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>

      <div
        className="absolute top-10 left-16 text-3xl tracking-[0.3em] font-semibold text-white"
        style={{ textShadow: "0 0 20px #06012F" }}
      >
        TAXAVA
      </div>
      <div className="relative flex items-center justify-center"></div>

      <div className="flex items-center justify-center pr-16 relative">
        {/* CARD */}
        <div className="rounded-3xl py-10 max-w-md w-full">
          <h1 className="text-6xl font-bold leading-tight mb-8">
            Create an <br />
            <div className="flex flex-row">
              <span>Account </span>
              <div className="w-4 h-4  ml-3 mb-2 rounded-full bg-[#7C3AED] self-end" />
            </div>
          </h1>
          <div className="h-6" />

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div
              className="flex items-center w-full h-14 rounded-2xl 
                  bg-white/20 backdrop-blur-sm 
                  px-5 space-x-4 shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
            >
              <User className="w-6 h-6 text-neutral-200" />
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={form.username}
                onChange={handleChange}
                required
                className="flex-1 bg-transparent outline-none text-base placeholder-neutral-300"
              />
            </div>

            <div
              className="flex items-center w-full h-14 rounded-2xl 
                bg-white/20 backdrop-blur-sm 
                px-5 space-x-4 shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
            >
              <Mail className="w-6 h-6 text-neutral-200" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={form.email}
                onChange={handleChange}
                required
                className="flex-1 bg-transparent outline-none text-base placeholder-neutral-300"
              />
            </div>

            <div
              className="flex items-center w-full h-14 rounded-2xl 
                bg-white/20 backdrop-blur-sm 
                px-5 space-x-4 shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
            >
              <Lock className="w-6 h-6 text-neutral-200" />
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
                className="flex-1 bg-transparent outline-none text-base placeholder-neutral-300"
              />
            </div>

            {/* Confirm Password */}
            <div
              className="flex items-center w-full h-14 rounded-2xl 
                  bg-white/20 backdrop-blur-sm 
                  px-5 space-x-4 shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
            >
              <Lock className="w-6 h-6 text-neutral-200" />
              <input
                type="password"
                name="passwordConfirm"
                placeholder="Re-enter your password"
                value={form.passwordConfirm}
                onChange={handleChange}
                required
                autoComplete="new-password"
                className="flex-1 bg-transparent outline-none text-base placeholder-neutral-300"
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full h-11 rounded-full bg-linear-to-r from-indigo-600 to-[#7C3AED] text-m font-semibold shadow-lg hover:opacity-75  transition cursor-pointer"
            >
              Create Account
            </button>
          </form>
          <div className="flex justify-center pt-4">
            <Link to="/login" className="text-[#a77bf2] hover:underline">
              I already have an account.
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
