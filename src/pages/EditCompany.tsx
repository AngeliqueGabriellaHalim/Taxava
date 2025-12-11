import Navbar from "../component/Navbar";
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import initialCompaniesData from "../db/company.json";


// --- Interfaces ---

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

const loadLocalCompanies = (): Company[] => {
  try {
    const data = localStorage.getItem("companies");
    return data ? JSON.parse(data) as Company[] : [];
  } catch (e) {
    console.error("Error loading local companies:", e);
    return [];
  }
};

const loadAllCompanies = (): Company[] => {
  const localCompanies = loadLocalCompanies();
  const initialData = initialCompaniesData as Company[];

  const companyMap = new Map<number, Company>();

  // data JSON
  initialData.forEach(company => {
    companyMap.set(company.id, company);
  });

  // data Local Storage
  localCompanies.forEach(company => {
    companyMap.set(company.id, company);
  });

  return Array.from(companyMap.values());
};



const saveCompanies = (companies: Company[]) => {
  localStorage.setItem("companies", JSON.stringify(companies));
};


const EditCompany: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const companyId = id ? parseInt(id) : null;
  const navigate = useNavigate();

  // --- State Input ---
  const [companyName, setCompanyName] = useState("");
  const [companyNumber, setCompanyNumber] = useState("");
  const [mailingAddress, setMailingAddress] = useState("");
  const [returnAddress, setReturnAddress] = useState("");
  const [sameAddress, setSameAddress] = useState(false);
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [errorBanner, setErrorBanner] = useState("");

  const [loading, setLoading] = useState(true);
  // initialCompany akan menyimpan detail perusahaan yang dimuat versi LS atau JSON
  const [initialCompany, setInitialCompany] = useState<Company | null>(null);

  // efek untuk memuat dan mengisi data perusahaan saat komponen dimuat
  useEffect(() => {
    if (!companyId) {
      toast.error("Company ID is missing.");
      navigate("/manage-companies");
      return;
    }

    // Ambil semua data
    const allCompanies = loadAllCompanies();
    const foundCompany = allCompanies.find(c => c.id === companyId);

    if (foundCompany) {
      setInitialCompany(foundCompany);
      setCompanyName(foundCompany.name);
      setCompanyNumber(foundCompany.phone);
      setMailingAddress(foundCompany.mailingAddress);
      setReturnAddress(foundCompany.returnAddress);
      setSameAddress(foundCompany.sameAddress);
      setOwnerName(foundCompany.ownerName);
      setOwnerEmail(foundCompany.ownerEmail);
    } else {
      toast.error(`Company with ID ${companyId} not found.`);
      navigate("/manage-companies");
    }
    setLoading(false);
  }, [companyId, navigate]);

  // --- Handler Checkbox & Input ---
  const handleSameAddress = () => {
    const checked = !sameAddress;
    setSameAddress(checked);
    if (checked) setReturnAddress(mailingAddress);
  };

  const handleMailingChange = (value: string) => {
    setMailingAddress(value);
    if (sameAddress) setReturnAddress(value);
  };

  // --- Validasi Data ---
  const validateData = useCallback(() => {
    setErrorBanner("");

    if (!companyName || !companyNumber || !mailingAddress || !returnAddress || !ownerName || !ownerEmail) {
      setErrorBanner("Please fill all required fields.");
      toast.error("Please fill all required fields.");
      return false;
    }
    if (!/^[0-9]+$/.test(companyNumber)) {
      setErrorBanner("Company number must contain numbers only.");
      toast.error("Company number must contain numbers only.");
      return false;
    }
    // Validasi Email
    if (!/^\S+@\S+\.com$/.test(ownerEmail)) {
      setErrorBanner("Email must be a valid address ending with .com.");
      toast.error("Email must be a valid address ending with .com.");
      return false;
    }
    return true;
  }, [companyName, companyNumber, mailingAddress, returnAddress, ownerName, ownerEmail]);

  // --- logika penyimpanan  ---
  const handleSaveCompany = () => {
    if (!validateData() || !initialCompany) return;

    //  buat objek company
    const updatedCompany: Company = {
      ...initialCompany,
      name: companyName,
      phone: companyNumber,
      mailingAddress: mailingAddress,
      returnAddress: returnAddress,
      sameAddress: sameAddress,
      ownerName: ownerName,
      ownerEmail: ownerEmail,
    };

    const existingLocalCompanies = loadLocalCompanies();
    const companyIndex = existingLocalCompanies.findIndex(c => c.id === updatedCompany.id);

    let companiesToSave: Company[];

    if (companyIndex !== -1) {
      existingLocalCompanies[companyIndex] = updatedCompany;
      companiesToSave = existingLocalCompanies;
    } else {
      companiesToSave = [...existingLocalCompanies, updatedCompany];
    }
    saveCompanies(companiesToSave);

    toast.success(`Company '${updatedCompany.name}' updated successfully!`);
    navigate("/manage-companies");
  };

  // --- Logika Pembatalan ---
  const handleCancel = () => {
    navigate("/manage-companies");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white flex justify-center items-center">
        Loading Company Data...
      </div>
    );
  }

  if (!initialCompany) {
    return (
      <div className="min-h-screen bg-zinc-900 text-white flex justify-center items-center">
        Error: Failed to load company details.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col">
      <Navbar />
      <div className="min-h-screen bg-neutral-900 text-white px-6 py-14 flex justify-center">
        <div className="bg-neutral-800/50 rounded-2xl shadow-2xl w-full max-w-5xl p-10">
          {/* Header */}
          <div className="flex justify-between items-center mb-12">
            <div className="text-xl tracking-[0.3em] font-semibold">TAXAVA</div>
            <h1 className="text-3xl font-bold">Edit Company</h1>
            <div></div>
          </div>

          {/* Company Name full width */}
          <div className="col-span-2 mb-6">
            <label className="block mb-2 font-semibold">
              Company Name
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter company name"
              className="bg-neutral-800 w-full p-3 rounded-lg"
            />
          </div>

          {/* Error Banner */}
          {errorBanner && (
            <div className="bg-red-700/50 p-3 rounded-lg mb-8 text-sm text-white font-semibold">
              {errorBanner}
            </div>
          )}

          {/* grid 2 kolom */}
          <div className="grid grid-cols-2 gap-x-10 mb-10">


            {/* KIRI */}
            <div className="flex flex-col gap-6">

              {/* Phone Number */}
              <div>
                <label className="block mb-2 font-semibold">Phone Number</label>
                <input
                  type="text"
                  value={companyNumber}
                  onChange={(e) => setCompanyNumber(e.target.value)}
                  placeholder="Enter phone num"
                  className="bg-neutral-800 w-full p-3 rounded-lg"
                />
              </div>

              {/* Mailing Address */}
              <div>
                <label className="block mb-2 font-semibold">Mailing Address</label>
                <input
                  type="text"
                  value={mailingAddress}
                  onChange={(e) => handleMailingChange(e.target.value)}
                  placeholder="Enter mailing address"
                  className="bg-neutral-800 w-full p-3 rounded-lg"
                />
              </div>

              {/* Package Return Address & Checkbox */}
              <div>
                <label className="block mb-2 font-semibold">Package Return Address</label>
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
                  <input
                    type="checkbox"
                    checked={sameAddress}
                    onChange={handleSameAddress}
                  />
                  Same as mailing address
                </label>
              </div>
            </div>

            {/* KANAN */}
            <div className="flex flex-col gap-6">

              {/* Owner's Name */}
              <div>
                <label className="block mb-2 font-semibold">Owner's Name</label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="Enter owner's name"
                  className="bg-neutral-800 w-full p-3 rounded-lg"
                />
              </div>

              {/* Owner's Email */}
              <div>
                <label className="block mb-2 font-semibold">Owner's Email</label>
                <input
                  type="email"
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                  placeholder="Enter owner's email"
                  className="bg-neutral-800 w-full p-3 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* buttons bawah */}
          <div className="flex justify-center gap-8 pt-8 border-t border-neutral-700">
            <button
              type="button"
              onClick={handleSaveCompany}
              className="px-8 py-3 rounded-full font-semibold shadow-lg transition"
              style={{ backgroundColor: '#7C3AED' }}
            >
              Save
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="bg-red-600 px-8 py-3 rounded-full font-semibold shadow-lg hover:bg-red-500 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCompany;