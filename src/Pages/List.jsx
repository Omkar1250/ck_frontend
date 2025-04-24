
import React, { useState } from 'react';
import Modal from '../Components/Modal';

export default function List() {
    

    const [isModalOpen, setIsModalOpen] = useState(false);
      const [modalContent, setModalContent] = useState({ title: '', body: '' });
    
      const handleOpenModal = (title, body) => {
        setModalContent({ title, body });
        setIsModalOpen(true);
      };
    
      const handleCloseModal = () => setIsModalOpen(false);
      const handleSubmit = () => {
        // Handle submit logic here
        console.log('Data sent');
      };
    

    return (
      <div className="p-4">
        <div className="border-solid border-2 p-4 bg-gray-100 rounded-lg">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-2">
            <div>
              <p className="text-xs font-semibold">Abhishek Suryawanshi</p>
            </div>
            <div>
              <p className="text-xs font-semibold">User ID: DJDJDJ123123</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
            <div className="flex gap-2 items-center">
              <p className="text-xs flex items-center">
                <span className="mr-1">📱</span> 8329458730
              </p>
              <p className="text-xs flex items-center">
                <span className="mr-1">📞</span> 8329458730
              </p>
            </div>
            <button className="px-2 text-white text-xs bg-blue-500 rounded hover:bg-blue-700" onClick={handleOpenModal}>
              Edit
            </button>
          </div>
        </div>


        


        
      <button
        className="bg-green-500 text-white px-4 py-2 rounded"
        onClick={() => handleOpenModal('First Modal', 'This is the first modal content')}
      >
        Open First Modal
      </button>
      <button
        className="bg-green-500 text-white px-4 py-2 rounded ml-2"
        onClick={() => handleOpenModal('Second Modal', 'This is the second modal content')}
      >
        Open Second Modal
      </button>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        title={modalContent.title}
      >
        <p>{modalContent.body}</p>
      </Modal>
    </div>

    );
  }
  