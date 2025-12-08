import React, { useMemo, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../component/Navbar";
import companiesSeed from "../db/company.json";
import propertiesSeed from "../db/property.json";

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  hasOnboarded?: boolean;
}

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

interface Property {
  id: number;
  name: string;
  type: string;
  phone: string;
  mailingAddress: string;
  returnAddress: string;
  sameAddress: boolean;
  companyId: number;
}

const propertyTypes = ["kos", "ruko", "gudang", "kantor", "lainnya"];

const PropertySetup: React.FC = () => {
  const navigate = useNavigate();

  const getCurrentUser = (): User | null => {
    const userStr = localStorage.getItem("currentUser");
    return userStr ? JSON.parse(userStr) : null;
  };

  const loadAllCompanies = (): Company[] => {
    const seed = companiesSeed as Company[];
    const storedRaw = localStorage.getItem("companies");
    const stored: Company[] = storedRaw ? JSON.parse(storedRaw) : [];

    const map = new Map<number, Company>();
    seed.forEach((c) => map.set(c.id, c));
    stored.forEach((c) => map.set(c.id, c));

    return Array.from(map.values());
  };

  const loadAllProperties = (): Property[] => {
    const seed = propertiesSeed as Property[];
    const storedRaw = localStorage.getItem("properties");
    const stored: Property[] = storedRaw ? JSON.parse(storedRaw) : [];

    const map = new Map<number, Property>();
    seed.forEach((p) => map.set(p.id, p));
    stored.forEach((p) => map.set(p.id, p));

    return Array.from(map.values());
  };

  const saveProperties = (properties: Property[]) => {
    localStorage.setItem("properties", JSON.stringify(properties));
  };

  const currentUser = getCurrentUser();
  if (!currentUser) {
    toast.error("Please log in again.");
    return <Navigate to="/login" replace />;
  }

  const allCompanies = loadAllCompanies();

  const userCompanies = useMemo(
    () => allCompanies.filter((c) => c.userId === currentUser.id),
    [allCompanies, currentUser.id]
  );

  const [propertyName, setPropertyName] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [companyId, setCompanyId] = useState<string>("");

  const [ownerName, setOwnerName] = useState("");
  const [returnAddress, setReturnAddress] = useState("");
  const [sameAsMailing, setSameAsMailing] = useState(false);
  const [sameAsCompany, setSameAsCompany] = useState(false);

  const selectedCompany = userCompanies.find((c) => c.id === Number(companyId));
  const mailingAddress = selectedCompany?.mailingAddress ?? "";

  const handleSameAsCompany = () => {
    const checked = !sameAsCompany;
    setSameAsCompany(checked);

    if (checked && selectedCompany) {
      setOwnerName(selectedCompany.ownerName);
      if (sameAsMailing) {
        setReturnAddress(selectedCompany.mailingAddress);
      }
    }
  };

  const handleSameAsMailing = () => {
    const checked = !sameAsMailing;
    setSameAsMailing(checked);

    if (checked && selectedCompany) {
      setReturnAddress(selectedCompany.mailingAddress);
    }
  };

  const handleCompanyChange = (value: string) => {
    setCompanyId(value);
    const newCompany = userCompanies.find((c) => c.id === Number(value));

    if (!newCompany) return;

    if (sameAsCompany) {
      setOwnerName(newCompany.ownerName);
    }
    if (sameAsMailing) {
      setReturnAddress(newCompany.mailingAddress);
    }
  };

  const validateData = () => {
    if (!propertyName || !propertyType || !companyId) {
      toast.error("Please fill property name, type, and company.");
      return false;
    }
    if (!ownerName) {
      toast.error("Please fill owner name.");
      return false;
    }
    if (!sameAsMailing && !returnAddress) {
      toast.error(
        "Please fill return address or check 'Same as mailing address'."
      );
      return false;
    }
    if (!selectedCompany) {
      toast.error("Selected company is not valid.");
      return false;
    }
    return true;
  };

  const handleAddProperty = () => {
    if (!validateData() || !selectedCompany) return;

    const allProps = loadAllProperties();
    const newId =
      allProps.length > 0 ? Math.max(...allProps.map((p) => p.id)) + 1 : 1;

    const finalReturnAddress = sameAsMailing
      ? selectedCompany.mailingAddress
      : returnAddress;

    const newProperty: Property = {
      id: newId,
      name: propertyName,
      type: propertyType,
      phone: selectedCompany.phone,
      mailingAddress: selectedCompany.mailingAddress,
      returnAddress: finalReturnAddress,
      sameAddress: sameAsMailing,
      companyId: selectedCompany.id,
    };

    const localRaw = localStorage.getItem("properties");
    const localProps: Property[] = localRaw ? JSON.parse(localRaw) : [];
    const updated = [...localProps, newProperty];

    saveProperties(updated);

    console.log("Saved property:", newProperty);
    toast.success(`Property '${propertyName}' added successfully!`);

    setPropertyName("");
    setPropertyType("");
    setCompanyId("");
    setOwnerName("");
    setReturnAddress("");
    setSameAsMailing(false);
    setSameAsCompany(false);
  };

  const handleFinishSetup = () => {
    navigate("/manage-properties");
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col">
      <Navbar />

      <div className="min-h-screen bg-neutral-900 text-white px-6 py-14 flex justify-center">
        <div className="bg-neutral-800/50 rounded-2xl shadow-2xl w-full max-w-5xl p-10">
          <div className="flex justify-between items-center mb-12">
            <div className="text-xl tracking-[0.3em] font-semibold">TAXAVA</div>

            <h1 className="text-3xl font-bold">Property Setup</h1>

            <button
              onClick={handleAddProperty}
              className="bg-violet-500 px-5 py-2 rounded-full text-sm font-semibold shadow-lg hover:opacity-90"
            >
              Add Property
            </button>
          </div>

          <div className="grid grid-cols-2 gap-x-10 mb-20">
            <div className="col-span-2 mb-8">
              <label className="block mb-2 font-semibold">
                Enter property name
              </label>
              <input
                type="text"
                value={propertyName}
                onChange={(e) => setPropertyName(e.target.value)}
                placeholder="Enter property name"
                className="bg-neutral-800 w-full p-3 rounded-lg"
              />
            </div>

            <div className="flex flex-col gap-6">
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
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

              <select
                value={companyId}
                onChange={(e) => handleCompanyChange(e.target.value)}
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

            <div className="flex flex-col gap-6">
              <label className="flex items-center text-sm gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sameAsCompany}
                  onChange={handleSameAsCompany}
                />
                All the data here is the same as company
              </label>

              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="Enter owner name"
                className="bg-neutral-800 w-full p-3 rounded-lg"
              />

              <input
                type="text"
                value={returnAddress}
                onChange={(e) => setReturnAddress(e.target.value)}
                placeholder="Enter package return address"
                disabled={sameAsMailing}
                className={`w-full p-3 rounded-lg ${
                  sameAsMailing
                    ? "bg-neutral-700 cursor-not-allowed"
                    : "bg-neutral-800"
                }`}
              />

              <label className="flex items-center text-sm gap-2 cursor-pointer mt-2">
                <input
                  type="checkbox"
                  checked={sameAsMailing}
                  onChange={handleSameAsMailing}
                />
                Same as mailing address
              </label>
            </div>
          </div>

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

export default PropertySetup;
