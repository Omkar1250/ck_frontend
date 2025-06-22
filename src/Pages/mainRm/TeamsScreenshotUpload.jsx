import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  advanceMsTeamsRequest,
  deleteLead,
  listOFAdvanceBatchMsLeads,
} from "../../operations/rmApi";
import { FaWhatsapp, FaCopy, FaPhoneAlt } from "react-icons/fa";
import Modal from "../../Components/Modal";
import toast from "react-hot-toast";
import SearchInput from "../../Components/SearchInput";
import { setCurrentPage } from "../../Slices/msTeamsApprovedSlice";
import dayjs from "dayjs";

const TeamsScreenshotUpload = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const {
    AdvanceCallDone = [],
    loading,
    error,
    currentPage,
    totalPages,
    totalAdvanceMsLeadsCallDone,
  } = useSelector((state) => state.AdvanceCallDone);

  const [isUnderModalOpen, setIsUnderModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadedScreenshot, setUploadedScreenshot] = useState(null);
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [isScreenshotViewOpen, setIsScreenshotViewOpen] = useState(false);

  useEffect(() => {
    dispatch(listOFAdvanceBatchMsLeads(currentPage || 1, 5, searchQuery));
  }, [dispatch, currentPage, searchQuery]);

  const handleNext = useCallback(() => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      dispatch(setCurrentPage(newPage));
      dispatch(listOFAdvanceBatchMsLeads(newPage, 5, searchQuery));
    }
  }, [dispatch, currentPage, totalPages, searchQuery]);

  const handlePrev = useCallback(() => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      dispatch(setCurrentPage(newPage));
      dispatch(listOFAdvanceBatchMsLeads(newPage, 5, searchQuery));
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

  const handleMsTeamReq = async () => {
    if (!screenshotFile) {
      toast.error("Please upload a screenshot before submitting the request.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("screenshot", screenshotFile);
      await advanceMsTeamsRequest(token, selectedLead?.id, formData);
      toast.success("Ms-Teams request sent successfully!");
      dispatch(listOFAdvanceBatchMsLeads(currentPage, 5, searchQuery));
      closeModals();
    } catch (error) {
      toast.error(error.message || "Failed to send request.");
    }
  };

  const handleRmDelete = async () => {
    try {
      await deleteLead(token, selectedLead?.id);
      dispatch(listOFAdvanceBatchMsLeads(currentPage, 5, searchQuery));
      closeModals();
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

  const calculateRemainingDays = (date) => {
    const approvedDate = dayjs(date);
    const currentDate = dayjs();
    return 14 - currentDate.diff(approvedDate, "day");
  };

  const filteredLeads = useMemo(
    () =>
      AdvanceCallDone.filter(
        (lead) =>
          lead.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.mobile_number?.includes(searchQuery)
      ),
    [AdvanceCallDone, searchQuery]
  );

  return (
    <div className="max-w-7xl mx-auto mt-20 px-4 sm:px-6 lg:px-8">
      <p className="text-center text-2xl font-bold font-mono">
        Advance Ms-Client Screenshot Upload{" "}
        <span className="text-btnColor">{totalAdvanceMsLeadsCallDone}</span>
      </p>

      <SearchInput
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onClear={() => setSearchQuery("")}
        placeholder="Search by name or mobile number..."
      />

      {loading ? (
        <p className="text-blue-600 text-center mt-6 text-lg">Loading...</p>
      ) : error ? (
        <div className="text-center mt-6">
          <p className="text-red-500 text-lg">No leads found</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={() => dispatch(listOFAdvanceBatchMsLeads(currentPage))}
          >
            Retry
          </button>
        </div>
      ) : filteredLeads.length === 0 ? (
        <p className="text-gray-600 text-center text-lg">No leads found.</p>
      ) : (
        <>
          <div className="grid gap-6">
            {filteredLeads.map((lead) => {
              const isDisabled =
                lead.advanced_ms_teams_request_status === "approved" ||
                lead.advanced_ms_teams_request_status === "requested";

              const remainingDays = calculateRemainingDays(lead.code_approved_at);
              const timeRemainingClass =
                remainingDays <= 5 ? "text-pink-500" : "text-richblack-700";

              return (
                <div
                  key={lead.id}
                  className={`border p-5 shadow-lg rounded-xl transition-all duration-200 hover:shadow-2xl ${
                    lead.advanced_ms_teams_request_status === "rejected"
                      ? "bg-bgCard"
                      : lead.advanced_ms_teams_request_status === "requested"
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
                        className="text-greenBtn text-xl cursor-pointer"
                      />
                      <FaCopy
                        onClick={() => copyToClipboard(lead.mobile_number)}
                        className="text-richblack-200 text-xl cursor-pointer"
                      />
                      <FaPhoneAlt
                        onClick={() => makeCall(lead.mobile_number)}
                        className="text-blue-600 text-xl cursor-pointer"
                      />
                    </div>

                    <div className="flex justify-between items-center gap-3">
                      <div className="flex gap-3 items-center">
                        <span>{lead.whatsapp_mobile_number}</span>
                        <FaWhatsapp
                          onClick={() => openWhatsApp(lead.whatsapp_mobile_number)}
                          className="text-greenBtn text-xl cursor-pointer"
                        />
                        <FaCopy
                          onClick={() =>
                            copyToClipboard(lead.whatsapp_mobile_number)
                          }
                          className="text-richblack-200 text-xl cursor-pointer"
                        />
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => !isDisabled && openUnderModal(lead)}
                          disabled={isDisabled}
                          className={`px-4 py-1 rounded-lg text-sm shadow text-white ${
                            isDisabled
                              ? "cursor-not-allowed bg-richblack-100"
                              : "bg-greenBtn hover:bg-green-700"
                          }`}
                        >
                          TEAMS
                        </button>
                        <button
                          onClick={() => !isDisabled && openDeleteModal(lead)}
                          disabled={isDisabled}
                          className={`px-4 py-1 rounded-lg text-sm shadow text-white ${
                            isDisabled
                              ? "cursor-not-allowed bg-richblack-100"
                              : "bg-delBtn"
                          }`}
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

          {/* Pagination */}
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
              Page {totalPages === 0 ? 0 : currentPage} of {totalPages}
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

          {/* Screenshot Upload Modal */}
          <Modal
            isOpen={isUnderModalOpen}
            onClose={closeModals}
            onSubmit={handleMsTeamReq}
            title="Send MS-Teams Request"
            action="Send"
            name={selectedLead?.name}
            mobile_number={selectedLead?.mobile_number}
            whatsapp_mobile_number={selectedLead?.whatsapp_mobile_number}
          >
            {!uploadedScreenshot ? (
              <div className="flex flex-col items-center gap-4 mt-4">
                <label
                  htmlFor="screenshot-upload"
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600"
                >
                  Upload Screenshot
                </label>
                <input
                  id="screenshot-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleScreenshotUpload}
                  className="hidden"
                />
                <p className="text-sm text-richblack-500">Supported formats: JPG, PNG</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4 items-center">
                <div className="flex gap-4">
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
              </div>
            )}

            {isScreenshotViewOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                <div className="relative bg-white p-4 rounded-lg shadow-lg max-w-3xl">
                  <img
                    src={uploadedScreenshot}
                    alt="Screenshot"
                    className="max-w-full max-h-[80vh] mx-auto"
                  />
                  <button
                    onClick={() => setIsScreenshotViewOpen(false)}
                    className="absolute top-2 right-2 px-4 py-1 bg-pink-600 text-white text-sm rounded-sm hover:bg-pink-700"
                  >
                    Close
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
            title="Delete Lead"
            action="Delete"
            name={selectedLead?.name}
            mobile_number={selectedLead?.mobile_number}
            whatsapp_mobile_number={selectedLead?.whatsapp_mobile_number}
          >
            <p>Are you sure you want to delete this lead?</p>
          </Modal>
        </>
      )}
    </div>
  );
};

export default TeamsScreenshotUpload;
