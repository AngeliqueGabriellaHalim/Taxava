import React, { useEffect, useMemo, useState } from "react";
import { CaseSensitive, ChevronDown } from "lucide-react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import companiesSeed from "../db/company.json";
import propertiesSeed from "../db/property.json";
import Navbar from "../component/Navbar";

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
  ownerName: string;
};

const propertyTypes = ["kos", "ruko", "gudang", "kantor", "lainnya"];

const loadAllCompanies = (): Company[] => {
  const seed = companiesSeed as Company[];
  const localRaw = localStorage.getItem("companies");
  const localCompanies: Company[] = localRaw ? JSON.parse(localRaw) : [];

  const map = new Map<number, Company>();
  seed.forEach((c) => map.set(c.id, c));
  localCompanies.forEach((c) => map.set(c.id, c));

  return Array.from(map.values());
};

const loadAllProperties = (): Property[] => {
  const seed = propertiesSeed as Property[];
  const localRaw = localStorage.getItem("properties");
  const localProps: Property[] = localRaw ? JSON.parse(localRaw) : [];

  const map = new Map<number, Property>();
  seed.forEach((p) => map.set(p.id, p));
  localProps.forEach((p) => map.set(p.id, p));

  return Array.from(map.values());
};

const EditProperty: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const currentUser = (() => {
    try {
      const raw = localStorage.getItem("currentUser");
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  })();

  if (!currentUser) return <Navigate to="/login" replace />;

  const allCompanies = loadAllCompanies();
  const allProperties = loadAllProperties();
  const propertyId = Number(id);
  const property = allProperties.find((p) => p.id === propertyId);

  const userCompanies = useMemo(
    () => allCompanies.filter((c) => c.userId === currentUser.id),
    [allCompanies, currentUser]
  );

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

  useEffect(() => {
    setForm({
      name: property.name,
      type: property.type,
      companyId: String(property.companyId),
      ownerName: property.ownerName,
      returnAddress: property.returnAddress,
      sameAsCompany: false,
      sameAsMailing: property.sameAddress,
      error: "",
    });
  }, []);

  const selectedCompany = userCompanies.find(
    (c) => c.id === Number(form.companyId)
  );

  const mailingAddress = selectedCompany?.mailingAddress ?? "";

  const handleChange =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm((prev) => ({
        ...prev,
        [field]: e.target.value,
        error: "",
      }));
    };

  const handleCheckbox =
    (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const checked = e.target.checked;

      if (field === "sameAsCompany") {
        return setForm((prev) => ({
          ...prev,
          sameAsCompany: checked,
          ownerName:
            checked && selectedCompany
              ? selectedCompany.ownerName
              : prev.ownerName,
        }));
      }

      if (field === "sameAsMailing") {
        return setForm((prev) => ({
          ...prev,
          sameAsMailing: checked,
          returnAddress: checked ? mailingAddress : prev.returnAddress,
        }));
      }
    };

  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCompanyId = e.target.value;
    const newCompany = userCompanies.find((c) => c.id === Number(newCompanyId));

    setForm((prev) => ({
      ...prev,
      companyId: newCompanyId,
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

    if (!selectedCompany)
      return setForm((prev) => ({
        ...prev,
        error: "Please select a company.",
      }));

    if (!form.name || !form.type)
      return setForm((prev) => ({
        ...prev,
        error: "Please fill in property name and type.",
      }));

    const finalReturn = form.sameAsMailing
      ? selectedCompany.mailingAddress
      : form.returnAddress;

    const updated: Property = {
      ...property,
      name: form.name,
      type: form.type,
      mailingAddress: selectedCompany.mailingAddress,
      returnAddress: finalReturn,
      sameAddress: form.sameAsMailing,
      companyId: selectedCompany.id,
      ownerName: form.ownerName,
    };

    const updatedList = allProperties.map((p) =>
      p.id === updated.id ? updated : p
    );

    localStorage.setItem("properties", JSON.stringify(updatedList));

    toast.success("Property updated successfully!");
    navigate("/manage-properties");
  };

  const handleCancel = () => navigate("/manage-properties");

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col">
      <Navbar />

      <div className="min-h-screen bg-zinc-900 text-white flex justify-center px-4 py-10">
        <div className="w-full max-w-4xl pt-8">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">
            Edit Property
          </h1>

          <div className="mb-6">
            <p className="text-sm text-zinc-300 mb-2">Error Banner</p>
            <div className="bg-zinc-800 rounded-2xl px-4 py-3 min-h-[48px] flex items-center text-sm text-red-300">
              {form.error ? (
                form.error
              ) : (
                <span className="text-zinc-500">No errors.</span>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center bg-zinc-800 rounded-2xl px-4 py-3">
                  <CaseSensitive className="w-5 h-5 text-zinc-400 mr-3" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={handleChange("name")}
                    placeholder="Enter property name"
                    className="flex-1 bg-transparent outline-none"
                  />
                </div>

                <div className="relative flex items-center bg-zinc-800 rounded-2xl px-4 py-3">
                  <CaseSensitive className="w-5 h-5 text-zinc-400 mr-3" />
                  <select
                    value={form.type}
                    onChange={handleChange("type")}
                    className="flex-1 bg-transparent outline-none appearance-none pr-6"
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

                <div className="relative flex items-center bg-zinc-800 rounded-2xl px-4 py-3">
                  <CaseSensitive className="w-5 h-5 text-zinc-400 mr-3" />
                  <select
                    value={form.companyId}
                    onChange={handleCompanyChange}
                    className="flex-1 bg-transparent outline-none appearance-none pr-6"
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

              <div className="space-y-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.sameAsCompany}
                    onChange={handleCheckbox("sameAsCompany")}
                  />
                  Same owner as company
                </label>

                <div
                  className={`flex items-center bg-zinc-800 rounded-2xl px-4 py-3 ${
                    form.sameAsCompany ? "opacity-60" : ""
                  }`}
                >
                  <CaseSensitive className="w-5 h-5 text-zinc-400 mr-3" />
                  <input
                    type="text"
                    value={form.ownerName}
                    onChange={handleChange("ownerName")}
                    placeholder="Enter owner name"
                    disabled={form.sameAsCompany}
                    className={`flex-1 bg-transparent outline-none ${
                      form.sameAsCompany ? "cursor-not-allowed" : ""
                    }`}
                  />
                </div>

                <div
                  className={`flex items-center bg-zinc-800 rounded-2xl px-4 py-3 ${
                    form.sameAsMailing ? "opacity-60" : ""
                  }`}
                >
                  <CaseSensitive className="w-5 h-5 text-zinc-400 mr-3" />
                  <input
                    type="text"
                    value={form.returnAddress}
                    onChange={handleChange("returnAddress")}
                    placeholder="Enter return address"
                    disabled={form.sameAsMailing}
                    className={`flex-1 bg-transparent outline-none ${
                      form.sameAsMailing ? "cursor-not-allowed" : ""
                    }`}
                  />
                </div>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.sameAsMailing}
                    onChange={handleCheckbox("sameAsMailing")}
                  />
                  Same as mailing address
                </label>
              </div>
            </div>

            <div className="flex justify-center gap-6 pt-6">
              <button
                type="submit"
                className="px-10 py-3 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
              >
                Save
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="px-10 py-3 rounded-full bg-red-500 hover:bg-red-400"
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
