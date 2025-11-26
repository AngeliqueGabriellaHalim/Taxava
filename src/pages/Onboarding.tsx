import React, { useState } from "react";
import { Link } from "react-router-dom";

const steps = [
  { title: "Company Setup" },
  { title: "Property Setup" },
  { title: "You're all set !" },
];

const Onboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleStepClick = (index: number) => {
    if (index === currentStep) {
      setCurrentStep(index + 1);
    }
  };

  const handleViewClick = (index: number) => {
    console.log("View clicked for step", index);
    // setelah di complete "Get Started" nanti pathing kemana
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white px-6 py-10 relative">
      {/* logo */}
      <div className="absolute top-6 left-8 text-xl tracking-[0.3em] font-semibold">
        TAXAVA
      </div>

      {/* skip atas kanan */}
      <Link
        to="/home"
        className="absolute top-6 right-8 text-sm underline text-neutral-300 hover:text-white transition"
      >
        I’d like to skip and <br /> go to main dashboard.
      </Link>

      {/* judul */}
      <div className="mt-20 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to your onboarding dashboard
        </h1>
        <p className="text-neutral-300 text-sm max-w-xl mx-auto">
          Let’s set up your company and properties to start managing your assets
          efficiently.
        </p>
      </div>

      {/* progress lingkaran */}
      <div className="flex items-center justify-center gap-20 mt-16 mb-10">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`w-10 h-10 rounded-full transition ${
              i <= currentStep ? "bg-violet-500" : "bg-neutral-700"
            }`}
          ></div>
        ))}
      </div>

      {/* cards */}
      <div className="flex justify-center gap-8 flex-wrap mt-6">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          const isFinal = index === 2; // card terakhir yang complete set up secara index [0 1 2]

          const buttonLabel = isFinal // final card
            ? "Complete set up"
            : isCompleted
            ? "View"
            : "Get Started";

          // cek untuk apakah sudah Get Started atau selesai mengisi form
          const handleClick = () => {
            if (isActive) {
              handleStepClick(index);
            } else if (isCompleted) {
              handleViewClick(index);
            }
          };

          {
            /* card 1, 2, 3 */
          }
          return (
            <div
              key={index}
              className="bg-neutral-800/80 w-64 h-48 rounded-xl p-6 flex flex-col items-center justify-between shadow-lg"
            >
              <h2 className="text-lg font-semibold text-center">
                {step.title}
              </h2>

              <button
                onClick={handleClick}
                disabled={!isActive && !isCompleted}
                // cek ketentuan apakah sudah Get Started sebelumnya atau belum
                className={`w-full h-12 rounded-full text-sm font-semibold transition shadow-lg
                                    ${
                                      isFinal
                                        ? "bg-violet-500 hover:opacity-90"
                                        : isActive
                                        ? "bg-violet-600 hover:opacity-90"
                                        : isCompleted
                                        ? "bg-violet-500 hover:opacity-90"
                                        : "bg-neutral-600"
                                    }
                                    ${
                                      !isActive && !isCompleted
                                        ? "opacity-40 cursor-not-allowed"
                                        : "cursor-pointer"
                                    }`}
              >
                {buttonLabel}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Onboarding;
