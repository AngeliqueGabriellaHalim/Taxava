import { useNavigate } from "react-router-dom";

const CheckEmail: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center px-6 relative">
      {/* Logo */}
      <div className="absolute top-6 left-8 text-xl tracking-[0.3em] font-semibold">
        TAXAVA
      </div>

      {/* Konten utama */}
      <div className="flex flex-col items-center text-center space-y-4 max-w-lg">
        <h1 className="text-4xl font-bold">Check your email !</h1>

        <p className="text-sm text-neutral-300 leading-relaxed">
          We have sent a confirmation to verify to your email.
        </p>

        <button
          type="button"
          onClick={() => navigate("/login")} // balik ke halaman login/home
          className="mt-4 px-8 h-10 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 text-sm font-semibold shadow-lg hover:opacity-95 active:translate-y-[1px] transition"
        >
          Back to Login Page
        </button>
      </div>
    </div>
  );
};

export default CheckEmail;
