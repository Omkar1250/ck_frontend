import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  activationRequest,
  aomaApprovedList,
  deleteLead,
  getRmStars,
} from "../../../operations/rmApi";
import { FaWhatsapp, FaCopy, FaPhoneAlt, FaStar } from "react-icons/fa";
import Modal from "../../../Components/Modal";
import toast from "react-hot-toast";
import SearchInput from "../../../Components/SearchInput";
import { setCurrentPage } from "../../../Slices/aomaSlice";
import dayjs from "dayjs";


const AomaApproved = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);


  const { aomaApproved, loading, error, currentPage, totalPages,totalAomaLeads } =
    useSelector((state) => state.aomaApproved);

    const {activation_stars} = useSelector((state)=> state.stars)

  const [isUnderModalOpen, setIsUnderModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadedScreenshot, setUploadedScreenshot] = useState(null);
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [isScreenshotViewOpen, setIsScreenshotViewOpen] = useState(false);
  const [useStar, setUseStar] = useState(false);
  



  useEffect(() => {
    dispatch(aomaApprovedList(currentPage || 1, 5, searchQuery));
  }, [dispatch, currentPage, searchQuery]);


  useEffect(() => {
    dispatch(getRmStars());
  }, [dispatch, useStar]);
  
  useEffect(() => {
  return () => {
    if (uploadedScreenshot) {
      URL.revokeObjectURL(uploadedScreenshot);
    }
  };
}, [uploadedScreenshot]);


   const handleNext = useCallback(() => {
     if (currentPage < totalPages) {
       const newPage = currentPage + 1;
       dispatch(setCurrentPage(newPage));
       dispatch(aomaApprovedList(newPage, 5, searchQuery)); // Fetch leads for new page
     }
   }, [dispatch, currentPage, totalPages, searchQuery]);
 
   const handlePrev = useCallback(() => {
     if (currentPage > 1) {
       const newPage = currentPage - 1;
       dispatch(setCurrentPage(newPage));
       dispatch(aomaApprovedList(newPage, 5, searchQuery)); // Fetch leads for new page
     }
   }, [dispatch, currentPage, searchQuery]);

  const copyToClipboard = (number) => {
    navigator.clipboard.writeText(number);
    toast.success("Phone number copied!");
  };

  const openWhatsApp = (number) => {
    window.open(`https://wa.me/${number}`, "_blank");
  };

  const makeCall = (number) => {
    window.location.href = `tel:${number}`;
  };

  const handleActivationReq = async () => {
  if (!useStar && !screenshotFile) {
  toast.error("Please upload a screenshot before submitting the request.");
  return;
}


    try {
      const formData = new FormData();
      formData.append("screenshot", screenshotFile);
      formData.append("useStar", useStar);

      await activationRequest(token, selectedLead?.id, formData);
      toast.success("ACTIVATION request sent successfully!");
   dispatch(aomaApprovedList(currentPage, 5, searchQuery)); // ⬅ Refresh the data
        closeModals(); // ⬅ Close modal after action
    } catch (error) {
      toast.error(error.message || "Failed to send request.");
    }
  };
  const calculateRemainingDays = (date) => {
      const approvedDate = dayjs(date);
      const currentDate = dayjs();
      const difference = 30 - currentDate.diff(approvedDate, "day"); // Calculate remaining days
      return difference;
    };

  const handleRmDelete = async () => {
    try {
      await deleteLead(token, selectedLead?.id);
     
      dispatch(aomaApprovedList(currentPage, 5, searchQuery)); // ⬅ Refresh the data
           closeModals(); // ⬅ Close modal after action
    } catch (error) {
      toast.error(error.message || "Failed to delete lead.");
    }
  };

  const openUnderModal = (lead) => {
    setSelectedLead(lead);
    setIsUnderModalOpen(true);
  };

  const openDeleteModal = (lead) => {
    setSelectedLead(lead);
    setIsDeleteModalOpen(true);
  };

  const closeModals = () => {
    setIsUnderModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedLead(null);
    setUploadedScreenshot(null);
    setScreenshotFile(null);
    setIsScreenshotViewOpen(false);
    setUseStar(false);
  };

  const handleScreenshotUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setUploadedScreenshot(fileURL);
      setScreenshotFile(file);
      toast.success("Screenshot uploaded successfully!");
    }
  };

 const filteredLeads = useMemo(
     () =>
       aomaApproved.filter(
         (lead) =>
           lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           lead.mobile_number.includes(searchQuery) 
           
       ),
     [aomaApproved, searchQuery]
   );

  if (loading) return <p className="text-blue-600 text-center mt-6 text-lg">Loading...</p>;
   if (error) return (
     <div className="text-center mt-6">
       <p className="text-red-500 text-lg">No leads found</p>
       <button
         className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
         onClick={() => dispatch(aomaApprovedList(currentPage))}
       >
         Retry
       </button>
     </div>
   );
  return (
    <div className="max-w-6xl mx-auto mt-24 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">
        AOMA Approved List ({totalAomaLeads})  <p className="flex flex-row gap-2 justify-center items-center"><span>{activation_stars} </span><FaStar className="text-yellow-50"/></p>
      </h2>
     

      <SearchInput
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onClear={() => setSearchQuery("")}
        placeholder="Search by name or mobile number..."
      />

      {filteredLeads.length === 0 ? (
        <p className="text-gray-600 text-center text-lg">No leads found.</p>
      ) : (
        <>
          <div className="grid gap-6">
            {filteredLeads.map((lead) => {
              const isDisabled =
                lead.activation_request_status === "approved" ||
                lead.activation_request_status === "requested";

                const remainingDays = calculateRemainingDays(
                lead.code_approved_at
              );
              const timeRemainingClass =
                remainingDays <= 5
                  ? "text-pink-500 "
                  : "text-richblack-700";

              return (
                <div
                  key={lead.id}
                  className={`border p-5 shadow-lg rounded-xl transition-all duration-200 hover:shadow-2xl ${
                    lead.activation_request_status === "rejected"
                      ? "bg-bgCard"
                      : lead.activation_request_status === "requested"
                      ? "bg-bgAprCard"
                      : "bg-white"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-2">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {lead.name}
                    </h3>
                  
                     <p className={timeRemainingClass}>
                      Time Remaining: {remainingDays} D
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 text-base text-gray-700">
                    <div className="flex flex-wrap sm:items-center gap-3">
                      <span>{lead.mobile_number}</span>
                      <FaWhatsapp
                        onClick={() => openWhatsApp(lead.mobile_number)}
                        className="text-greenBtn text-xl hover:text-green-700 cursor-pointer"
                      />
                      <FaCopy
                        onClick={() => copyToClipboard(lead.mobile_number)}
                        className="text-richblack-200 text-xl hover:text-blue-600 cursor-pointer"
                      />
                      <FaPhoneAlt
                        onClick={() => makeCall(lead.mobile_number)}
                        className="text-blue-600 text-xl hover:text-blue-700 cursor-pointer"
                      />
                    </div>

                    <div className="flex flex-wrap justify-between gap-3">
                      <div className="flex gap-3 items-center">
                        <span>{lead.whatsapp_mobile_number}</span>
                        <FaWhatsapp
                          onClick={() =>
                            openWhatsApp(lead.whatsapp_mobile_number)
                          }
                          className="text-greenBtn text-xl hover:text-green-700 cursor-pointer"
                        />
                        <FaCopy
                          onClick={() =>
                            copyToClipboard(lead.whatsapp_mobile_number)
                          }
                          className="text-richblack-200 text-xl hover:text-blue-600 cursor-pointer"
                        />
                      </div>

                      <div className="flex gap-2 mt-2 sm:mt-0">
                        <button
                          onClick={() => !isDisabled && openUnderModal(lead)}
                          className={`px-4 py-1 rounded-lg text-sm shadow text-white ${
                            isDisabled
                              ? "cursor-not-allowed bg-richblack-100"
                              : "bg-greenBtn hover:bg-green-700"
                          }`}
                          disabled={isDisabled}
                        >
                          ACTIVATION
                        </button>

                        <button
                          onClick={() => !isDisabled && openDeleteModal(lead)}
                          className={`px-4 py-1 rounded-lg text-sm shadow text-white ${
                            isDisabled
                              ? "cursor-not-allowed bg-richblack-100"
                              : "bg-delBtn"
                          }`}
                          disabled={isDisabled}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-10">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`px-5 py-2 rounded-lg text-white text-base w-36 ${
                currentPage === 1
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Previous
            </button>
            <span className="text-gray-800 font-semibold text-lg text-center">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`px-5 py-2 rounded-lg text-white text-base w-36 ${
                currentPage === totalPages
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Next
            </button>
          </div>

          {/* Activation Modal */}
          <Modal
            isOpen={isUnderModalOpen}
            onClose={closeModals}
            onSubmit={handleActivationReq}
            title="Send ACTIVATION Request"
            action="Send"
            name={selectedLead?.name}
            mobile_number={selectedLead?.mobile_number}
            whatsapp_mobile_number={selectedLead?.whatsapp_mobile_number}
          >
            <div className="flex flex-col items-center gap-4 mt-4">
              {!uploadedScreenshot ? (
                <>
                  <label
                    htmlFor="screenshot-upload"
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 text-center"
                  >
                    Upload Screenshot
                  </label>
                  <input
                    id="screenshot-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshotUpload}
                    className="hidden"
                     disabled={useStar}
                  />
                  <p className="text-sm text-richblack-500">
                    Supported formats: JPG, PNG
                  </p>
                </>
              ) : (
                <>
                  <div className="flex justify-center items-center gap-4">
                    <button
                      onClick={() => setIsScreenshotViewOpen(true)}
                      className="px-6 py-2 bg-greenBtn text-white rounded-lg hover:bg-btnColor"
                    >
                      View Screenshot
                    </button>
                    <label
                      htmlFor="screenshot-reupload"
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600"
                    >
                      Replace Screenshot
                    </label>
                    <input
                      id="screenshot-reupload"
                      type="file"
                      accept="image/*"
                      onChange={handleScreenshotUpload}
                      className="hidden"
                    />
                  </div>
                  <p className="text-sm text-richblack-500">
                    You can replace the screenshot if needed.
                  </p>
                </>
              )}
            </div>

            <div className="flex items-center justify-center gap-2 mt-6">
              <input
                type="checkbox"
                checked={useStar}
                onChange={() => setUseStar(!useStar)}
                id="use-star-checkbox"
              />
              <label htmlFor="use-star-checkbox" className="text-sm text-richblack-800">
                Use 1 star for auto-approval
              </label>
            </div>

            {isScreenshotViewOpen && (
              <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex items-center justify-center z-50">
                <div className="relative bg-white p-4 rounded-lg shadow-lg">
                  <img
                    src={uploadedScreenshot}
                    alt="Screenshot"
                    className="max-w-[90%] max-h-[80vh] m-auto"
                  />
                  <button
                    onClick={() => setIsScreenshotViewOpen(false)}
                    className="absolute top-2 right-2 px-4 py-1 bg-bgCard text-white text-sm rounded-sm hover:bg-btnColor"
                  >
                    X
                  </button>
                </div>
              </div>
            )}
          </Modal>

          {/* Delete Modal */}
          <Modal
            isOpen={isDeleteModalOpen}
            onClose={closeModals}
            onSubmit={handleRmDelete}
            title="Confirm Delete"
            action="Delete"
            name={selectedLead?.name}
            mobile_number={selectedLead?.mobile_number}
            whatsapp_mobile_number={selectedLead?.whatsapp_mobile_number}
          >
            <p className="text-center mt-4 text-richblack-800">
              Are you sure you want to delete this lead?
            </p>
          </Modal>
        </>
      )}
    </div>
  );
};

export default AomaApproved;
