import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getCompaniesByUser } from "../utils/getCompany";
import { getPropertiesByUser } from "../utils/getProperty";
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

const EditProperty: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // cek user login
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

  // hanya company milik user login
  const userCompanies = getCompaniesByUser(currentUser.id);

  const loadAllProperties = (): Property[] => {
    const localRaw = localStorage.getItem("properties");
    const localProps: Property[] = localRaw ? JSON.parse(localRaw) : [];

    // Gabungkan seed + local dalam urutan (seed dulu, lalu local)
    const allProps = getPropertiesByUser(currentUser.id);

    // Buat map, yang terakhir akan menimpa yang sebelumnya
    const map = new Map<number, Property>();
    allProps.forEach((p) => map.set(p.id, p));

    return Array.from(map.values());
  };

  const propertyId = Number(id);
  const allProperties = loadAllProperties();
  const property = allProperties.find((p) => p.id === propertyId);

  // kalau property tidak ada atau bukan milik company user, redirect balik
  const propertyCompany = property
    ? userCompanies.find((c) => c.id === property.companyId)
    : undefined;

  if (!property || !propertyCompany) {
    toast.error("Property not found or not accessible.");
    return <Navigate to="/manage-properties" replace />;
  }

  type FormState = {
    name: string;
    type: string;
    companyId: string;
    ownerName: string;
    returnAddress: string;
    sameAsCompany: boolean;
    sameAsMailing: boolean;
    error: string;
  };

  const [form, setForm] = useState<FormState>({
    name: "",
    type: "",
    companyId: "",
    ownerName: "",
    returnAddress: "",
    sameAsCompany: false,
    sameAsMailing: property.sameAddress,
    error: "",
  });

  const initialData = useMemo(
    () => ({
      name: property.name,
      type: property.type,
      companyId: String(property.companyId),
      ownerName: propertyCompany.ownerName,
      returnAddress: property.returnAddress,
      sameAsMailing: property.sameAddress,
    }),
    [propertyId]
  ); // Hanya bergantung pada propertyId

  useEffect(() => {
    setForm({
      name: initialData.name,
      type: initialData.type,
      companyId: initialData.companyId,
      ownerName: initialData.ownerName,
      returnAddress: initialData.returnAddress,
      sameAsCompany: false,
      sameAsMailing: initialData.sameAsMailing,
      error: "",
    });
  }, [initialData]);

  const selectedCompany = userCompanies.find(
    (c) => c.id === Number(form.companyId)
  );
  const mailingAddress = selectedCompany?.mailingAddress ?? "";

  const handleChange =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = e.target.value;
      setForm((prev) => ({
        ...prev,
        [field]: value,
        error: "",
      }));
    };

  const handleCheckbox =
    (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const checked = e.target.checked;
      setForm((prev) => ({
        ...prev,
        [field]: checked,
        error: "",
        ...(field === "sameAsCompany" && checked && selectedCompany
          ? { ownerName: selectedCompany.ownerName }
          : {}),
        ...(field === "sameAsMailing" && checked && selectedCompany
          ? { returnAddress: selectedCompany.mailingAddress }
          : {}),
      }));
    };

  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const companyId = e.target.value;
    const newCompany = userCompanies.find((c) => c.id === Number(companyId));

    setForm((prev) => ({
      ...prev,
      companyId,
      error: "",
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
      setForm((prev) => ({
        ...prev,
        error: "Please select a company.",
      }));
      return;
    }

    if (!form.name || !form.type) {
      setForm((prev) => ({
        ...prev,
        error: "Please fill in property name and type.",
      }));
      return;
    }

    const finalReturnAddress = form.sameAsMailing
      ? mailingAddress
      : form.returnAddress;

    const updated: Property = {
      ...property,
      name: form.name,
      type: form.type,
      owner: form.ownerName,
      returnAddress: finalReturnAddress,
      sameAddress: form.sameAsMailing,
      companyId: selectedCompany.id,
    };

    const existing = loadAllProperties();
    const updatedList = existing.map((p) =>
      p.id === updated.id ? updated : p
    );

    localStorage.setItem("properties", JSON.stringify(updatedList));
    toast.success("Property updated successfully.");
    navigate("/manage-properties");
  };

  const handleCancel = () => {
    navigate("/manage-properties");
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col">
      {/* Navbar */}
      <Navbar />
      <div className="min-h-screen bg-zinc-900 text-white flex justify-center px-4 py-10">
        {/* Logo */}
        <div className="absolute top-6 left-6">
          <span className="tracking-[0.3em] text-xl font-semibold">TAXAVA</span>
        </div>

        <div className="w-full max-w-4xl pt-8">
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">
            Edit Property
          </h1>


          {/* Error Banner */}
          {form.error && (
            <div className="mb-6">
              <p className="text-sm text-zinc-300 mb-2">Error Banner</p>
              <div className="bg-zinc-800 rounded-2xl px-4 py-3 min-h-[48px] flex items-center text-sm text-red-300">
                {form.error}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* LEFT COLUMN */}
              <div className="space-y-4">
                {/* Property name */}
                <div className="flex items-center bg-zinc-800 rounded-2xl px-4 py-3">
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
                  <span className="text-zinc-400 mr-3"></span>
                  <select
                    value={form.type}
                    onChange={handleChange("type")}
                    className="flex-1 bg-neutral-800 outline-none text-sm md:text-base appearance-none pr-6"
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
                  <span className="text-zinc-400 mr-3"></span>
                  <select
                    value={form.companyId}
                    onChange={handleCompanyChange}
                    className="flex-1 bg-neutral-800 outline-none text-sm md:text-base appearance-none pr-6"
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
                Save
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
    </div>
  );
};

export default EditProperty;
