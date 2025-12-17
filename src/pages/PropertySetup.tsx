import React, { useState, useMemo } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import propertiesDB from "../db/property.json";
import { getCompaniesByUser } from "../utils/getCompany";
import { toast } from "react-toastify";
import Navbar from "../component/Navbar";

type User = {
  id: number;
  email: string;
  username: string;
  password: string;
};

type Property = {
  id: number;
  name: string;
  type: string;
  owner: string;
  returnAddress: string;
  sameAddress: boolean;
  companyId: number;
};

const propertyTypes = ["Kos", "Ruko", "Gudang", "Kantor", "Lainnya"];

const getNextPropertyId = (): number => {
  // Ambil semua properties (dari JSON dan Local Storage)
  const existingLocal = localStorage.getItem("properties");
  const localProps: Property[] = existingLocal ? JSON.parse(existingLocal) : [];

  const allProps: Property[] = [...(propertiesDB as Property[]), ...localProps];

  // Cari ID terbesar
  const maxId = allProps.reduce(
    (max, property) => (property.id > max ? property.id : max),
    0
  );

  return maxId + 1;
};

type FormState = {
  name: string;
  type: string;
  companyId: string;
  ownerName: string;
  returnAddress: string;
  sameAsCompany: boolean;
  sameAsMailing: boolean;
};

const PropertySetup: React.FC = () => {
  const navigate = useNavigate();

  const [formError, setFormError] = useState("");
  const [form, setForm] = useState<FormState>({
    name: "",
    type: "",
    companyId: "",
    ownerName: "",
    returnAddress: "",
    sameAsCompany: false,
    sameAsMailing: false,
  });

  // cek user login
  const currentUser: User | null = (() => {
    try {
      const raw = localStorage.getItem("currentUser");
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  })();

  const userCompanies = useMemo(() => {
    if (!currentUser) return [];
    return getCompaniesByUser(currentUser.id);
  }, [currentUser]);

  const selectedCompany = useMemo(() => {
    return userCompanies.find((c) => c.id === Number(form.companyId));
  }, [userCompanies, form.companyId]);

  // mailingAddress property akan diambil dari company yang dipilih
  const mailingAddress = selectedCompany?.mailingAddress ?? "";

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

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

      //if havent selected company
      if (
        checked &&
        (field === "sameAsCompany" || field === "sameAsMailing") &&
        !selectedCompany
      ) {
        setFormError("Please select a company first.");
        return;
      }

      // clear error if valid
      setFormError("");

      setForm((prev) => ({
        ...prev,
        [field]: checked,

        ...(field === "sameAsCompany" && checked && selectedCompany
          ? {
              ownerName: selectedCompany.ownerName,
              returnAddress: "Same as Company Mailing Address",
              sameAsMailing: true,
            }
          : {}),

        ...(field === "sameAsMailing" && checked && selectedCompany
          ? {
              returnAddress: "Same as Company Mailing Address",
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
      setFormError("Please select a company first.");
      return;
    }

    if (!form.name || !form.type) {
      setFormError("Please fill in property name and type.");
      return;
    }

    if (form.name.length >= 15) {
      setFormError("Company name maximum 15 characters.");
      return false;
    }
    if (form.ownerName.length >= 15) {
      setFormError("Owner name maximum 15 characters.");
      return false;
    }

    // Dapatkan ID baru
    const newId = getNextPropertyId();

    const finalReturnAddress = form.sameAsMailing
      ? mailingAddress
      : form.returnAddress;

    const newProperty: Property = {
      id: newId, // Menggunakan ID baru
      name: form.name,
      type: form.type,
      owner: form.ownerName,
      returnAddress: finalReturnAddress,
      sameAddress: form.sameAsMailing,
      companyId: selectedCompany.id,
    };

    // menyimpan ke localStorage
    const existing = localStorage.getItem("properties");
    const localProps: Property[] = existing ? JSON.parse(existing) : [];

    const mergedLocal = [...localProps, newProperty];
    localStorage.setItem("properties", JSON.stringify(mergedLocal)); // Hanya menyimpan data Local

    toast.success("Property created successfully.");
    navigate(-1); // kembali ke halaman sebelumnya (Manage Properties)
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col">
      {/* Navbar */}
      <Navbar />

      <div className="min-h-screen bg-neutral-900 text-white px-6 py-14 flex justify-center">
        {/* Card utama */}
        <div className="bg-neutral-800/50 rounded-2xl shadow-2xl w-full max-w-5xl p-10 relative">
          {/* LOGO */}
          <div className="text-xl tracking-[0.3em] font-semibold">TAXAVA</div>

          {/* HEADER */}
          <div className="flex items-center justify-between mb-12">
            {/* Dummy kiri */}
            <div className="w-32 opacity-0">TAXAVA</div>

            {/* Judul di tengah */}
            <h1 className="text-3xl font-bold text-center">Property Setup</h1>

            <div className="w-32 opacity-0"></div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-2 gap-x-10 mb-20"
          >
            {formError && (
              <div className="col-span-2 mb-6 rounded-lg bg-red-600/20 border border-red-600 text-red-400 px-4 py-3 text-sm">
                {formError}
              </div>
            )}

            {/* LEFT COLUMN */}
            <div className="flex flex-col gap-6">
              {/* Property Name */}
              <input
                type="text"
                placeholder="Enter property name"
                value={form.name}
                onChange={handleChange("name")}
                className="bg-neutral-800 w-full p-3 rounded-lg"
              />

              {/* Property Type */}
              <select
                value={form.type}
                onChange={handleChange("type")}
                className="bg-neutral-800 w-full p-3 rounded-lg"
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

              {/* Select Company */}
              <select
                value={form.companyId}
                onChange={handleCompanyChange}
                className="bg-neutral-800 w-full p-3 rounded-lg"
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
            </div>

            {/* RIGHT COLUMN */}
            <div className="flex flex-col gap-6">
              {/* Same as company */}
              <label className="flex items-center text-sm gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.sameAsCompany}
                  onChange={handleCheckbox("sameAsCompany")}
                />
                All the data here is the same as company
              </label>

              {/* Owner name */}
              <input
                type="text"
                placeholder="Enter owner name"
                value={form.ownerName}
                disabled={form.sameAsCompany}
                onChange={handleChange("ownerName")}
                className={`w-full p-3 rounded-lg ${
                  form.sameAsCompany
                    ? "bg-neutral-700 cursor-not-allowed"
                    : "bg-neutral-800"
                }`}
              />

              {/* Return address */}
              <input
                type="text"
                placeholder="Enter package return address"
                value={form.returnAddress}
                disabled={form.sameAsMailing}
                onChange={handleChange("returnAddress")}
                className={`w-full p-3 rounded-lg ${
                  form.sameAsMailing
                    ? "bg-neutral-700 cursor-not-allowed"
                    : "bg-neutral-800"
                }`}
              />

              {/* Same as mailing */}
              <label className="flex items-center text-sm gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.sameAsMailing}
                  onChange={handleCheckbox("sameAsMailing")}
                />
                Same as mailing address
              </label>
            </div>
          </form>

          {/* BOTTOM BUTTONS */}
          <div className="flex justify-center gap-8">
            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-violet-600 px-8 py-3 rounded-full font-semibold hover:opacity-90"
            >
              Add Property
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="bg-red-600 px-8 py-3 rounded-full font-semibold hover:bg-red-500"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertySetup;
