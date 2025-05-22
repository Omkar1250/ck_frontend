import React, { useState } from 'react'
import FormModal from '../../../Components/FormModal';
import ReferLeadForm from './ReferLeadFrom'; // Corrected the component name
import { useSelector } from 'react-redux';

export default function ReferLead() {
    const [isFormModalOpen, setFormModalOpen] = useState(false);
    const {user} =useSelector((state)=> state.profile)
    const openModal = () => setFormModalOpen(true);
    const closeModal = () => setFormModalOpen(false);

    return (
        <>
            <div className='flex justify-center items-center'>
                <button 
                    className='p-3 w-full text-lg text-white bg-btnColor rounded-md mt-[100px]' 
                    onClick={openModal}
                >
                    Refer a Lead
                </button>
            </div>
            <div className="flex justify-center items-center p-4 ">
  <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
    <p className="text-lg font-semibold text-richblack-700">Name: <span className="font-normal">{user.name}</span></p>
    <p className="text-lg font-semibold text-richblack-700 mt-2">User Id: <span className="font-normal">{user.user_id}</span></p>
    <p className="text-lg font-semibold text-richblack-700 mt-2">Mobile No: <span className="font-normal">{user.personal_number}</span></p>
    <p className="text-lg font-semibold text-richblack-700 mt-2">CK No: <span className="font-normal">{user.ck_number}</span></p>
  </div>
</div>


            <FormModal isFormModalOpen={isFormModalOpen} closeModal={closeModal}>
                {/* Pass closeModal to ReferLeadForm */}
                <ReferLeadForm closeModal={closeModal} />
            </FormModal>
        </>
    )
}