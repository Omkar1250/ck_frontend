import React from "react";
import { X } from "lucide-react";

const SearchInput = ({ value, onChange, placeholder = "Search...", onClear }) => {
  return (
    <div className="flex justify-center my-4 relative w-full max-w-md mx-auto">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border border-gray-300 p-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
