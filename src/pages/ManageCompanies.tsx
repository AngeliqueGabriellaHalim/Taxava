import React, { useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { getCompaniesByUser } from "../utils/getCompany";
import { Phone, MapPinHouse, UserRound, Search } from "lucide-react";

import Navbar from "../component/Navbar";

type User = {
  id: number;
  email: string;
  username: string;
  password: string;
};

const ManageCompanies: React.FC = () => {
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const navigate = useNavigate();

  // ----- ambil user yang sedang login dari localStorage -----
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

  const userCompanies = getCompaniesByUser(currentUser.id);

  //search and sort
  const filteredCompanies = useMemo(() => {
    const s = search.toLowerCase().trim();
    let result = userCompanies.filter((c) => c.name.toLowerCase().includes(s));
    result = result.sort((a, b) =>
      sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );
    return result;
  }, [userCompanies, search, sortAsc]);

  const handleEdit = (id: number) => {
    navigate(`/companies/${id}/edit`);
  };

  const handleAdd = () => {
    navigate("/company-setup");
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <div className="flex justify-center px-4 py-8">
        <div className="w-full max-w-5xl pt-15">
          {/* Logo (tetap seperti semula) */}
          <div className="mb-6 justify-start">
            <span className="tracking-[0.3em] text-xl font-semibold">
              TAXAVA
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Manage Companies
          </h1>

          {/* Search bar */}
          <div className="mb-8">
            <label
              htmlFor="company-search"
              className="block text-sm text-zinc-300 mb-2"
            >
              Search Company
            </label>

            <div className="flex items-center gap-3 bg-zinc-800 rounded-full px-4 py-3 shadow-md">
              <span className="text-zinc-400 text-xl ">
                <Search />
              </span>
              <input
                id="company-search"
                type="text"
                placeholder="Type company name…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent outline-none text-lg placeholder:text-zinc-500"
              />

              <button
                type="button"
                onClick={() => setSortAsc((prev) => !prev)}
                className="rounded-full border border-zinc-600 px-3 py-1 text-xs uppercase tracking-wide text-zinc-300 hover:bg-zinc-700 transition"
              >
                {sortAsc ? "A → Z" : "Z → A"}
              </button>
            </div>
          </div>

          {/* List title */}
          <h2 className="text-lg font-semibold mb-4">List of Company</h2>

          {/* Company cards */}
          <div className="space-y-4 mb-10">
            {filteredCompanies.length === 0 && (
              <div className="text-zinc-400 text-sm">No companies found.</div>
            )}

            {filteredCompanies.map((company) => (
              <div
                key={company.id}
                className="bg-zinc-800 rounded-2xl p-4 md:p-5 shadow-lg border border-zinc-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                {/* Info */}
                <div className="space-y-1">
                  <h3 className="text-2xl font-semibold">{company.name}</h3>
                  <p className="text-m text-zinc-300 flex gap-2">
                    <Phone className="w-4" /> {company.phone}
                  </p>
                  <p className="text-m text-zinc-300 flex gap-2">
                    <MapPinHouse className="w-4" />
                    {company.mailingAddress}
                  </p>
                  <p className="text-m text-zinc-300 flex gap-2">
                    <UserRound className="w-4" />
                    Owner: {company.ownerName}
                  </p>
                </div>

                {/* Action */}
                <div className="flex md:flex-col gap-2 md:items-end">
                  <button
                    type="button"
                    onClick={() => handleEdit(company.id)}
                    className="px-5 py-2 rounded-full bg-indigo-500 hover:bg-indigo-400 text-sm font-semibold shadow-md transition"
                  >
                    Edit Company
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Company */}
          <div className="mt-4 mb-10 pb-6 pt-4 border-t border-zinc-800 bg-zinc-900/60 sticky bottom-0">
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleAdd}
                className="px-10 py-3 rounded-full bg-indigo-500 hover:bg-indigo-400 text-base font-semibold shadow-lg transition"
              >
                Add Company
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCompanies;
