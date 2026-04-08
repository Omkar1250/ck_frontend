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
  }, [rm, setValue, isEdit]);

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
      {Icon && <Icon className="absolute left-3 top-3 text-richblack-400 text-lg" />}
      <input
        type={type}
        placeholder={label}
        {...register(name, validation)}
        className="glass-input w-full pl-10 p-2.5 text-sm"
      />
      {errors[name] && <p className="text-pink-200 text-xs mt-1">{errors[name].message}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 px-2 pb-4 pt-2 w-full max-w-xl mx-auto">
      <h2 className="text-xl font-semibold text-center text-richblack-5">{isEdit ? "Update RM" : "Create RM"}</h2>
      <div className="w-16 h-[3px] mx-auto rounded-full" style={{ background: 'linear-gradient(90deg, #6473AA, #8B5CF6)' }} />

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
          <FiKey className="absolute left-3 top-3 text-richblack-400 text-lg" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            {...register("password", !isEdit ? { required: "Password is required" } : {})}
            className="glass-input w-full pl-10 pr-10 p-2.5 text-sm"
          />
          <span onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 cursor-pointer text-richblack-400 hover:text-richblack-100 transition-colors">
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </span>
          {errors.password && <p className="text-pink-200 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <div className="relative">
          <FiKey className="absolute left-3 top-3 text-richblack-400 text-lg" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm Password"
            {...register("confirmPassword", !isEdit ? { required: "Confirm password is required" } : {})}
            className="glass-input w-full pl-10 p-2.5 text-sm"
          />
          {errors.confirmPassword && <p className="text-pink-200 text-xs mt-1">{errors.confirmPassword.message}</p>}
        </div>
      </div>

      <InputField label="UPI ID (optional)" name="upi_id" icon={FiAtSign} />

      {/* Actions */}
      <div className="flex flex-col md:flex-row gap-3 mt-6">
        <button
          type="submit"
          disabled={loading}
          className="btn-gradient w-full py-3 rounded-xl text-sm font-medium"
        >
          {loading ? (isEdit ? "Updating..." : "Creating...") : isEdit ? "Update" : "Create"}
        </button>

        {isEdit && (
          <button
            type="button"
            onClick={() => setDeleteModal(true)}
            className="btn-danger w-full py-3 rounded-xl text-sm font-medium"
          >
            Delete
          </button>
        )}

        <button
          type="button"
          onClick={closeModal}
          className="btn-ghost w-full py-3 rounded-xl text-sm font-medium"
        >
          Cancel
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <div className="glass-card p-6 w-full max-w-sm animate-scaleIn">
            <p className="font-semibold text-center text-lg text-richblack-5">Delete RM?</p>
            <p className="text-sm text-center text-richblack-300 mt-1">
              This action cannot be undone.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setDeleteModal(false)}
                className="btn-ghost w-1/2 py-2.5 rounded-xl text-sm"
              >
                Cancel
              </button>
              <button
                disabled={loading}
                onClick={handleDelete}
                className="btn-danger w-1/2 py-2.5 rounded-xl text-sm"
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
