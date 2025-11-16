import React, { useState } from "react";
import type { FormEvent } from "react";
import users from "../mock/users.json";

interface User {
  id: number;
  email: string;
}

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "not-found">(
    "idle"
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const found = (users as User[]).some(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );

    if (found) {
      setStatus("success");
    } else {
      setStatus("not-found");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center px-6 relative">
      {/* Logo */}
      <div className="absolute top-6 left-8 text-xl tracking-[0.3em] font-semibold">
        TAXAVA
      </div>

      {/* Card */}
      <div className="bg-neutral-800/90 rounded-2xl shadow-2xl px-10 py-10 max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Forgot Password</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <p className="text-sm text-neutral-200 text-center leading-relaxed">
            Enter the email associated with
            <br />
            your account.
          </p>

          <div className="flex items-center bg-neutral-700 rounded-full px-4 h-12">
            <span className="mr-2 text-lg">✉️</span>
            <input
              type="email"
              required
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setStatus("idle");
              }}
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-neutral-400"
            />
          </div>

          <p className="text-xs text-neutral-300 text-center leading-relaxed">
            We&apos;ll send an email with instructions
            <br />
            to <span className="font-semibold">reset your password.</span>
          </p>

          <button
            type="submit"
            className="w-full h-12 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 text-sm font-semibold shadow-lg active:translate-y-[1px] hover:opacity-95 transition"
          >
            Send Email
          </button>
        </form>

        {status === "success" && (
          <p className="mt-4 text-xs text-emerald-400 text-center">
            If an account exists for{" "}
            <span className="font-semibold">{email}</span>, we&apos;ve sent a
            reset link.
          </p>
        )}

        {status === "not-found" && (
          <p className="mt-4 text-xs text-red-400 text-center">
            We can&apos;t find an account with{" "}
            <span className="font-semibold">{email}</span>.
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
