import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  activationApprovedList,
} from "../../../operations/rmApi";
import { FaWhatsapp, FaCopy, FaPhoneAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import SearchInput from "../../../Components/SearchInput";
import { setCurrentPage } from "../../../Slices/activationApprovedSlice";

const TempClients = () => {
  const dispatch = useDispatch();


  const { activationApproved, loading, error, currentPage, totalPages, totalActivationLeads } = useSelector(
    (state) => state.activationApproved
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [now, setNow] = useState(new Date());  // ✅ store current time

  useEffect(() => {
    dispatch(activationApprovedList(currentPage || 1, 5, searchQuery));
  }, [dispatch, currentPage, searchQuery]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());  // ✅ update current time every minute
    }, 60000); // 60 seconds = 1 minute

    return () => clearInterval(interval); // cleanup
  }, []);

 const handleNext = useCallback(() => {
     if (currentPage < totalPages) {
       const newPage = currentPage + 1;
       dispatch(setCurrentPage(newPage));
       dispatch(activationApprovedList(newPage, 5, searchQuery)); // Fetch leads for new page
     }
   }, [dispatch, currentPage, totalPages, searchQuery]);
 
   const handlePrev = useCallback(() => {
     if (currentPage > 1) {
       const newPage = currentPage - 1;
       dispatch(setCurrentPage(newPage));
       dispatch(activationApprovedList(newPage, 5, searchQuery)); // Fetch leads for new page
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

  function calculateDaysLeft(activationDate) {
    if (!activationDate) return '-';

    const activationDateObj = new Date(activationDate);
    const expiryDate = new Date(activationDateObj);
    expiryDate.setDate(expiryDate.getDate() + 14);

    const timeDiff = expiryDate - now;  // ✅ compare with `now` state
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    return daysLeft > 0 ? daysLeft : 0;
  }

 const filteredLeads = useMemo(
     () =>
       activationApproved.filter(
         (lead) =>
           lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           lead.mobile_number.includes(searchQuery) 
           
       ),
     [activationApproved, searchQuery]
   );

 // Render loading and error states
 if (loading) return <p className="text-blue-600 text-center mt-16 text-lg">Loading...</p>;
  if (error) return (
    <div className="text-center mt-6">
      <p className="text-red-500 text-lg">No leads found</p>
      <button
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        onClick={() => dispatch(activationApprovedList(currentPage))}
      >
        Retry
      </button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-center text-2xl font-bold font-mono ">
        Your Clients ({totalActivationLeads})
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
              const daysLeft = calculateDaysLeft(lead.code_approved_at);

              return (
                <div
                  key={lead.id}
                  className="border p-5 shadow-lg rounded-xl transition-all duration-200 hover:shadow-2xl"
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-2">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {lead.name}
                    </h3>
                    <span className={daysLeft <= 5 ? "text-pink-200" : "text-richblack-900"}>
  Time left: {daysLeft} {daysLeft <= 1 ? "day" : "days"} left
</span>
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
                          onClick={() => openWhatsApp(lead.whatsapp_mobile_number)}
                          className="text-greenBtn text-xl hover:text-green-700 cursor-pointer"
                        />
                        <FaCopy
                          onClick={() => copyToClipboard(lead.whatsapp_mobile_number)}
                          className="text-richblack-200 text-xl hover:text-blue-600 cursor-pointer"
                        />
                      </div>
                      <div className="flex justify-end">
                    <span>{lead.batch_code}</span>
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
        </>
      )}
    </div>
  );
};

export default TempClients;
