import React, { useCallback, useEffect } from 'react';
import { FaCopy, FaPhoneAlt, FaWhatsapp } from 'react-icons/fa';
import { HiX } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Modal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  name,
  mobile_number,
  whatsapp_mobile_number,
  action,
  children,
}) => {
  const handleSubmit = () => {
    onSubmit();
    onClose();
  };

  const copyToClipboard = useCallback((number) => {
    navigator.clipboard.writeText(number);
    toast.success("Phone number copied!", {
      style: {
        background: '#161d29',
        color: '#F1F2FF',
        border: '1px solid rgba(100,115,170,0.2)',
      },
    });
  }, []);

  const openWhatsApp = useCallback((number) => {
    window.open(`https://wa.me/${number}`, "_blank");
  }, []);

  const makeCall = useCallback((number) => {
    window.location.href = `tel:${number}`;
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex justify-center items-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="glass-card max-w-md w-full p-6 sm:p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center
                text-richblack-300 hover:text-richblack-5 hover:bg-white/[0.06] transition-all duration-150"
            >
              <HiX className="w-4 h-4" />
            </button>

            <h2 className="text-xl font-semibold mb-5 text-richblack-5">
              {title}
            </h2>

            <div className="text-richblack-100 mb-4 text-sm space-y-3">
              <p><span className="text-richblack-300 text-xs uppercase tracking-wider">Name</span><br />
                <span className="font-medium text-base">{name}</span>
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <span className="text-richblack-100 font-mono text-sm">{mobile_number}</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => openWhatsApp(mobile_number)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center bg-caribbeangreen-100/10 
                      hover:bg-caribbeangreen-100/20 transition-all duration-150">
                    <FaWhatsapp className="text-caribbeangreen-100 text-sm" />
                  </button>
                  <button onClick={() => copyToClipboard(mobile_number)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/[0.04] 
                      hover:bg-white/[0.08] transition-all duration-150">
                    <FaCopy className="text-richblack-200 text-sm" />
                  </button>
                  <button onClick={() => makeCall(mobile_number)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-200/10 
                      hover:bg-blue-200/20 transition-all duration-150">
                    <FaPhoneAlt className="text-blue-200 text-sm" />
                  </button>
                </div>
              </div>

              {whatsapp_mobile_number && (
                <div className="flex items-center gap-3 pt-1">
                  <span className="text-richblack-100 font-mono text-sm">{whatsapp_mobile_number}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openWhatsApp(whatsapp_mobile_number)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center bg-caribbeangreen-100/10 
                        hover:bg-caribbeangreen-100/20 transition-all duration-150">
                      <FaWhatsapp className="text-caribbeangreen-100 text-sm" />
                    </button>
                    <button onClick={() => copyToClipboard(whatsapp_mobile_number)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/[0.04] 
                        hover:bg-white/[0.08] transition-all duration-150">
                      <FaCopy className="text-richblack-200 text-sm" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="mb-5">{children}</div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/[0.06]">
              <button
                onClick={onClose}
                className="btn-ghost px-5 py-2.5 text-sm rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="btn-gradient px-5 py-2.5 text-sm rounded-xl"
              >
                {action}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
