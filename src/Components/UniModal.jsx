import React, { useEffect } from "react";

const UniModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  name,
  mobile_number,
  whatsapp_mobile_number,
  children,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex justify-center items-center z-50 p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="glass-card p-6 w-full max-w-md animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-richblack-5 mb-4">{title} Approval</h2>

        <div className="mb-4 text-sm space-y-2">
          <div>
            <span className="text-[10px] text-richblack-400 uppercase tracking-wider font-medium">Name</span>
            <p className="text-richblack-5 font-medium">{name}</p>
          </div>
          <div>
            <span className="text-[10px] text-richblack-400 uppercase tracking-wider font-medium">Mobile</span>
            <p className="text-richblack-100 font-mono text-sm">{mobile_number}</p>
          </div>
          <div>
            <span className="text-[10px] text-richblack-400 uppercase tracking-wider font-medium">WhatsApp</span>
            <p className="text-richblack-100 font-mono text-sm">{whatsapp_mobile_number}</p>
          </div>
        </div>

        <div className="mb-5">{children}</div>

        <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.06]">
          <button
            onClick={onClose}
            className="btn-ghost px-5 py-2 text-sm rounded-xl"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:translate-y-[-1px] hover:shadow-lg"
            style={{ background: 'linear-gradient(135deg, #06D6A0, #05A77B)' }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default UniModal;
