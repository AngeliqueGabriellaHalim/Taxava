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

  // mendapatkan User
  const getCurrentUser = (): User | null => {
    const userStr = localStorage.getItem("currentUser");
    return userStr ? JSON.parse(userStr) : null;
  };

  // data dari Local Storage (HANYA data buatan user)
  const loadLocalCompanies = (): Company[] => {
    const data = localStorage.getItem("companies");
    return data ? JSON.parse(data) : [];
  };

  // menggabungkan Local Storage dan JSON untuk check ID
  const loadCompaniesForIdCheck = (): Company[] => {
    const localCompanies = loadLocalCompanies();
    const initialData = INITIAL_COMPANIES_DATA as Company[];

    return [...localCompanies, ...initialData];
  };

  // Menyimpan semua perusahaan ke local storage
  const saveCompanies = (companies: Company[]) => {
    localStorage.setItem("companies", JSON.stringify(companies));
  };

  // Handler Checkbox & Input

  const handleSameAddress = () => {
    const checked = !sameAddress;
    setSameAddress(checked);
    if (checked) setReturnAddress(mailingAddress);
  };

  const handleMailingChange = (value: string) => {
    setMailingAddress(value);
    if (sameAddress) setReturnAddress(value);
  };

  // validasi dan logika penyimpanan

  const validateData = useCallback(() => {
    if (
      !companyName ||
      !companyNumber ||
      !mailingAddress ||
      !returnAddress ||
      !ownerName ||
      !ownerEmail
    ) {
      toast.error("Please fill all fields.");
      return false;
    }

    if (!/^[0-9]+$/.test(companyNumber)) {
      toast.error("Company number must contain numbers only.");
      return false;
    }

    if (!/^\S+@\S+\.com$/.test(ownerEmail)) {
      toast.error("Email must be a valid address ending with .com.");
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
      toast.error("User not logged in. Please log in first.");
      return;
    }

    //  data gabungan local + JSON
    const allCompaniesForIdCheck = loadCompaniesForIdCheck();

    // cari ID maksimum + 1
    const maxId =
      allCompaniesForIdCheck.length > 0
        ? Math.max(...allCompaniesForIdCheck.map((c) => c.id))
        : 0;
    const newId = maxId + 1;

    // data Company Baru
    const newCompany: Company = {
      id: newId,
      name: companyName,
      phone: companyNumber,
      mailingAddress: mailingAddress,
      returnAddress: returnAddress,
      sameAddress: sameAddress,
      ownerName: ownerName,
      ownerEmail: ownerEmail,
      userId: currentUser.id,
    };

    const currentLocalCompanies = loadLocalCompanies(); // Akan kosong [] jika belum ada data user

    // Tambahkan perusahaan baru ke array dari Local Storage
    const updatedCompanies = [...currentLocalCompanies, newCompany];

    // Simpan hanya data user (perusahaan baru) ke Local Storage
    saveCompanies(updatedCompanies);

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

  //  finish set up
  const handleFinishSetup = () => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      toast.error("Please log in again.");
      return;
    }

    // arah ke /manage-company
    navigate("/manage-companies");
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col">
      {/* navbar */}
      <Navbar />
      <div className="min-h-screen bg-neutral-900 text-white px-6 py-14 flex justify-center">
        {/* card utama */}
        <div className="bg-neutral-800/50 rounded-2xl shadow-2xl w-full max-w-5xl p-10">
          {/* header */}
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

          {/* grid 2 kolom */}
          <div className="grid grid-cols-2 gap-x-10 mb-20">
            {/* company Name full width */}
            <div className="col-span-2 mb-8">
              <label className="block mb-2 font-semibold">
                Enter company name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter company name"
                className="bg-neutral-800 w-full p-3 rounded-lg"
              />
            </div>

            {/* kiri */}
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

              <input
                type="text"
                value={returnAddress}
                onChange={(e) => setReturnAddress(e.target.value)}
                placeholder="Enter package return address"
                disabled={sameAddress}
                className={`w-full p-3 rounded-lg ${
                  sameAddress
                    ? "bg-neutral-700 cursor-not-allowed"
                    : "bg-neutral-800"
                }`}
              />

              <label className="flex items-center text-sm gap-2 cursor-pointer mt-2">
                <input
                  type="checkbox"
                  checked={sameAddress}
                  onChange={handleSameAddress}
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

          {/* buttons bawah */}
          <div className="flex justify-center gap-8">
            <button
              onClick={handleFinishSetup}
              className="bg-violet-600 px-8 py-3 rounded-full font-semibold hover:opacity-90"
            >
              Finish Set Up
            </button>

            <Link
              to="/home"
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
