import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../component/Navbar";

import type { Company } from "../utils/getCompany";
import { loadAllCompanies, saveCompaniesToLocal } from "../utils/getCompany";

const EditCompany: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const companyId = id ? parseInt(id) : null;

  const allCompanies = loadAllCompanies();
  const foundCompany =
    companyId !== null
      ? allCompanies.find((c) => c.id === companyId) ?? null
      : null;

  const [formData, setFormData] = useState<Company | null>(foundCompany);
  const [errorBanner, setErrorBanner] = useState("");

  useEffect(() => {
    if (!foundCompany) {
      toast.error("Company not found");
      navigate("/manage-companies");
    }
  }, [foundCompany, navigate]);

  const handleMailingChange = (val: string) => {
    if (!formData) return;
    setFormData({
      ...formData,
      mailingAddress: val,
      returnAddress: formData.sameAddress ? val : formData.returnAddress,
    });
  };

  const toggleSameAddress = () => {
    if (!formData) return;

    //  block if mailing address is empty
    if (!formData.mailingAddress.trim()) {
      setErrorBanner("Please fill mailing address first.");
      return;
    }

    setErrorBanner(""); // clear error

    const nextSame = !formData.sameAddress;

    setFormData({
      ...formData,
      sameAddress: nextSame,
      returnAddress: nextSame
        ? "Same as Mailing Address"
        : formData.returnAddress,
    });
  };

  const validate = () => {
    if (!formData) return false;
    const {
      name,
      phone,
      mailingAddress,
      returnAddress,
      ownerName,
      ownerEmail,
    } = formData;

    if (
      !name ||
      !phone ||
      !mailingAddress ||
      !returnAddress ||
      !ownerName ||
      !ownerEmail
    ) {
      setErrorBanner("Please fill all required fields.");
      return false;
    }

    if (name.length >= 25) {
      setErrorBanner("Company name maximum 25 characters.");
      return false;
    }
    if (ownerName.length >= 25) {
      setErrorBanner("Owner name maximum 25 characters.");
      return false;
    }

    if (!/^[0-9]+$/.test(phone)) {
      setErrorBanner("Phone must be numbers only.");
      return false;
    }
    // Regex email umum
    if (!/^\S+@\S+\.\S+$/.test(ownerEmail)) {
      setErrorBanner("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (!validate() || !formData) return;

    const localRaw = localStorage.getItem("companies");
    const local: Company[] = localRaw ? JSON.parse(localRaw) : [];

    const idx = local.findIndex((c) => c.id === formData.id);
    if (idx !== -1) {
      local[idx] = formData;
    } else {
      local.push(formData);
    }

    saveCompaniesToLocal(local);
    toast.success("Company updated!");
    navigate("/manage-companies");
  };

  if (!formData) return null;

  return (
    <div className="min-h-screen bg-linear-to-r/hsl from-[#191A1F] from-15% to-[#06012F]  text-white flex flex-col">
      <Navbar />
      <div className="px-6 py-14 flex justify-center">
        <div className="bg-neutral-800/50 rounded-2xl w-full max-w-5xl p-10">
          <div className="flex justify-center items-center mb-12">
            <h1 className="text-4xl font-bold">Edit Company</h1>
            <div />
          </div>

          {errorBanner && (
            <div className="bg-red-700/50 p-3 rounded-lg mb-8 text-md">
              {errorBanner}
            </div>
          )}

          <div className="mb-6">
            <label className=" text-xl block mb-2 font-semibold">
              Company Name
            </label>
            <input
              className="bg-zinc-800 w-full p-3 rounded-lg"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-10 mb-10">
            <div className="space-y-6">
              <div>
                <label className=" text-xl block mb-2 font-semibold">
                  Phone Number
                </label>
                <input
                  className="bg-zinc-800 w-full p-3 rounded-lg"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-xl block mb-2 font-semibold">
                  Mailing Address
                </label>
                <input
                  className="bg-zinc-800 w-full p-3 rounded-lg"
                  value={formData.mailingAddress}
                  onChange={(e) => handleMailingChange(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xl block mb-2 font-semibold">
                  Return Address
                </label>
                <input
                  className={`w-full p-3 rounded-lg ${
                    formData.sameAddress
                      ? "bg-zinc-700 opacity-50"
                      : "bg-zinc-800"
                  }`}
                  value={formData.returnAddress}
                  disabled={formData.sameAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, returnAddress: e.target.value })
                  }
                />
                <label className="flex items-center gap-2 mt-2 ml-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    className="cursor-pointer"
                    checked={formData.sameAddress}
                    onChange={toggleSameAddress}
                  />
                  Same as mailing address
                </label>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-xl block mb-2 font-semibold">
                  Owner's Name
                </label>
                <input
                  className="bg-zinc-800 w-full p-3 rounded-lg"
                  value={formData.ownerName}
                  onChange={(e) =>
                    setFormData({ ...formData, ownerName: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-xl block mb-2 font-semibold">
                  Owner's Email
                </label>
                <input
                  className="bg-zinc-800 w-full p-3 rounded-lg"
                  value={formData.ownerEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, ownerEmail: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-8 pt-4 ">
            <button
              onClick={handleSave}
              className="bg-violet-600 px-8 py-3 rounded-full cursor-pointer font-semibold"
            >
              Save
            </button>
            <button
              onClick={() => navigate("/manage-companies")}
              className="bg-red-600 px-8 py-3 rounded-full cursor-pointer font-semibold"
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
