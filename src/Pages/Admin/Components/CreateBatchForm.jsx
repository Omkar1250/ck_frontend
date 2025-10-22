import React, { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { createBatch } from "../../../operations/adminApi";
import { FiHash, FiFileText, FiToggleLeft } from "react-icons/fi";

export default function CreateBatchForm({ closeModal }) {
  const [batch_code, setBatchCode] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("active");
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!batch_code.trim()) return toast.error("Batch code is required");

    const payload = { batch_code, description, status };
    setLoading(true);
    const res = await createBatch(token, payload);
    setLoading(false);

    if (res?.success) {
      toast.success("Batch created successfully");
      setBatchCode("");
      setDescription("");
      setStatus("active");
      closeModal();
    }
  };

  return (
    <form
      onSubmit={handleCreate}
      className="space-y-5 px-4 pb-6 pt-2 w-[95%] max-w-md mx-auto"
    >
      {/* Title */}
      <h2 className="text-xl font-semibold text-center mb-1">
        Create New Batch
      </h2>
      <div className="w-16 h-[3px] bg-btnColor mx-auto rounded-full mb-2"></div>

      {/* Batch Code */}
      <div className="relative">
        <FiHash className="absolute left-3 top-3 text-gray-400 text-lg" />
        <input
          type="text"
          placeholder="Batch Code"
          value={batch_code}
          onChange={(e) => setBatchCode(e.target.value)}
          className="border w-full pl-10 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-btnColor transition"
        />
      </div>

      {/* Description */}
      <div className="relative">
        <FiFileText className="absolute left-3 top-3 text-gray-400 text-lg" />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border w-full pl-10 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-btnColor transition"
        />
      </div>

      {/* Status */}
      <div className="relative">
        <FiToggleLeft className="absolute left-3 top-3 text-gray-400 text-lg" />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border w-full pl-10 p-2 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-btnColor transition"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="bg-btnColor text-white p-2 rounded-md w-full hover:bg-opacity-90 transition"
      >
        {loading ? "Creating..." : "Create Batch"}
      </button>
    </form>
  );
}
