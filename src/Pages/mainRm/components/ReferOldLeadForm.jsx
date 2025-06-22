import React, { useState } from 'react';
import {  checkOldMobileNumber, submitOldReferLead } from '../../../operations/rmApi';
import { useSelector } from 'react-redux';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/solid';
import toast from 'react-hot-toast';

export default function ReferOldLeadForm({ closeModal }) {
  const { token } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    account_opening_name: '',
    mobile_number: '',
    whatsapp_number: '',
    client_code: '',
    batch_type: '',
  });

  const [errors, setErrors] = useState({});
  const [isChecking, setIsChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mobileAvailable, setMobileAvailable] = useState(null);

  const batches = [
    { id: 1, bactch: 'Basic' },
    { id: 2, bactch: 'Advance' },
    { id: 3, bactch: 'Both' },
  ];

  const isValidMobileNumber = (number) => /^[0-9]{10}$/.test(number);
  const isValidName = (name) => /^[a-zA-Z\s]+$/.test(name.trim());

 const handleInputChange = (e) => {
  const { name, value } = e.target;

  let processedValue = value;

  if (['mobile_number', 'whatsapp_number'].includes(name)) {
    if (/[^0-9]/.test(value)) return;
  }

  if (name === 'account_opening_name') {
    if (/[^a-zA-Z\s]/.test(value)) return;
  }

  if (name === 'client_code') {
    processedValue = value.toUpperCase(); // Convert to uppercase
  }

  setFormData({ ...formData, [name]: processedValue });
  setErrors({ ...errors, [name]: '' });
};

  const handleCheckboxChange = (e) => {
    if (e.target.checked) {
      setFormData((prev) => ({
        ...prev,
        whatsapp_number: prev.mobile_number,
      }));
    }
  };

  const handleNumberCheck = async () => {
    if (!isValidMobileNumber(formData.mobile_number)) {
      setErrors({ ...errors, mobile_number: 'Please enter a valid 10-digit mobile number.' });
      return;
    }

    setIsChecking(true);
    try {
      const res = await checkOldMobileNumber(token, formData.mobile_number);
      setMobileAvailable(res.exists === false);
      setErrors({ ...errors, mobile_number: '' });
    } catch (error) {
      setErrors({
        ...errors,
        mobile_number: error.response?.data?.message || 'Failed to check mobile number',
      });
      setMobileAvailable(null);
    } finally {
      setIsChecking(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    let validationErrors = {};

    if (!formData.account_opening_name.trim())
      validationErrors.account_opening_name = 'Name is required.';
    else if (!isValidName(formData.account_opening_name))
      validationErrors.account_opening_name = 'Name should contain only letters and spaces.';

    if (!isValidMobileNumber(formData.mobile_number))
      validationErrors.mobile_number = 'Please enter a valid 10-digit mobile number.';

    if (!isValidMobileNumber(formData.whatsapp_number))
      validationErrors.whatsapp_number = 'Please enter a valid WhatsApp number.';

    if (!formData.client_code.trim())
      validationErrors.client_code = 'Client code is required.';

    // if (!formData.batch_code.trim())
    //   validationErrors.batch_code = 'Batch selection is required.';

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const payload = { ...formData };

      const res = await submitOldReferLead(token, payload);
      if (res.success) {
        setFormData({
          account_opening_name: '',
          mobile_number: '',
          whatsapp_number: '',
          client_code: '',
          batch_type: '',
        });
        setMobileAvailable(null);
        closeModal();
        toast.success("Lead Referred Successfully");
      } else {
        setErrors({ submit: res.message || 'Failed to submit lead. Please try again.' });
      }
    } catch (error) {
      setErrors({
        submit: error.response?.data?.message || 'Error submitting lead. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-2 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-center">Refer Old Lead</h2>
      <form onSubmit={handleFormSubmit}>
        {/* Name */}
        <div className="mb-4">
          <input
            type="text"
            name="account_opening_name"
            placeholder="Account Opening Name"
            value={formData.account_opening_name}
            onChange={handleInputChange}
            className="w-full p-3 border border-richblack-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
          {errors.account_opening_name && (
            <p className="text-sm text-bgCard mt-1">{errors.account_opening_name}</p>
          )}
        </div>

        {/* Mobile Number */}
        <div className="mb-4 relative">
          <div className="flex items-center">
            <input
              type="text"
              name="mobile_number"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Account Opening Number"
              value={formData.mobile_number}
              onChange={handleInputChange}
              className="w-full p-3 border border-richblack-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
            <button
              type="button"
              onClick={handleNumberCheck}
              className={`ml-2 px-4 py-2 rounded-md transition ${
                isChecking ? 'bg-richblack-400' : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
              disabled={isChecking}
            >
              {isChecking ? '...' : 'Check'}
            </button>
            {mobileAvailable === true && (
              <CheckCircleIcon className="w-6 h-6 text-greenBtn ml-2" />
            )}
            {mobileAvailable === false && (
              <ExclamationCircleIcon className="w-6 h-6 text-bgCard ml-2" />
            )}
          </div>
          {errors.mobile_number && (
            <p className="text-sm text-bgCard mt-1">{errors.mobile_number}</p>
          )}
        </div>

        {/* WhatsApp Number */}
        <div className="mb-4">
          <input
            type="text"
            name="whatsapp_number"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="WhatsApp Number"
            value={formData.whatsapp_number}
            onChange={handleInputChange}
            className="w-full p-3 border border-richblack-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
          {errors.whatsapp_number && (
            <p className="text-sm text-bgCard mt-1">{errors.whatsapp_number}</p>
          )}
        </div>

        {/* Same as checkbox */}
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            onChange={handleCheckboxChange}
            className="mr-2 h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500 border-richblack-300 rounded"
          />
          <label className="text-xs text-richblack-700">Same as Mobile Number</label>
        </div>

        {/* Client Code */}
        <div className="mb-4">
          <input
            type="text"
            name="client_code"
            placeholder="Client Code"
            value={formData.client_code}
            onChange={handleInputChange}
            className="w-full p-3 border border-richblack-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
          {errors.client_code && (
            <p className="text-sm text-bgCard mt-1">{errors.client_code}</p>
          )}
        </div>

        {/* Batch Dropdown */}
         <div className="mb-4">
          <select
            name="batch_type"
            value={formData.batch_type}
            onChange={handleInputChange}
            className="w-full p-3 border border-richblack-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          >
            <option value="">Select Batch</option>
            {batches.map((b) => (
              <option key={b.id} value={b.bactch}>
                {b.bactch}
              </option>
            ))}
          </select>
          {errors.batch_code && (
            <p className="text-sm text-bgCard mt-1">{errors.batch_code}</p>
          )}
        </div> 

        {/* Submit error */}
        {errors.submit && <p className="text-sm text-bgCard mb-4">{errors.submit}</p>}

        {/* Buttons */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={closeModal}
            className="px-6 py-2 bg-btnColor text-white rounded-md hover:bg-btnColor transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-6 py-2 rounded-md transition ${
              isSubmitting ? 'bg-richblack-700' : 'bg-btnColor text-white'
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Referring..' : 'Refer'}
          </button>
        </div>
      </form>
    </div>
  );
}
