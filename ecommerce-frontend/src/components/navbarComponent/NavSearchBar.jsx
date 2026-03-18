import React from "react";
import { useNavigate } from "react-router-dom";
import { MdSearch } from "react-icons/md";
import { useSearch } from "../../context/SearchContext";

const NavSearchBar = () => {
  const { searchQuery, setSearchQuery } = useSearch(); // <--- Get the setter
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate("/products");
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-md">
      <input
        type="text"
        placeholder="Search products..."
        className="w-full rounded-md border border-gray-300 py-2 pl-4 pr-10 text-sm
                   focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} // Updates products instantly
      />
      <button
        type="submit"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition"
      >
        <MdSearch size={20} />
      </button>
    </form>
  );
};

export default NavSearchBar;
