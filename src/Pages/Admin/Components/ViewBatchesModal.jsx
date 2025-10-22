import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { deleteBatch, getAllBatches, updateBatch } from "../../../operations/adminApi";
import { FiEdit, FiTrash2, FiSave, FiX, FiSearch } from "react-icons/fi";

export default function ViewBatchesModal({ closeModal }) {
  const { token } = useSelector((state) => state.auth);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Inline edit state
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ batch_code: "", description: "", status: "active" });

  // Delete confirm state
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [opLoading, setOpLoading] = useState(false);

  // Search / filter
  const [query, setQuery] = useState("");

  const fetchBatches = async () => {
    setLoading(true);
    const res = await getAllBatches(token);
    setBatches(res);
    setLoading(false);
  };

  useEffect(() => {
    fetchBatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const startEdit = (batch) => {
    setEditingId(batch.id);
    setEditForm({
      batch_code: batch.batch_code || "",
      description: batch.description || "",
      status: batch.status || "active",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ batch_code: "", description: "", status: "active" });
  };

  const saveEdit = async (id) => {
    if (!editForm.batch_code.trim()) {
      return toast.error("Batch code is required");
    }
    setOpLoading(true);
    const res = await updateBatch(token, id, editForm);
    setOpLoading(false);
    if (res) {
      await fetchBatches();
      cancelEdit();
    }
  };

  const confirmDelete = async () => {
    if (!confirmDeleteId) return;
    setOpLoading(true);
    const res = await deleteBatch(token, confirmDeleteId);
    setOpLoading(false);
    if (res) {
      await fetchBatches();
      setConfirmDeleteId(null);
    }
  };

  // Filtered list (client-side)
  const filteredBatches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return batches;
    return batches.filter((b) => {
      const code = (b.batch_code || "").toLowerCase();
      const desc = (b.description || "").toLowerCase();
      const stat = (b.status || "").toLowerCase();
      return code.includes(q) || desc.includes(q) || stat.includes(q);
    });
  }, [batches, query]);

  // Status badge (Pill – style 1)
  const StatusBadge = ({ status }) => (
    <span
      className={`px-3 py-1 text-xs font-medium rounded-full ${
        status === "active"
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {status}
    </span>
  );

  return (
    <div className="w-full max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h2 className="text-xl font-semibold text-center sm:text-left">All Batches</h2>

        {/* Search */}
        <div className="w-full sm:w-72 relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search code, description, status"
            className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-gray-300"
          />
        </div>
      </div>

      {/* Body */}
      <div className="bg-white rounded-xl shadow-md p-3 sm:p-4">
        {loading ? (
          <p className="text-center py-8">Loading...</p>
        ) : filteredBatches.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No batches found</p>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block max-h-[60vh] overflow-auto">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 bg-gray-50">
                  <tr className="text-left text-sm text-gray-600">
                    <th className="py-3 px-4 font-medium">Batch Code</th>
                    <th className="py-3 px-4 font-medium">Description</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBatches.map((batch) => {
                    const isEditing = editingId === batch.id;
                    return (
                      <tr
                        key={batch.id}
                        className="border-b last:border-b-0 hover:bg-gray-50/70 transition-colors"
                      >
                        {/* Code */}
                        <td className="py-3 px-4 align-top">
                          {isEditing ? (
                            <input
                              className="w-full border rounded-md p-2"
                              placeholder="Batch Code"
                              value={editForm.batch_code}
                              onChange={(e) =>
                                setEditForm((f) => ({ ...f, batch_code: e.target.value }))
                              }
                            />
                          ) : (
                            <span className="font-semibold">{batch.batch_code}</span>
                          )}
                        </td>

                        {/* Description */}
                        <td className="py-3 px-4 align-top">
                          {isEditing ? (
                            <input
                              className="w-full border rounded-md p-2"
                              placeholder="Description"
                              value={editForm.description}
                              onChange={(e) =>
                                setEditForm((f) => ({ ...f, description: e.target.value }))
                              }
                            />
                          ) : batch.description ? (
                            <span className="text-gray-700">{batch.description}</span>
                          ) : (
                            <span className="text-gray-400 italic">No description</span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4 align-top">
                          {isEditing ? (
                            <select
                              className="w-full border rounded-md p-2"
                              value={editForm.status}
                              onChange={(e) =>
                                setEditForm((f) => ({ ...f, status: e.target.value }))
                              }
                            >
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                            </select>
                          ) : (
                            <StatusBadge status={batch.status} />
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 align-top">
                          <div className="flex items-center justify-end gap-2">
                            {isEditing ? (
                              <>
                                <button
                                  aria-label="Save"
                                  disabled={opLoading}
                                  onClick={() => saveEdit(batch.id)}
                                  className="inline-flex items-center gap-1 px-3 py-2 rounded-md text-white bg-btnColor hover:bg-opacity-90 transition"
                                >
                                  <FiSave className="text-base" />
                                  {opLoading ? "Saving..." : "Save"}
                                </button>
                                <button
                                  aria-label="Cancel"
                                  disabled={opLoading}
                                  onClick={cancelEdit}
                                  className="inline-flex items-center gap-1 px-3 py-2 rounded-md border hover:bg-gray-50 transition"
                                >
                                  <FiX className="text-base" /> Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  aria-label="Edit"
                                  onClick={() => startEdit(batch)}
                                  className="inline-flex items-center gap-1 px-3 py-2 rounded-md border hover:bg-gray-50 transition"
                                >
                                  <FiEdit className="text-base" /> Edit
                                </button>
                                <button
                                  aria-label="Delete"
                                  onClick={() => setConfirmDeleteId(batch.id)}
                                  className="inline-flex items-center gap-1 px-3 py-2 rounded-md border text-red-600 hover:bg-red-50 transition"
                                >
                                  <FiTrash2 className="text-base" /> Delete
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile/Tablet Cards */}
            <div className="md:hidden max-h-[60vh] overflow-y-auto space-y-3 pt-1">
              {filteredBatches.map((batch) => {
                const isEditing = editingId === batch.id;
                return (
                  <div
                    key={batch.id}
                    className="border border-gray-200 rounded-xl p-3 bg-white hover:shadow-sm transition-shadow"
                  >
                    {/* Top row: code + status */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        {isEditing ? (
                          <input
                            className="w-full border rounded-md p-2"
                            placeholder="Batch Code"
                            value={editForm.batch_code}
                            onChange={(e) =>
                              setEditForm((f) => ({ ...f, batch_code: e.target.value }))
                            }
                          />
                        ) : (
                          <p className="font-semibold break-words">{batch.batch_code}</p>
                        )}
                      </div>
                      <div className="shrink-0">
                        {isEditing ? (
                          <select
                            className="border rounded-md p-2"
                            value={editForm.status}
                            onChange={(e) =>
                              setEditForm((f) => ({ ...f, status: e.target.value }))
                            }
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        ) : (
                          <StatusBadge status={batch.status} />
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mt-2">
                      {isEditing ? (
                        <input
                          className="w-full border rounded-md p-2"
                          placeholder="Description"
                          value={editForm.description}
                          onChange={(e) =>
                            setEditForm((f) => ({ ...f, description: e.target.value }))
                          }
                        />
                      ) : batch.description ? (
                        <p className="text-sm text-gray-700">{batch.description}</p>
                      ) : (
                        <p className="text-sm text-gray-400 italic">No description</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="mt-3 flex items-center justify-end gap-2">
                      {isEditing ? (
                        <>
                          <button
                            aria-label="Save"
                            disabled={opLoading}
                            onClick={() => saveEdit(batch.id)}
                            className="inline-flex items-center gap-1 px-3 py-2 rounded-md text-white bg-btnColor hover:bg-opacity-90 transition"
                          >
                            <FiSave className="text-base" />
                            {opLoading ? "Saving..." : "Save"}
                          </button>
                          <button
                            aria-label="Cancel"
                            disabled={opLoading}
                            onClick={cancelEdit}
                            className="inline-flex items-center gap-1 px-3 py-2 rounded-md border hover:bg-gray-50 transition"
                          >
                            <FiX className="text-base" /> Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            aria-label="Edit"
                            onClick={() => startEdit(batch)}
                            className="inline-flex items-center gap-1 px-3 py-2 rounded-md border hover:bg-gray-50 transition"
                          >
                            <FiEdit className="text-base" /> Edit
                          </button>
                          <button
                            aria-label="Delete"
                            onClick={() => setConfirmDeleteId(batch.id)}
                            className="inline-flex items-center gap-1 px-3 py-2 rounded-md border text-red-600 hover:bg-red-50 transition"
                          >
                            <FiTrash2 className="text-base" /> Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Delete confirmation */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <p className="font-semibold text-center text-lg">Delete this batch?</p>
            <p className="text-sm text-center text-gray-600 mt-1">
              This action cannot be undone.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                disabled={opLoading}
                onClick={() => setConfirmDeleteId(null)}
                className="w-1/2 px-3 py-2 rounded-md border hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                disabled={opLoading}
                onClick={confirmDelete}
                className="w-1/2 px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
              >
                {opLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={closeModal}
        className="mt-4 w-full bg-btnColor text-white p-2 rounded-md hover:bg-opacity-90 transition"
      >
        Close
      </button>
    </div>
  );
}
