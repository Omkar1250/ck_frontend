import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { getConversionPoints, updateConversionPoints } from "../../operations/adminApi";

const ConversionPoint = () => {
  const { token } = useSelector((state) => state.auth);
  const [points, setPoints] = useState({
    aoma_approved: "",
    code_approved: "",
    ms_teams_approved: "",
    sip_approved: "",
    activation_approved: "",
  });

  const [originalPoints, setOriginalPoints] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const res = await getConversionPoints(token);
        console.log("API Response:", res);

        if (res?.success && res?.data) {
          // Map the response data to the UI state
          const mapped = {
            aoma_approved: res.data.aoma_approved,
            code_approved: res.data.code_approved,
            ms_teams_approved: res.data.ms_teams_approved,
            sip_approved: res.data.sip_approved,
            activation_approved: res.data.activation_approved,
          };
          console.log("Mapped Points:", mapped);

          setOriginalPoints(mapped);
          setPoints(mapped);
        } else {
          console.error("Failed to fetch conversion points:", res?.message);
        }
      } catch (error) {
        console.error("Error fetching conversion points:", error);
      }
    };

    fetchPoints();
  }, [token]);

  const handleChange = (field, value) => {
    setPoints((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const res = await updateConversionPoints(token, points);
      if (res?.success) {
        toast.success("Conversion Points Updated Successfully");
        setOriginalPoints({ ...points }); // Update original points
        setIsEditing(false);
      } else {
        toast.error("Failed to update conversion points");
      }
    } catch (error) {
      console.error("Error updating conversion points:", error);
      toast.error("An error occurred while updating conversion points");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-lg rounded-lg mt-10 p-6 space-y-6">
      <h2 className="text-2xl font-semibold mb-4">🎯 Conversion Points Configuration</h2>

      {[
        { label: "AOMA Approved", field: "aoma_approved" },
        { label: "Code Approved", field: "code_approved" },
        { label: "MS Teams Approved", field: "ms_teams_approved" },
        { label: "SIP Approved", field: "sip_approved" },
        { label: "Activation Approved", field: "activation_approved" },
      ].map(({ label, field }) => (
        <div key={field} className="flex justify-between items-center">
          <label className="font-medium">{label}:</label>
          {isEditing ? (
            <input
              type="number"
              value={points[field]}
              onChange={(e) => handleChange(field, e.target.value)}
              className="border rounded px-3 py-2 w-40 text-right"
            />
          ) : (
            <span className="text-richblack-800 font-medium">₹{points[field]}</span>
          )}
        </div>
      ))}

      <div className="flex justify-end space-x-4 pt-4">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Edit
          </button>
        ) : (
          <>
            <button
              onClick={() => {
                setPoints({ ...originalPoints });
                setIsEditing(false);
              }}
              className="px-4 py-2 bg-delBtn text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-btnColor text-white rounded hover:bg-green-600"
            >
              Save
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ConversionPoint;