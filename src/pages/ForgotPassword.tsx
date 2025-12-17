import React, { useState, type FormEvent } from "react";
import { Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    toast.success("If the email exists, a reset link has been sent.");
    navigate("/checkemail");
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

        <form className="space-y-6" onSubmit={handleSubmit}>
          <p className="text-sm text-neutral-200 text-center leading-relaxed">
            Enter the email associated with your account.
          </p>

          <div className="flex items-center bg-neutral-700 rounded-full px-4 h-12">
            <Mail className="mr-2 w-5 h-5 text-neutral-200" />
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-neutral-400"
            />
          </div>

          <p className="text-xs text-neutral-300 text-center leading-relaxed">
            We'll send an email with instructions to{" "}
            <span className="font-semibold">reset your password.</span>
          </p>

          <button
            type="submit"
            className="w-full h-12 rounded-full bg-linear-to-r from-violet-500 to-indigo-500 text-sm font-semibold shadow-lg active:translate-y-px hover:opacity-95 transition cursor-pointer"
          >
            Send Email
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
