import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaWhatsapp, FaCopy, FaPhoneAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import SearchInput from "../../Components/SearchInput";
import { getAllMainRms } from "../../operations/adminApi";
import FormModal from "../../Components/FormModal";
import CreateRmForm from "./Components/CreateRmForm";


// 👇 Capitalized component
const RmCard = ({
  rm,
  copyToClipboard,
  openWhatsApp,
  makeCall,
  isDisabled = false,
  openEditModal,
}) => (
  <div className="border p-5 shadow-lg rounded-xl transition-all duration-200 hover:shadow-2xl bg-white">
    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-2">
      <h3 className="text-xl font-semibold text-gray-800">{rm.name}</h3>
      <p className="text-sm text-gray-500">USER ID: {rm.userid}</p>
    </div>

    <div className="flex flex-col gap-3 text-base text-gray-700">
      <div className="flex flex-wrap items-center gap-3">
        <span>{rm.personal_number}</span>
        <FaWhatsapp onClick={() => openWhatsApp(rm.personal_number)} className="text-green-600 text-xl hover:text-green-700 cursor-pointer" />
        <FaCopy onClick={() => copyToClipboard(rm.personal_number)} className="text-blue-500 text-xl hover:text-blue-700 cursor-pointer" />
        <FaPhoneAlt onClick={() => makeCall(rm.personal_number)} className="text-blue-600 text-xl hover:text-blue-700 cursor-pointer" />
      </div>

      <div className="flex flex-wrap justify-between gap-3">
        <div className="flex gap-3 items-center">
          <span>{rm.ck_number}</span>
          <FaWhatsapp onClick={() => openWhatsApp(rm.ck_number)} className="text-green-600 text-xl hover:text-green-700 cursor-pointer" />
          <FaCopy onClick={() => copyToClipboard(rm.ck_number)} className="text-blue-500 text-xl hover:text-blue-700 cursor-pointer" />
        </div>

        <div className="flex gap-2 mt-2 sm:mt-0">
          <button
            onClick={() => openEditModal(rm)}
            className={`px-4 py-1 rounded-lg text-sm text-white shadow bg-btnColor`}
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  </div>
);

const RmProfile = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  const [isEditModalOpen, setisEditModalOpen] = useState(false);
  const [selectedrm, setSelectedrm] = useState(null);
  const [rmList, setRmList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchRms = async () => {
      try {
        const data = await getAllMainRms(token); // fixed line
        const normalizedData = Array.isArray(data) ? data : [data];
        setRmList(normalizedData);
      } catch (err) {
        setError("Failed to fetch team");
      } finally {
        setLoading(false);
      }
    };
    fetchRms();
  }, [token]);

  const copyToClipboard = useCallback((number) => {
    navigator.clipboard.writeText(number);
    toast.success("Phone number copied!");
  }, []);

  const openWhatsApp = useCallback((number) => {
    window.open(`https://wa.me/${number}`, "_blank");
  }, []);

  const makeCall = useCallback((number) => {
    window.location.href = `tel:${number}`;
  }, []);


  

  const openEditModal = (rm) => {
    setSelectedrm(rm);
    setisEditModalOpen(true);
  };

  const closeModals = useCallback(() => {
    setisEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedrm(null);
  }, []);

  const filteredrms = useMemo(
    () =>
      rmList.filter(
        (rm) =>
          rm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          rm.personal_number.includes(searchQuery) ||
          rm.ck_number.includes(searchQuery)
      ),
    [rmList, searchQuery]
  );

  return (
    <div className="max-w-7xl mx-auto  px-4 sm:px-6 lg:px-8">
     

      <SearchInput
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onClear={() => setSearchQuery("")}
        placeholder="Search by name or mobile number..."
      />

      {loading ? (
        <p className="text-blue-600 text-center mt-6 text-lg">Loading...</p>
      ) : error ? (
        <p className="text-red-500 text-center mt-6 text-lg">{error}</p>
      ) : filteredrms.length === 0 ? (
        <p className="text-gray-600 text-center text-lg">No RM found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredrms.map((rm) => (
            <RmCard
              key={rm.id}
              rm={rm}
              copyToClipboard={copyToClipboard}
              openWhatsApp={openWhatsApp}
              makeCall={makeCall}
              openEditModal={openEditModal}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      
      <FormModal
      isFormModalOpen={isEditModalOpen} closeModal={closeModals}
      >

     < CreateRmForm closeModal={closeModals} rm={selectedrm} />


      </FormModal>
    </div>
  );
};

export default RmProfile;
