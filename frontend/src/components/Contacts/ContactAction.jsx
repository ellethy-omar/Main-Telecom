import { Pencil, Trash2, Eye } from "lucide-react";

const ContactAction = ({ onView, onEdit, onDelete }) => {
  return (
    <div className="flex space-x-2">
      <button
        onClick={onView}
        className="text-green-600 transition-transform duration-150 hover:scale-110"
        title="View Contact"
      >
        <Eye size={16} />
      </button>
      <button
        onClick={onEdit}
        className="text-blue-600 transition-transform duration-150 hover:scale-110"
        title="Edit Contact"
      >
        <Pencil size={16} />
      </button>
      <button
        onClick={onDelete}
        className="text-red-600 transition-transform duration-150 hover:scale-110"
        title="Delete Contact"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

export default ContactAction;
