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

  // Validate mobile number format (example: 10-digit number)
  const isValidMobileNumber = (number) => /^[0-9]{10}$/.test(number);

  // Handle mobile number check
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

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    let validationErrors = {};
    if (!formData.name.trim()) validationErrors.name = 'Name is required.';
    if (!isValidMobileNumber(formData.mobile_number)) validationErrors.mobile_number = 'Please enter a valid 10-digit mobile number.';
    if (!isValidMobileNumber(formData.whatsapp_mobile_number)) validationErrors.whatsapp_mobile_number = 'Please enter a valid WhatsApp number.';
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      // Prepare payload
      const payload = {
        name: formData.name,
        mobile_number: formData.mobile_number,
        whatsapp_mobile_number: formData.whatsapp_mobile_number,
      };

      const res = await submitReferLead(token, payload);
      if (res.success) {
        // Clear form data and close modal
        setFormData({
          name: '',
          mobile_number: '',
          whatsapp_mobile_number: '',
        });
        setMobileAvailable(null);
        closeModal(); // Close the modal after successful submission
      } else {
        setErrors({ submit: res.message || 'Failed to submit lead. Please try again.' });
      }
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || 'Error submitting lead. Please try again.' });
    } finally {
      setIsSubmitting(false);
      toast.success("Lead Refered Successfully")
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  // Handle checkbox change for "Same as WhatsApp"
  const handleCheckboxChange = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      whatsapp_mobile_number: prevFormData.mobile_number,
    }));
  };

  return (
    <div className="max-w-lg mx-auto my-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Refer Lead</h2>
      <form onSubmit={handleFormSubmit}>
        {/* Name Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-richblack-700">Name</label>
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
          <label className="block text-sm font-medium text-richblack-700">Mobile Number</label>
          <div className="flex items-center">
            <input
              type="text"
              name="mobile_number"
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
          <label className="block text-sm font-medium text-richblack-700">WhatsApp Number</label>
          <input
            type="text"
            name="whatsapp_mobile_number"
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
          <label className="text-sm text-richblack-700">Same as Mobile Number</label>
        </div>

        {/* Error Message for Submission */}
        {errors.submit && <p className="text-sm text-bgCard mb-4">{errors.submit}</p>}

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={closeModal}
            className="px-6 py-2 bg-delBtn text-white rounded-md hover:bg-btnColor transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-6 py-2 rounded-md transition ${
              isSubmitting ? 'bg-richblack-700' : 'bg-greenBtn text-white hover:bg-greenBtn'
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
}