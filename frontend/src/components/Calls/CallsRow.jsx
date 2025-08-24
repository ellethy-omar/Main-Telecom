// CallsRow.jsx
import { motion } from "framer-motion";
import { useState } from "react";

const CallsRow = ({ call, onEdit, onDelete, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(call.summary || "");

  const handleSave = () => {
    onSave(call.callId, draft);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraft(call.summary || "");
    setIsEditing(false);
  };

  return (
    <motion.tr
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      transition={{ duration: 0.2 }}
      className="border-b hover:bg-gray-50 transition"
    >
      {/* Caller cell */}
      <td
        className="px-6 py-4 font-medium cursor-pointer text-blue-600 hover:underline"
        onClick={() => onEdit(call.phone)}
      >
        {call.contactFirstName || call.contactLastName
          ? `${call.contactFirstName ?? ""} ${call.contactLastName ?? ""}`.trim()
          : "Unknown"}
        <span className="block text-xs text-gray-500">{call.phone}</span>
      </td>

      <td className="px-6 py-4 text-gray-500">{call.contactCompany || "-"}</td>
      <td className="px-6 py-4 text-gray-500">{call.contactEmail || "-"}</td>
      <td className="px-6 py-4 text-gray-500">{call.contactPosition || "-"}</td>
      <td className="px-6 py-4 text-gray-500">{call.durationSeconds}</td>

      {/* Summary */}
      <td className="px-10 py-4 text-gray-500 min-h-[2.5rem]">
        {isEditing ? (
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && handleCancel()}
            className="border rounded px-2 py-1 w-full text-sm"
            autoFocus
          />
        ) : (
          call.summary || "-"
        )}
      </td>

      {/* Actions */}
      <td className="px-6 py-4 space-x-2 whitespace-nowrap">
        {isEditing ? (
          <>
            <button
              className="bg-green-500 text-white px-3 py-1 rounded"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              className="bg-gray-300 text-gray-800 px-3 py-1 rounded"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded"
              onClick={() => onDelete(call)}
            >
              Delete
            </button>
          </>
        )}
      </td>
    </motion.tr>
  );
};

export default CallsRow;
