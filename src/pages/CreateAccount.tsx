import React, { useState } from "react";
import type { FormEvent } from "react";
import toast from "react-hot-toast";
import users from "../mock/users.json";
import { Mail, User, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface User {
  id: number;
  username: string;
  email: string;
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    navigate("/login");
    const found = (users as User[]).some(
      (user) => user.email.toLowerCase() === form.email.toLowerCase()
    );

    if (found) {
      toast.error(`An account with ${form.email} already exists.`);
      return;
    }

    if (form.password !== form.passwordConfirm) {
      toast.error("Passwords do not match.");
      return;
    }

    toast.success(`Account created successfully for ${form.username}!`);

    navigate("/login");

    setForm({
      username: "",
      email: "",
      password: "",
      passwordConfirm: "",
    });
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white grid grid-cols-2 relative">
      <div className="absolute top-6 left-8 text-xl tracking-[0.3em] font-semibold">
        TAXAVA
      </div>
      <div className="relative flex items-center justify-center"></div>

      <div className="flex items-center justify-center pr-16 relative">
        {/* CARD */}
        <div className="bg-neutral-900/80 rounded-3xl shadow-2xl px-10 py-10 max-w-md w-full">
          <h1 className="text-4xl font-bold leading-tight mb-1">
            Create a new <br />
            <span>Account</span>
          </h1>

          <div className="h-6" />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center bg-white/10 rounded-full px-4 h-11">
              <User className="w-4 h-4 mr-3 text-neutral-100" />
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={form.username}
                onChange={handleChange}
                required
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-neutral-300"
              />
            </div>

            <div className="flex items-center bg-white/10 rounded-full px-4 h-11">
              <Mail className="w-4 h-4 mr-3 text-neutral-100" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={form.email}
                onChange={handleChange}
                required
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-neutral-300"
              />
            </div>

            <div className="flex items-center bg-white/10 rounded-full px-4 h-11">
              <Lock className="w-4 h-4 mr-3 text-neutral-100" />
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-neutral-300"
              />
            </div>

            <div className="flex items-center bg-white/10 rounded-full px-4 h-11">
              <Lock className="w-4 h-4 mr-3 text-neutral-100" />
              <input
                type="password"
                name="passwordConfirm"
                placeholder="Re-enter your password"
                value={form.passwordConfirm}
                onChange={handleChange}
                required
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-neutral-300"
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full h-11 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 text-sm font-semibold shadow-lg hover:opacity-95 active:translate-y-[1px] transition"
            >
              Create Account
            </button>
          </form>
          <div className="flex justify-center pt-4">
            <Link to="/login" className="text-indigo-300 hover:underline">
              I already have an account.
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
