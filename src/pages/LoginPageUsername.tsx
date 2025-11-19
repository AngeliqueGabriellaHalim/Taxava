import React, { useState } from "react";

const LoginPageUsername: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ username, password });
  };

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

      {/* Noise + Blur */}
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
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/20 placeholder-gray-300 text-white outline-none backdrop-blur-md"
          />

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/20 placeholder-gray-300 text-white outline-none backdrop-blur-md"
          />

          <p className="text-sm">
            Forgot password?{" "}
            <a className="text-indigo-400 underline cursor-pointer">
              Click here
            </a>
          </p>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              className="flex-1 h-12 rounded-full bg-neutral-700 text-sm font-semibold hover:bg-neutral-600 active:translate-y-[1px] transition cursor-pointer"
            >
              Log in with email
            </button>

            <button
              type="submit"
              className="flex-1 h-12 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 text-sm font-semibold shadow-lg hover:opacity-95 active:translate-y-[1px] transition cursor-pointer"
            >
              Log In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPageUsername;
