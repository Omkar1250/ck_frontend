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
      className="space-y-5 px-2 pb-4 pt-2 w-full max-w-md mx-auto"
    >
      {/* Title */}
      <h2 className="text-xl font-semibold text-center text-richblack-5">
        Create New Batch
      </h2>
      <div className="w-16 h-[3px] mx-auto rounded-full" style={{ background: 'linear-gradient(90deg, #6473AA, #8B5CF6)' }} />

      {/* Batch Code */}
      <div className="relative">
        <FiHash className="absolute left-3 top-3 text-richblack-400 text-lg" />
        <input
          type="text"
          placeholder="Batch Code"
          value={batch_code}
          onChange={(e) => setBatchCode(e.target.value)}
          className="glass-input w-full pl-10 p-2.5 text-sm"
        />
      </div>

      {/* Description */}
      <div className="relative">
        <FiFileText className="absolute left-3 top-3 text-richblack-400 text-lg" />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="glass-input w-full pl-10 p-2.5 text-sm min-h-[80px] resize-y"
        />
      </div>

      {/* Status */}
      <div className="relative">
        <FiToggleLeft className="absolute left-3 top-3 text-richblack-400 text-lg" />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="glass-input w-full pl-10 p-2.5 text-sm appearance-none cursor-pointer"
        >
          <option value="active" className="bg-richblack-800 text-richblack-5">Active</option>
          <option value="inactive" className="bg-richblack-800 text-richblack-5">Inactive</option>
        </select>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="btn-gradient w-full py-3 rounded-xl text-sm font-medium"
      >
        {loading ? "Creating..." : "Create Batch"}
      </button>
    </form>
  );
}
