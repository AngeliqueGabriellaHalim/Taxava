import React, { useState } from "react";
import { Link } from "react-router-dom";

const CompanySetup: React.FC = () => {
  const [companyNumber, setCompanyNumber] = useState("");
  const [mailingAddress, setMailingAddress] = useState("");
  const [returnAddress, setReturnAddress] = useState("");
  const [sameAddress, setSameAddress] = useState(false);

  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");

  // buat kalau checkbox di pilih
  const handleSameAddress = () => {
    const checked = !sameAddress;
    setSameAddress(checked);

    if (checked) {
      setReturnAddress(mailingAddress);
    }
  };


  const handleMailingChange = (value: string) => {
    setMailingAddress(value);

    if (sameAddress) {
      setReturnAddress(value);
    }
  };

  // buat cek memastikan bahwa semua field sudah terisi
  const validateData = () => {
    if (!companyNumber || !mailingAddress || !returnAddress || !ownerName || !ownerEmail) {
      alert("Please fill all fields.");
      return false;
    }
    // mengandung nomor digit saja
    if (!/^[0-9]+$/.test(companyNumber)) {
      alert("Company number must contain numbers only.");
      return false;
    }

    // harus @gmail.com
    if (!ownerEmail.endsWith("@gmail.com")) {
      alert("Email must be a valid Gmail address.");
      return false;
    }

    return true;
  };

  // jika memenuhi syarat lakukan ini
  const handleAddCompany = () => {
    if (!validateData()) return;

    // menyimpan format data ini
    const savedData = {
      companyNumber,
      mailingAddress,
      returnAddress,
      ownerName,
      ownerEmail
    };

    console.log("Saved company:", savedData);

    // reset fields
    setCompanyNumber("");
    setMailingAddress("");
    setReturnAddress("");
    setSameAddress(false);
    setOwnerName("");
    setOwnerEmail("");
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white px-10 py-10">

      {/* Header */}
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

      {/* 2 grid */}
      <div className="grid grid-cols-2 gap-16 mb-20">

        {/* kolom kiri */}
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
            className={`w-full p-3 rounded-lg ${sameAddress ? "bg-neutral-700 cursor-not-allowed" : "bg-neutral-800"
              }`}
          />

          {/* checkbox */}
          <label className="flex items-center text-sm gap-2 cursor-pointer mt-2">
            <input
              type="checkbox"
              checked={sameAddress}
              onChange={handleSameAddress}
            />
            Same as mailing address
          </label>
        </div>

        {/* kolom kanan */}
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

      {/* button bawah */}
      <div className="flex justify-center gap-8">
        <button className="bg-violet-600 px-8 py-3 rounded-full font-semibold hover:opacity-90">
          Finish Set Up
        </button>

        <Link
          to="/"
          className="bg-red-600 px-8 py-3 rounded-full font-semibold hover:bg-red-500"
        >
          Cancel
        </Link>
      </div>
    </div>
  );
};

export default CompanySetup;
