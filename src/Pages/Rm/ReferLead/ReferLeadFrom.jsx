import React, { useState } from 'react';
import { checkMobileNumber, submitReferLead } from '../../../operations/rmApi';
import { useSelector } from 'react-redux';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/solid';
import toast from 'react-hot-toast';

export default function ReferLeadForm({ closeModal }) {
  const { token } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: '',
    mobile_number: '',
    whatsapp_mobile_number: '',
  });
  const [errors, setErrors] = useState({});
  const [isChecking, setIsChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mobileAvailable, setMobileAvailable] = useState(null);

  const isValidMobileNumber = (number) => /^[0-9]{10}$/.test(number);
  const isValidName = (name) => /^[a-zA-Z\s]+$/.test(name.trim());

  const handleNumberCheck = async () => {
    if (!isValidMobileNumber(formData.mobile_number)) {
      setErrors({ ...errors, mobile_number: 'Please enter a valid 10-digit mobile number.' });
      return;
    }

    setIsChecking(true);
    try {
      const res = await checkMobileNumber(token, formData.mobile_number);
      setMobileAvailable(res.exists === false);
      setErrors({ ...errors, mobile_number: '' });
    } catch (error) {
      setErrors({ ...errors, mobile_number: error.response?.data?.message || 'Failed to check mobile number' });
      setMobileAvailable(null);
    } finally {
      setIsChecking(false);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    let validationErrors = {};
    if (!formData.name.trim()) validationErrors.name = 'Name is required.';
    else if (!isValidName(formData.name)) validationErrors.name = 'Name should contain only letters and spaces.';

    if (!isValidMobileNumber(formData.mobile_number)) validationErrors.mobile_number = 'Please enter a valid 10-digit mobile number.';
    if (!isValidMobileNumber(formData.whatsapp_mobile_number)) validationErrors.whatsapp_mobile_number = 'Please enter a valid WhatsApp number.';
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        mobile_number: formData.mobile_number,
        whatsapp_mobile_number: formData.whatsapp_mobile_number,
      };

      const res = await submitReferLead(token, payload);
      if (res.success) {
        setFormData({
          name: '',
          mobile_number: '',
          whatsapp_mobile_number: '',
        });
        setMobileAvailable(null);
        closeModal();
        toast.success("Lead Referred Successfully");
      } else {
        setErrors({ submit: res.message || 'Failed to submit lead. Please try again.' });
      }
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || 'Error submitting lead. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'name') {
      if (/[^a-zA-Z\s]/.test(value)) return;
    }

    if (name === 'mobile_number' || name === 'whatsapp_mobile_number') {
      if (/[^0-9]/.test(value)) return;
    }

    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleCheckboxChange = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      whatsapp_mobile_number: prevFormData.mobile_number,
    }));
  };

  return (
    <div className="max-w-lg mx-auto  p-2 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-center">Refer Lead</h2>
      <form onSubmit={handleFormSubmit}>
        {/* Name Input */}
        <div className="mb-4">
          <input
            type="text"
            name="name"
            placeholder="Account Opening Name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-3 border border-richblack-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            aria-label="Account Opening Name"
            required
          />
          {errors.name && <p className="text-sm text-bgCard mt-1">{errors.name}</p>}
        </div>

        {/* Mobile Number Input with Check Button */}
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
              aria-label="Account Opening Number"
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
            {mobileAvailable === true && <CheckCircleIcon className="w-6 h-6 text-greenBtn ml-2" />}
            {mobileAvailable === false && <ExclamationCircleIcon className="w-6 h-6 text-bgCard ml-2" />}
          </div>
          {errors.mobile_number && <p className="text-sm text-bgCard mt-1">{errors.mobile_number}</p>}
        </div>

        {/* WhatsApp Number Input */}
        <div className="mb-4">
          <input
            type="text"
            name="whatsapp_mobile_number"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="WhatsApp Number"
            value={formData.whatsapp_mobile_number}
            onChange={handleInputChange}
            className="w-full p-3 border border-richblack-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            aria-label="WhatsApp Number"
            required
          />
          {errors.whatsapp_mobile_number && (
            <p className="text-sm text-bgCard mt-1">{errors.whatsapp_mobile_number}</p>
          )}
        </div>

        {/* Checkbox for Same as WhatsApp */}
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            onChange={handleCheckboxChange}
            className="mr-2 h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500 border-richblack-300 rounded"
            aria-label="Same as Mobile Number"
          />
          <label className="text-xs text-richblack-700">Same as Mobile Number</label>
        </div>

        {/* Submission Error */}
        {errors.submit && <p className="text-sm text-bgCard mb-4">{errors.submit}</p>}

        {/* Action Buttons */}
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
              isSubmitting ? 'bg-richblack-700' : 'bg-btnColor text-white '
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
