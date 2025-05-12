import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { createRm, deleteRm, updateRm } from "../../../operations/adminApi";
import { toast } from "react-hot-toast";

export default function CreateRoleForm({ closeModal, rm }) {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isEdit = !!rm;

  // Pre-fill values for editing
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
        await updateRm(token, rm.id, formData);
        toast.success("RM updated successfully");
      } else {
        await createRm(token, formData);
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
      await deleteRm(token, rm.id);
      toast.success("RM deleted successfully");
      closeModal();
    } catch (error) {
      toast.error(error.message || "Failed to delete RM");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg space-y-4">
        <h2 className="text-lg font-semibold text-center text-richblack-700 mb-2">
          {isEdit ? "Update Role" : "Create Role"}
        </h2>

        <InputField label="Name" name="name" register={register} errors={errors} required />
        <InputField label="Personal Number" name="personal_number" type="number" register={register} errors={errors} required />
        <InputField label="CyberKing Number" name="ck_number" type="number" register={register} errors={errors} required />
        <InputField label="User ID" name="userid" register={register} errors={errors} required />

        <InputField
          label="Password"
          name="password"
          type={showPassword ? "text" : "password"}
          register={register}
          errors={errors}
          required={!isEdit}
        />
        <InputField
          label="Confirm Password"
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          register={register}
          errors={errors}
          required={!isEdit}
        />

        <div className="flex items-center">
          <input
            type="checkbox"
            id="showPassword"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
            className="mr-2"
          />
          <label htmlFor="showPassword" className="text-sm text-richblack-700">
            Show Password
          </label>
        </div>

        <InputField label="UPI ID (optional)" name="upi_id" register={register} />

        <div className="flex justify-between gap-4 mt-6">
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white py-3 rounded-sm font-semibold transition duration-200 hover:bg-blue-700 ${loading && "opacity-60 cursor-not-allowed"}`}
          >
            {loading ? (isEdit ? "Updating..." : "Creating...") : isEdit ? "Update" : "Create"}
          </button>

          {isEdit && (
            <button
              type="button"
              onClick={async () => {
                const confirmDelete = window.confirm("Are you sure you want to delete this RM?");
                if (confirmDelete) {
                  await handleDelete();
                }
              }}
              className="w-full bg-pink-300 text-white py-3 rounded-sm font-semibold transition duration-200 hover:bg-pink-400"
            >
              Delete
            </button>
          )}

          <button
            type="button"
            onClick={closeModal}
            className="w-full bg-richblack-300 text-richblack-700 py-3 rounded-sm font-semibold transition duration-200 hover:bg-richblack-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

const InputField = ({ label, name, type = "text", register, errors = {}, required = false }) => (
  <div>
    <input
      type={type}
      placeholder={label}
      {...register(name, required ? { required: `${label} is required` } : {})}
      className="w-full p-3 border rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    {errors[name] && <p className="text-pink-500 text-sm mt-1">{errors[name].message}</p>}
  </div>
);
