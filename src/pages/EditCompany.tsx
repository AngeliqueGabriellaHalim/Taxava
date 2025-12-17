import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../component/Navbar";
// import { Company, loadAllCompanies, saveCompaniesToLocal } from "../utils/getCompany";

import type { Company } from "../utils/getCompany";
import { loadAllCompanies, saveCompaniesToLocal } from "../utils/getCompany";

const EditCompany: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const companyId = id ? parseInt(id) : null;

  const [formData, setFormData] = useState<Company | null>(null);
  const [errorBanner, setErrorBanner] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const all = loadAllCompanies();
    const found = all.find((c) => c.id === companyId);

    if (found) {
      setFormData(found);
    } else {
      toast.error("Company not found");
      navigate("/manage-companies");
    }
    setLoading(false);
  }, [companyId, navigate]);

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

    if (name.length >= 15) {
      setErrorBanner("Company name maximum 15 characters.");
      return false;
    }
    if (ownerName.length >= 15) {
      setErrorBanner("Owner name maximum 15 characters.");
      return false;
    }

    if (!/^[0-9]+$/.test(phone)) {
      setErrorBanner("Phone must be numbers only.");
      return false;
    }
    // Regex email umum (tanpa paksaan .com)
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

  if (loading)
    return (
      <div className="min-h-screen bg-zinc-900 text-white flex justify-center items-center">
        Loading...
      </div>
    );
  if (!formData) return null;

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col">
      <Navbar />
      <div className="px-6 py-14 flex justify-center">
        <div className="bg-neutral-800/50 rounded-2xl w-full max-w-5xl p-10">
          <div className="flex justify-between items-center mb-12">
            <div className="text-xl tracking-widest font-semibold">TAXAVA</div>
            <h1 className="text-3xl font-bold">Edit Company</h1>
            <div />
          </div>

          {errorBanner && (
            <div className="bg-red-700/50 p-3 rounded-lg mb-8 text-sm">
              {errorBanner}
            </div>
          )}

          <div className="mb-6">
            <label className="block mb-2 font-semibold">Company Name</label>
            <input
              className="bg-neutral-800 w-full p-3 rounded-lg"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-10 mb-10">
            <div className="space-y-6">
              <div>
                <label className="block mb-2 font-semibold">Phone Number</label>
                <input
                  className="bg-neutral-800 w-full p-3 rounded-lg"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold">
                  Mailing Address
                </label>
                <input
                  className="bg-neutral-800 w-full p-3 rounded-lg"
                  value={formData.mailingAddress}
                  onChange={(e) => handleMailingChange(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold">
                  Return Address
                </label>
                <input
                  className={`w-full p-3 rounded-lg ${
                    formData.sameAddress
                      ? "bg-neutral-700 opacity-50"
                      : "bg-neutral-800"
                  }`}
                  value={formData.returnAddress}
                  disabled={formData.sameAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, returnAddress: e.target.value })
                  }
                />
                <label className="flex items-center gap-2 mt-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.sameAddress}
                    onChange={toggleSameAddress}
                  />
                  Same as mailing address
                </label>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block mb-2 font-semibold">Owner's Name</label>
                <input
                  className="bg-neutral-800 w-full p-3 rounded-lg"
                  value={formData.ownerName}
                  onChange={(e) =>
                    setFormData({ ...formData, ownerName: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold">
                  Owner's Email
                </label>
                <input
                  className="bg-neutral-800 w-full p-3 rounded-lg"
                  value={formData.ownerEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, ownerEmail: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-8 pt-8 border-t border-neutral-700">
            <button
              onClick={handleSave}
              className="bg-violet-600 px-8 py-3 rounded-full font-semibold"
            >
              Save
            </button>
            <button
              onClick={() => navigate("/manage-companies")}
              className="bg-red-600 px-8 py-3 rounded-full font-semibold"
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
