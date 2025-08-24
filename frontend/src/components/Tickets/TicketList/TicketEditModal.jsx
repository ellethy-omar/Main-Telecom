import { useState } from "react";

const TicketEditModal = ({ ticket, onSave, onCancel, setAlert }) => {
  const [title, setTitle] = useState(ticket.title);
  const [description, setDescription] = useState(ticket.description);
  const [status, setStatus] = useState(ticket.status);

  const handleSubmit = () => {
    if (title.trim() === "") {
      setAlert({
        message: "Title cannot be empty",
        type: 'danger'
      })
      return;
    }

    if (description.trim() === "") {
      setAlert({
        message: "Description cannot be empty",
        type: 'danger'
      })
      return;
    }

    onSave({
      ...ticket,
      title: title.trim(),
      description: description.trim(),
      status,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-xl">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">✏️ Edit Ticket</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              rows="4"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-sm"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketEditModal;
