import React, { useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { CaseSensitive, ChevronDown } from "lucide-react"; // ikon 'A' & dropdown
import companiesData from "../db/company.json";
import propertiesSeed from "../db/property.json"; // kalau mau pakai sebagai seed
import { toast } from "react-toastify";

type User = {
  id: number;
  email: string;
  username: string;
  password: string;
};

type Company = {
  id: number;
  name: string;
  phone: string;
  mailingAddress: string;
  returnAddress: string;
  sameAddress: boolean;
  ownerName: string;
  ownerEmail: string;
  userId: number;
};

type Property = {
  id: number;
  name: string;
  type: string;
  phone: string;
  mailingAddress: string;
  returnAddress: string;
  sameAddress: boolean;
  companyId: number;
};

const propertyTypes = ["kos", "ruko", "gudang", "kantor", "lainnya"];

const PropertySetup: React.FC = () => {
  const navigate = useNavigate();

  // --- cek user login ---
  const currentUser: User | null = (() => {
    try {
      const raw = localStorage.getItem("currentUser");
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  })();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const allCompanies = companiesData as Company[];

  // hanya company milik user login
  const userCompanies = useMemo(
    () => allCompanies.filter((c) => c.userId === currentUser.id),
    [allCompanies, currentUser.id]
  );

  type FormState = {
    name: string;
    type: string;
    companyId: string; // disimpan sebagai string untuk binding <select>
    ownerName: string;
    returnAddress: string;
    sameAsCompany: boolean;
    sameAsMailing: boolean;
  };

  const [form, setForm] = useState<FormState>({
    name: "",
    type: "",
    companyId: "",
    ownerName: "",
    returnAddress: "",
    sameAsCompany: false,
    sameAsMailing: false,
  });

  const selectedCompany = userCompanies.find(
    (c) => c.id === Number(form.companyId)
  );

  // mailingAddress property akan diambil dari company yang dipilih
  const mailingAddress = selectedCompany?.mailingAddress ?? "";

  const handleChange =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = e.target.value;
      setForm((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const handleCheckbox =
    (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const checked = e.target.checked;
      setForm((prev) => ({
        ...prev,
        [field]: checked,
        // jika "all the data here is the same as company":
        ...(field === "sameAsCompany" && checked && selectedCompany
          ? {
              ownerName: selectedCompany.ownerName,
              // return address ikut mailing company jika juga sameAsMailing
              returnAddress: prev.sameAsMailing
                ? selectedCompany.mailingAddress
                : prev.returnAddress,
            }
          : {}),
        // jika "same as mailing address" diaktifkan:
        ...(field === "sameAsMailing" && checked && selectedCompany
          ? {
              returnAddress: selectedCompany.mailingAddress,
            }
          : {}),
      }));
    };

  // kalau user ganti company, dan checkbox-2 aktif, kita sesuaikan nilai terkait
  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const companyId = e.target.value;
    const newCompany = userCompanies.find((c) => c.id === Number(companyId));

    setForm((prev) => ({
      ...prev,
      companyId,
      ...(prev.sameAsCompany && newCompany
        ? { ownerName: newCompany.ownerName }
        : {}),
      ...(prev.sameAsMailing && newCompany
        ? { returnAddress: newCompany.mailingAddress }
        : {}),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCompany) {
      toast.error("Please select a company first.");
      return;
    }

    if (!form.name || !form.type) {
      toast.error("Please fill in property name and type.");
      return;
    }

    const finalReturnAddress = form.sameAsMailing
      ? mailingAddress
      : form.returnAddress;

    const newProperty: Property = {
      id: Date.now(), // simple id
      name: form.name,
      type: form.type,
      phone: selectedCompany.phone,
      mailingAddress: mailingAddress,
      returnAddress: finalReturnAddress,
      sameAddress: form.sameAsMailing,
      companyId: selectedCompany.id,
    };

    // Di sini kamu bisa menyimpan ke localStorage (mirip users)
    // Misal:
    const existing = localStorage.getItem("properties");
    const localProps: Property[] = existing ? JSON.parse(existing) : [];

    const merged = [
      ...(propertiesSeed as Property[]),
      ...localProps,
      newProperty,
    ];
    localStorage.setItem("properties", JSON.stringify(merged));

    toast.success("Property created successfully.");
    navigate(-1); // kembali ke halaman sebelumnya (Manage Properties)
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex justify-center px-4 py-10">
      {/* Logo */}
      <div className="absolute top-6 left-6">
        <span className="tracking-[0.3em] text-xl font-semibold">TAXAVA</span>
      </div>

      <div className="w-full max-w-4xl pt-8">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-10">
          Property Setup
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LEFT COLUMN */}
            <div className="space-y-4">
              {/* Property name */}
              <div className="flex items-center bg-zinc-800 rounded-2xl px-4 py-3">
                <CaseSensitive className="w-5 h-5 text-zinc-400 mr-3" />
                <input
                  type="text"
                  placeholder="Enter property name"
                  value={form.name}
                  onChange={handleChange("name")}
                  className="flex-1 bg-transparent outline-none text-sm md:text-base placeholder:text-zinc-500"
                />
              </div>

              {/* Property type */}
              <div className="relative bg-zinc-800 rounded-2xl px-4 py-3 flex items-center">
                <span className="text-zinc-400 mr-3">
                  <CaseSensitive className="w-5 h-5" />
                </span>
                <select
                  value={form.type}
                  onChange={handleChange("type")}
                  className="flex-1 bg-transparent outline-none text-sm md:text-base appearance-none pr-6"
                >
                  <option value="" disabled>
                    Select property type
                  </option>
                  {propertyTypes.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-4" />
              </div>

              {/* Select company */}
              <div className="relative bg-zinc-800 rounded-2xl px-4 py-3 flex items-center">
                <span className="text-zinc-400 mr-3">
                  <CaseSensitive className="w-5 h-5" />
                </span>
                <select
                  value={form.companyId}
                  onChange={handleCompanyChange}
                  className="flex-1 bg-transparent outline-none text-sm md:text-base appearance-none pr-6"
                >
                  <option value="" disabled>
                    Select company
                  </option>
                  {userCompanies.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-4" />
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-4">
              {/* Checkbox: same as company */}
              <label className="flex items-center gap-2 text-sm text-zinc-200">
                <input
                  type="checkbox"
                  checked={form.sameAsCompany}
                  onChange={handleCheckbox("sameAsCompany")}
                  className="w-4 h-4 rounded border-zinc-500 bg-zinc-800"
                />
                <span>all the data here is the same as company</span>
              </label>

              {/* Owner name */}
              <div className="flex items-center bg-zinc-800 rounded-2xl px-4 py-3">
                <CaseSensitive className="w-5 h-5 text-zinc-400 mr-3" />
                <input
                  type="text"
                  placeholder="Enter owner name"
                  value={form.ownerName}
                  onChange={handleChange("ownerName")}
                  className="flex-1 bg-transparent outline-none text-sm md:text-base placeholder:text-zinc-500"
                />
              </div>

              {/* Return address */}
              <div className="flex items-center bg-zinc-800 rounded-2xl px-4 py-3">
                <CaseSensitive className="w-5 h-5 text-zinc-400 mr-3" />
                <input
                  type="text"
                  placeholder="Enter package return address"
                  value={form.returnAddress}
                  onChange={handleChange("returnAddress")}
                  disabled={form.sameAsMailing && !!selectedCompany}
                  className="flex-1 bg-transparent outline-none text-sm md:text-base placeholder:text-zinc-500 disabled:text-zinc-500"
                />
              </div>

              {/* Checkbox: same as mailing address */}
              <label className="flex items-center gap-2 text-sm text-zinc-200">
                <input
                  type="checkbox"
                  checked={form.sameAsMailing}
                  onChange={handleCheckbox("sameAsMailing")}
                  className="w-4 h-4 rounded border-zinc-500 bg-zinc-800"
                />
                <span>same as mailing address</span>
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-6 pt-6">
            <button
              type="submit"
              className="px-10 py-3 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 text-base font-semibold shadow-lg hover:opacity-95 active:translate-y-[1px] transition"
            >
              Add Property
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-10 py-3 rounded-full bg-red-500 hover:bg-red-400 text-base font-semibold shadow-lg active:translate-y-[1px] transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PropertySetup;
