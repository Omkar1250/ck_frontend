import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { createMainRm, deleteMainRm, updateMainRm } from "../../../operations/adminApi";
import { toast } from "react-hot-toast";
import { FiUser, FiPhone, FiHash, FiKey, FiEye, FiEyeOff, FiUserCheck, FiAtSign } from "react-icons/fi";

export default function CreateRmForm({ closeModal, rm }) {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const isEdit = !!rm;

  useEffect(() => {
    if (isEdit) {
      setValue("name", rm.name || "");
      setValue("personal_number", rm.personal_number || "");
      setValue("ck_number", rm.ck_number || "");
      setValue("userid", rm.userid || "");
      setValue("upi_id", rm.upi_id || "");
      setValue("password", rm.password || "");
      setValue("confirmPassword", rm.password || "");
    }
  }, [rm, setValue]);

  const onSubmit = async (data) => {
    if (data.password && data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("personal_number", data.personal_number);
    formData.append("ck_number", data.ck_number);
    formData.append("userid", data.userid);
    formData.append("upi_id", data.upi_id || "");

    if (data.password) {
      formData.append("password", data.password);
    }

    try {
      setLoading(true);
      if (isEdit) {
        await updateMainRm(token, rm.id, formData);
        toast.success("RM updated successfully");
      } else {
        await createMainRm(token, formData);
        toast.success("RM created successfully");
      }
      closeModal();
    } catch (error) {
      toast.error(`Failed to ${isEdit ? "update" : "create"} RM`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteMainRm(token, rm.id);
      toast.success("RM deleted successfully");
      closeModal();
    } catch (error) {
      toast.error(error.message || "Failed to delete RM");
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ label, name, type = "text", icon: Icon, validation = {} }) => (
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-3 text-gray-400 text-lg" />}
      <input
        type={type}
        placeholder={label}
        {...register(name, validation)}
        className="w-full pl-10 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-btnColor transition"
      />
      {errors[name] && <p className="text-pink-500 text-xs mt-1">{errors[name].message}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 px-4 pb-6 pt-3 w-[95%] max-w-xl mx-auto">
      <h2 className="text-xl font-semibold text-center">{isEdit ? "Update RM" : "Create RM"}</h2>
      <div className="w-16 h-[3px] bg-btnColor mx-auto rounded-full mb-2"></div>

      <div className="grid md:grid-cols-2 gap-4">
        <InputField label="Name" name="name" icon={FiUser} validation={{ required: "Name is required" }} />
        <InputField
          label="Personal Number"
          name="personal_number"
          type="number"
          icon={FiPhone}
          validation={{
            required: "Personal number is required",
            pattern: { value: /^[6-9]\d{9}$/, message: "Enter a valid 10-digit mobile number" }
          }}
        />
        <InputField label="CyberKing Number" name="ck_number" type="number" icon={FiHash} validation={{ required: "CK number is required" }} />
        <InputField label="User ID" name="userid" icon={FiUserCheck} validation={{ required: "User ID is required" }} />
      </div>

      {/* Passwords */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="relative">
          <FiKey className="absolute left-3 top-3 text-gray-400 text-lg" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            {...register("password", !isEdit ? { required: "Password is required" } : {})}
            className="w-full pl-10 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-btnColor transition"
          />
          {errors.password && <p className="text-pink-500 text-xs mt-1">{errors.password.message}</p>}
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 cursor-pointer text-gray-500"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </span>
        </div>

        <div className="relative">
          <FiKey className="absolute left-3 top-3 text-gray-400 text-lg" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm Password"
            {...register("confirmPassword", !isEdit ? { required: "Confirm password is required" } : {})}
            className="w-full pl-10 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-btnColor transition"
          />
          {errors.confirmPassword && <p className="text-pink-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
        </div>
      </div>

      {/* UPI Input */}
      <InputField label="UPI ID (optional)" name="upi_id" icon={FiAtSign} />

      {/* Actions */}
      <div className="flex flex-col md:flex-row gap-3 mt-6">
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-btnColor text-white py-3 rounded-md font-medium hover:bg-opacity-90 transition disabled:opacity-60"
        >
          {loading ? (isEdit ? "Updating..." : "Creating...") : isEdit ? "Update" : "Create"}
        </button>

        {isEdit && (
          <button
            type="button"
            onClick={() => setDeleteModal(true)}
            className="w-full border border-red-500 text-red-600 py-3 rounded-md font-medium hover:bg-red-50 transition"
          >
            Delete
          </button>
        )}

        <button
          type="button"
          onClick={closeModal}
          className="w-full border py-3 rounded-md font-medium hover:bg-gray-50 transition"
        >
          Cancel
        </button>
      </div>

      {/* Custom Delete Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg">
            <p className="font-semibold text-center text-lg">Delete RM?</p>
            <p className="text-sm text-center text-gray-600 mt-1">
              This action cannot be undone.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setDeleteModal(false)}
                className="w-1/2 border py-2 rounded-md hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                disabled={loading}
                onClick={handleDelete}
                className="w-1/2 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
