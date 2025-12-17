import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Navbar from "../component/Navbar";
import { toast } from "react-toastify";
import { getCurrentUser } from "../utils/getUser";
import { loadAllCompanies, saveCompaniesToLocal } from "../utils/getCompany";
import type { Company } from "../utils/getCompany";

const CompanySetup: React.FC = () => {
  // const navigate = useNavigate();

  // State Input
  const [companyName, setCompanyName] = useState("");
  const [companyNumber, setCompanyNumber] = useState("");
  const [mailingAddress, setMailingAddress] = useState("");
  const [returnAddress, setReturnAddress] = useState("");
  const [sameAddress, setSameAddress] = useState(false);
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [errorBanner, setErrorBanner] = useState("");

  // Handlers method
  const handleSameAddress = () => {
    if (!mailingAddress.trim()) {
      setErrorBanner("Please fill mailing address first.");
      return;
    }
    setErrorBanner("");

    const checked = !sameAddress;
    setSameAddress(checked);

    if (checked) {
      setReturnAddress("Same as mailing address");
    } else {
      setReturnAddress("");
    }
  };

  const handleMailingChange = (value: string) => {
    setMailingAddress(value);
    if (sameAddress) setReturnAddress(value);
  };

  // Validasi (Error pakai banner sesuai req, sukses pakai toast)
  const validateData = useCallback(() => {
    setErrorBanner("");

    if (
      !companyName ||
      !companyNumber ||
      !mailingAddress ||
      !returnAddress ||
      !ownerName ||
      !ownerEmail
    ) {
      setErrorBanner("Please fill all required fields.");
      return false;
    }
    if (companyName.length >= 25) {
      setErrorBanner("Company name maximum 25 characters.");
      return false;
    }
    if (ownerName.length >= 25) {
      setErrorBanner("Owner name maximum 25 characters.");
      return false;
    }
    if (!/^[0-9]+$/.test(companyNumber)) {
      setErrorBanner("Company number must contain numbers only.");
      return false;
    }

    // Regex email umum
    if (!/^\S+@\S+\.\S+$/.test(ownerEmail)) {
      setErrorBanner("Please enter a valid email address.");
      return false;
    }
    return true;
  }, [
    companyName,
    companyNumber,
    mailingAddress,
    returnAddress,
    ownerName,
    ownerEmail,
  ]);

  const handleAddCompany = () => {
    if (!validateData()) return;

    const currentUser = getCurrentUser();
    if (!currentUser) {
      setErrorBanner("User not logged in. Please log in first.");
      return;
    }

    const allCompanies = loadAllCompanies();
    const maxId =
      allCompanies.length > 0
        ? Math.max(...allCompanies.map((c: Company) => c.id))
        : 0;

    const newCompany: Company = {
      id: maxId + 1,
      name: companyName,
      phone: companyNumber,
      mailingAddress: mailingAddress,
      returnAddress: returnAddress,
      sameAddress: sameAddress,
      ownerName: ownerName,
      ownerEmail: ownerEmail,
      userId: currentUser.id,
    };

    const localRaw = localStorage.getItem("companies");
    const currentLocal: Company[] = localRaw ? JSON.parse(localRaw) : [];

    saveCompaniesToLocal([...currentLocal, newCompany]);

    // Toast untuk Sukses
    toast.success(`Company '${companyName}' added successfully!`);

    // Reset state
    setCompanyName("");
    setCompanyNumber("");
    setMailingAddress("");
    setReturnAddress("");
    setSameAddress(false);
    setOwnerName("");
    setOwnerEmail("");
    setErrorBanner("");
  };

  return (
    <div className="min-h-screen bg-linear-to-r/hsl from-[#191A1F] from-15% to-[#06012F]  text-white flex flex-col">
      {/* navbar */}
      <Navbar />
      <div className="min-h-screen bg-linear-to-r/hsl from-[#191A1F] from-15% to-[#06012F]  text-white px-6 py-14 flex justify-center">
        {/* card utama */}
        <div className="bg-zinc-800/50 rounded-2xl shadow-2xl w-full max-w-5xl p-10">
          {/* header */}
          <div className="flex justify-center items-center mb-12">
            <h1 className="text-4xl font-bold">Company Setup</h1>
          </div>

          {/* Error banner top of page */}
          {errorBanner && (
            <div className="bg-red-700/50 p-3 rounded-lg mb-8 text-md text-white font-semibold">
              {errorBanner}
            </div>
          )}

          {/* grid 2 kolom */}
          <div className="grid grid-cols-2 gap-x-10 mb-20">
            {/* company name full width */}
            <div className="col-span-2 mb-8">
              <label className="block mb-2 font-semibold text-md">
                Company Name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter company name"
                className="bg-zinc-800 w-full p-3 rounded-lg"
              />
            </div>

            {/* kiri */}
            <div className="flex flex-col gap-6">
              <input
                type="text"
                value={companyNumber}
                onChange={(e) => setCompanyNumber(e.target.value)}
                placeholder="Enter company number"
                className="bg-zinc-800 w-full p-3 rounded-lg"
              />

              <input
                type="text"
                value={mailingAddress}
                onChange={(e) => handleMailingChange(e.target.value)}
                placeholder="Enter mailing address"
                className="bg-zinc-800 w-full p-3 rounded-lg"
              />

              <input
                type="text"
                value={returnAddress}
                onChange={(e) => setReturnAddress(e.target.value)}
                placeholder="Enter package return address"
                disabled={sameAddress}
                className={`w-full p-3 rounded-lg ${
                  sameAddress ? "bg-zinc-700 cursor-not-allowed" : "bg-zinc-800"
                }`}
              />

              <label className="flex items-center text-sm gap-2 cursor-pointer ml-2">
                <input
                  type="checkbox"
                  checked={sameAddress}
                  onChange={handleSameAddress}
                  className="cursor-pointer"
                />
                Same as mailing address
              </label>
            </div>

            {/* kanan */}
            <div className="flex flex-col gap-6">
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="Enter owner's name"
                className="bg-zinc-800 w-full p-3 rounded-lg"
              />

              <input
                type="email"
                value={ownerEmail}
                onChange={(e) => setOwnerEmail(e.target.value)}
                placeholder="Enter owner's email"
                className="bg-zinc-800 w-full p-3 rounded-lg"
              />
            </div>
          </div>

          {/* buttons bawah */}
          <div className="flex justify-center gap-8">
            {/* <button
              onClick={() => navigate("/onboarding", { replace: true })}
              className="bg-violet-600 px-8 py-3 rounded-full font-semibold hover:opacity-90"
            >
              Finish Set Up
            </button> */}
            <button
              onClick={handleAddCompany}
              className="bg-violet-500 px-5 py-2 rounded-full text-md font-semibold shadow-lg hover:opacity-90 cursor-pointer"
            >
              Add Company
            </button>

            <Link
              to="/onboarding"
              className="bg-red-600 px-8 py-3 rounded-full font-semibold hover:bg-red-500 cursor-pointer text-md"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanySetup;
