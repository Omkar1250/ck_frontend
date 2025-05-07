import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { rmTransactionsSummary } from "../../../operations/rmApi";
import SearchInput from "../../../Components/SearchInput"; // Reusable Search Component


const RmPayments = () => {
  const dispatch = useDispatch();
  const { transactions, loading, error, currentPage, totalPages, totalPoints } = useSelector(
    (state) => state.transactions
  );

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(rmTransactionsSummary(1, 5)); // Fetch page 1 initially
  }, [dispatch]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredTransactions = transactions.filter((txn) =>
    txn.action.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePrev = () => {
    if (currentPage > 1) {
      dispatch(rmTransactionsSummary(currentPage - 1, 5));
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      dispatch(rmTransactionsSummary(currentPage + 1, 5));
    }
  };

  if (loading) return <p className="text-blue-600 text-center mt-6 text-lg">Loading...</p>;
  if (error) return <p className="text-red-500 text-center mt-6 text-lg">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center mt-16 text-richblack-800">Payments </h1>

      {/* Reusable Search Bar */}
      <SearchInput
        value={searchQuery}
        onChange={handleSearchChange}
        onClear={() => setSearchQuery("")}
        placeholder="Search transactions..."
      />

      {/* Total Points */}
      <div className="flex justify-center mb-6">
        <div
          className={`text-xl font-semibold ${
            totalPoints >= 0 ? "text-greenBtn" : "text-delBtn"
          }`}
        >
          Total Points: {totalPoints}
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <p className="text-gray-600 text-center text-lg">No transactions found.</p>
      ) : (
        <>
          {/* Transactions List */}
          <div className="space-y-4">
            {filteredTransactions.map((txn) => (
              <div
                key={txn.id}
                className="flex justify-between items-center p-4 border rounded-lg bg-white shadow-lg hover:shadow-2xl transition-all"
              >
                {/* Left side: Lead Name */}
                <div>
                  <p className="font-semibold capitalize text-gray-800">{txn.lead_name}</p>
                  <p  className="font-semibold capitalize text-gray-800"> {txn. mobile_number}</p>
                </div>

                {/* Right side: Points, Date, Action */}
                <div className="text-right">
                  <p
                    className={`text-lg font-bold ${
                      txn.points > 0 ? "text-greenBtn" : "text-delBtn"
                    }`}
                  >
                    {txn.points > 0 ? `+${txn.points}` : txn.points}
                  </p>
                  <p className="text-sm text-gray-500">{new Date(txn.created_at).toLocaleString()}</p>
                  <p className="font-semibold capitalize text-gray-800">{txn.action.replace(/_/g, " ")}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-10">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`px-5 py-2 rounded-lg shadow text-white text-base w-36 ${
                currentPage === 1
                  ? "bg-richblack-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-700"
              }`}
            >
              Previous
            </button>
            <span className="text-richblack-800 font-semibold text-lg text-center">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`px-5 py-2 rounded-lg shadow text-white text-base w-36 ${
                currentPage === totalPages
                  ? "bg-richblack-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-700"
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

export default RmPayments;