import React, { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../component/Navbar";
import { toast } from "react-toastify";
import INITIAL_COMPANIES_DATA from "../db/company.json";

// Interfaces
interface Company {
  id: number;
  name: string;
  phone: string;
  mailingAddress: string;
  returnAddress: string;
  sameAddress: boolean;
  ownerName: string;
  ownerEmail: string;
  userId: number;
}

interface User {
  id: number;
  username: string;
  email: string;
  password?: string;
  hasOnboarded: boolean;
}

const CompanySetup: React.FC = () => {
  const navigate = useNavigate();

  // State Input
  const [companyName, setCompanyName] = useState("");
  const [companyNumber, setCompanyNumber] = useState("");
  const [mailingAddress, setMailingAddress] = useState("");
  const [returnAddress, setReturnAddress] = useState("");
  const [sameAddress, setSameAddress] = useState(false);
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [errorBanner, setErrorBanner] = useState("");

  // utils
  const getCurrentUser = (): User | null => {
    const userStr = localStorage.getItem("currentUser");
    return userStr ? JSON.parse(userStr) : null;
  };

  const loadLocalCompanies = (): Company[] => {
    const data = localStorage.getItem("companies");
    return data ? JSON.parse(data) : [];
  };

  const loadCompaniesForIdCheck = (): Company[] => {
    const localCompanies = loadLocalCompanies();
    const initialData = INITIAL_COMPANIES_DATA as Company[];
    return [...localCompanies, ...initialData];
  };

  const saveCompanies = (companies: Company[]) => {
    localStorage.setItem("companies", JSON.stringify(companies));
  };

  // Handlers
  const handleSameAddress = () => {
    const checked = !sameAddress;
    setSameAddress(checked);
    if (checked) setReturnAddress(mailingAddress);
  };

  const handleMailingChange = (value: string) => {
    setMailingAddress(value);
    if (sameAddress) setReturnAddress(value);
  };

  // validasi
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
      const msg = "Please fill all required fields.";
      setErrorBanner(msg);
      toast.error(msg);
      return false;
    }

    if (!/^[0-9]+$/.test(companyNumber)) {
      const msg = "Company number must contain numbers only.";
      setErrorBanner(msg);
      toast.error(msg);
      return false;
    }

    if (!/^\S+@\S+\.\S+$/.test(ownerEmail)) {
      const msg = "Please enter a valid email address.";
      setErrorBanner(msg);
      toast.error(msg);
      return false;
    }
    return true;
  }, [companyName, companyNumber, mailingAddress, returnAddress, ownerName, ownerEmail]);

  const handleAddCompany = () => {
    if (!validateData()) return;

    const currentUser = getCurrentUser();
    if (!currentUser) {
      toast.error("User not logged in. Please log in first.");
      return;
    }

    const allCompaniesForIdCheck = loadCompaniesForIdCheck();
    const maxId = allCompaniesForIdCheck.length > 0
      ? Math.max(...allCompaniesForIdCheck.map((c: Company) => c.id))
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

    const currentLocalCompanies = loadLocalCompanies();
    saveCompanies([...currentLocalCompanies, newCompany]);

    toast.success(`Company '${companyName}' added successfully!`);

    // reset state
    setCompanyName("");
    setCompanyNumber("");
    setMailingAddress("");
    setReturnAddress("");
    setSameAddress(false);
    setOwnerName("");
    setOwnerEmail("");
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col">
      <Navbar />
      <div className="min-h-screen bg-neutral-900 text-white px-6 py-14 flex justify-center">
        <div className="bg-neutral-800/50 rounded-2xl shadow-2xl w-full max-w-5xl p-10">
          <div className="flex justify-between items-center mb-12">
            <div className="text-xl tracking-[0.3em] font-semibold">TAXAVA</div>
            <h1 className="text-3xl font-bold">Company Setup</h1>
            <button
              onClick={handleAddCompany}
              className="bg-violet-500 px-5 py-2 rounded-full text-sm font-semibold shadow-lg hover:opacity-90"
            >
              Add Company
            </button>
          </div>

          {errorBanner && (
            <div className="bg-red-700/50 p-3 rounded-lg mb-8 text-sm text-white font-semibold">
              {errorBanner}
            </div>
          )}

          <div className="grid grid-cols-2 gap-x-10 mb-20">
            <div className="col-span-2 mb-8">
              <label className="block mb-2 font-semibold">Enter company name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter company name"
                className="bg-neutral-800 w-full p-3 rounded-lg"
              />
            </div>

            <div className="flex flex-col gap-6">
              <input
                type="text"
                value={companyNumber}
                onChange={(e) => setCompanyNumber(e.target.value)}
                placeholder="Enter company number"
                className="bg-neutral-800 w-full p-3 rounded-lg"
              />
              <input
                type="text"
                value={mailingAddress}
                onChange={(e) => handleMailingChange(e.target.value)}
                placeholder="Enter mailing address"
                className="bg-neutral-800 w-full p-3 rounded-lg"
              />
              <div>
                <input
                  type="text"
                  value={returnAddress}
                  onChange={(e) => setReturnAddress(e.target.value)}
                  placeholder="Enter package return address"
                  disabled={sameAddress}
                  className={`w-full p-3 rounded-lg ${sameAddress ? "bg-neutral-700 cursor-not-allowed" : "bg-neutral-800"
                    }`}
                />
                <label className="flex items-center text-sm gap-2 cursor-pointer mt-2">
                  <input type="checkbox" checked={sameAddress} onChange={handleSameAddress} />
                  Same as mailing address
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="Enter owner's name"
                className="bg-neutral-800 w-full p-3 rounded-lg"
              />
              <input
                type="email"
                value={ownerEmail}
                onChange={(e) => setOwnerEmail(e.target.value)}
                placeholder="Enter owner's email"
                className="bg-neutral-800 w-full p-3 rounded-lg"
              />
            </div>
          </div>

          <div className="flex justify-center gap-8">
            <button
              onClick={() => navigate("/onboarding", { replace: true })}
              className="bg-violet-600 px-8 py-3 rounded-full font-semibold hover:opacity-90"
            >
              Finish Set Up
            </button>
            <Link
              to="/onboarding"
              className="bg-red-600 px-8 py-3 rounded-full font-semibold hover:bg-red-500"
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