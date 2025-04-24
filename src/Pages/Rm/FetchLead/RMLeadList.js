import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRMLeads, fetchLeads } from "../../../operations/rmApi";
import { FaWhatsapp, FaCopy, FaPhoneAlt } from "react-icons/fa";
import { format } from "timeago.js";
import toast from "react-hot-toast";

const LeadList = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { leads, loading, error, currentPage, totalPages } = useSelector(
    (state) => state.leads
  );

  const [fetchTime, setFetchTime] = useState(null); // ⏱️ Track last fetch time
  const [isFetching, setIsFetching] = useState(false); // For button-specific loading states

  useEffect(() => {
    dispatch(fetchRMLeads(currentPage));
  }, [dispatch, token, currentPage]);

  const handleNext = () => {
    if (currentPage < totalPages) {
      dispatch(fetchRMLeads(currentPage + 1));
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      dispatch(fetchRMLeads(currentPage - 1));
    }
  };

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

  const handleLeadFetch = async () => {
    setIsFetching(true);
    try {
      const res = await fetchLeads(dispatch, token); // Dispatch the API call
      if (res) {
        toast.success("Leads fetched successfully");
        setFetchTime(new Date());
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch leads.");
    } finally {
      setIsFetching(false);
    }
  };

  if (loading)
    return <p className="text-blue-600 text-center mt-6 text-lg">Loading...</p>;
  if (error)
    return <p className="text-red-500 text-center mt-6 text-lg">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">
         RM Leads
      </h2>
      <div className="flex justify-end p-2 ">
        <button className="bg-btnColor p-4 rounded-lg " onClick={handleLeadFetch}>Fetch Leads</button>
      </div>
      {fetchTime && (
        <p className="text-sm text-center text-gray-500 mb-4">
          Last fetch: {format(fetchTime)}
        </p>
      )}

      {leads.length === 0 ? (
        <p className="text-gray-600 text-center text-lg">No leads found.</p>
      ) : (
        <>
          <div className="grid gap-6">
            {leads.map((lead) => (
              <div
                key={lead.id}
                className="border p-5 bg-white shadow-lg rounded-xl transition-all duration-200 hover:shadow-2xl"
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-2">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {lead.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Lead fetched: {format(lead.fetched_at)}
                  </p>
                </div>

                <div className="flex flex-col gap-3 text-base text-gray-700">
                  <div className="flex flex-wrap sm:items-center gap-3">
                    <span>{lead.mobile_number}</span>
                    <FaWhatsapp
                      onClick={() => openWhatsApp(lead.mobile_number)}
                      className="text-green-600 text-xl hover:text-green-700 cursor-pointer"
                      title="WhatsApp"
                    />
                    <FaCopy
                      onClick={() => copyToClipboard(lead.mobile_number)}
                      className="text-blue-500 text-xl hover:text-blue-600 cursor-pointer"
                      title="Copy"
                    />
                    <FaPhoneAlt
                      onClick={() => makeCall(lead.mobile_number)}
                      className="text-blue-600 text-xl hover:text-blue-700 cursor-pointer"
                      title="Call"
                    />
                  </div>

                  <div className="flex flex-wrap sm:items-center gap-3 justify-between">
                    <div className="flex flex-wrap gap-3 items-center">
                      <span>{lead.whatsapp_mobile_number}</span>
                      <FaWhatsapp
                        onClick={() =>
                          openWhatsApp(lead.whatsapp_mobile_number)
                        }
                        className="text-green-600 text-xl hover:text-green-700 cursor-pointer"
                        title="WhatsApp"
                      />
                      <FaCopy
                        onClick={() =>
                          copyToClipboard(lead.whatsapp_mobile_number)
                        }
                        className="text-blue-500 text-xl hover:text-blue-600 cursor-pointer"
                        title="Copy"
                      />
                    </div>

                    {/* Side-by-side Buttons */}
                    <div className="flex gap-2 mt-2 sm:mt-0">
                      <button
                        className="bg-greenBtn hover:bg-green-700 text-white px-4 py-1 rounded-lg text-sm shadow"
                        
                      >
                        Under
                      </button>
                      <button className="bg-delBtn hover:bg-red-600 text-white px-4 py-1 rounded-lg text-sm shadow">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
        </>
      )}
    </div>
  );
};

export default LeadList;
