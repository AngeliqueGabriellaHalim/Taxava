import React, { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../component/Navbar";
import { getCompaniesByUser } from "../utils/getCompany";
import type { Company } from "../utils/getCompany";

/* TYPES */

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

const propertyTypes = ["Kos", "Ruko", "Gudang", "Kantor", "Lainnya"];

const EditProperty: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const propertyId = Number(id);

  const currentUser: User | null = (() => {
    try {
      const raw = localStorage.getItem("currentUser");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  const userCompanies: Company[] = currentUser
    ? getCompaniesByUser(currentUser.id)
    : [];

  const properties: Property[] = (() => {
    try {
      const raw = localStorage.getItem("properties");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  })();

  const property = properties.find((p) => p.id === propertyId) ?? null;
  const propertyCompany =
    property && userCompanies.find((c) => c.id === property.companyId);

  const [form, setForm] = useState<FormState | null>(() => {
    if (!property || !propertyCompany) return null;

    return {
      name: property.name,
      type: property.type,
      companyId: String(property.companyId),
      ownerName: property.owner,
      returnAddress: property.returnAddress,
      sameAsCompany: false,
      sameAsMailing: property.sameAddress,
      error: "",
    };
  });

  useEffect(() => {
    if (!currentUser) {
      navigate("/login", { replace: true });
      return;
    }

    if (!property || !propertyCompany) {
      toast.error("Property not found");
      navigate("/manage-properties", { replace: true });
    }
  }, [currentUser, property, propertyCompany, navigate]);

  if (!form) return null;

  const selectedCompany = userCompanies.find(
    (c) => c.id === Number(form.companyId)
  );

  const mailingAddress = selectedCompany?.mailingAddress ?? "";

  const handleChange =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setForm({ ...form, [field]: e.target.value, error: "" });
    };

  const handleCheckbox =
    (field: "sameAsCompany" | "sameAsMailing") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const checked = e.target.checked;

      if (field === "sameAsCompany" && selectedCompany) {
        setForm({
          ...form,
          sameAsCompany: checked,
          ownerName: checked ? "Same as Company" : form.ownerName,
          returnAddress: checked ? "Same as Company" : form.returnAddress,
          error: "",
        });
        return;
      }

      if (field === "sameAsMailing") {
        setForm({
          ...form,
          sameAsMailing: checked,
          returnAddress: checked ? "Same as Company" : form.returnAddress,
          error: "",
        });
      }
    };

  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({
      ...form,
      companyId: e.target.value,
      sameAsCompany: false,
      sameAsMailing: false,
      error: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCompany) {
      setForm({ ...form, error: "Please select a company" });
      return;
    }

    if (
      !form.name ||
      !form.type ||
      !form.ownerName ||
      !form.returnAddress ||
      !form.companyId
    ) {
      setForm({ ...form, error: "Please fill all required fields" });
      return;
    }

    const updated: Property = {
      ...property!,
      name: form.name,
      type: form.type,
      owner: form.ownerName,
      returnAddress: form.sameAsMailing ? mailingAddress : form.returnAddress,
      sameAddress: form.sameAsMailing,
      companyId: selectedCompany.id,
    };

    const next = properties.map((p) => (p.id === updated.id ? updated : p));

    localStorage.setItem("properties", JSON.stringify(next));
    toast.success("Property updated successfully");
    navigate("/manage-properties");
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <Navbar />

      <div className="flex justify-center px-4 py-10">
        <div className="w-full max-w-4xl">
          <h1 className="text-4xl font-bold text-center mb-8">Edit Property</h1>

          {form.error && (
            <div className="mb-6 bg-zinc-800 text-red-300 px-4 py-3 rounded-xl">
              {form.error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* LEFT */}
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Property name"
                  value={form.name}
                  onChange={handleChange("name")}
                  className="w-full bg-zinc-800 p-3 rounded-xl"
                />

                <div className="relative">
                  <select
                    value={form.type}
                    onChange={handleChange("type")}
                    className="w-full bg-zinc-800 p-3 rounded-xl appearance-none"
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
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                </div>

                <div className="relative">
                  <select
                    value={form.companyId}
                    onChange={handleCompanyChange}
                    className="w-full bg-zinc-800 p-3 rounded-xl appearance-none"
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
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                </div>
              </div>

              {/* RIGHT */}
              <div className="space-y-4">
                <label className="flex gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.sameAsCompany}
                    onChange={handleCheckbox("sameAsCompany")}
                  />
                  Same as company owner
                </label>

                <input
                  type="text"
                  value={form.ownerName}
                  disabled={form.sameAsCompany}
                  onChange={handleChange("ownerName")}
                  className="w-full bg-zinc-800 p-3 rounded-xl disabled:bg-zinc-700"
                />

                <input
                  type="text"
                  value={form.returnAddress}
                  disabled={form.sameAsMailing}
                  onChange={handleChange("returnAddress")}
                  className="w-full bg-zinc-800 p-3 rounded-xl disabled:bg-zinc-700"
                />

                <label className="flex gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.sameAsMailing}
                    onChange={handleCheckbox("sameAsMailing")}
                  />
                  Same as mailing address
                </label>
              </div>
            </div>

            <div className="flex justify-center gap-6">
              <button
                type="submit"
                className="px-10 py-3 rounded-full bg-indigo-500 font-semibold"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => navigate("/manage-properties")}
                className="px-10 py-3 rounded-full bg-red-500 font-semibold"
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
