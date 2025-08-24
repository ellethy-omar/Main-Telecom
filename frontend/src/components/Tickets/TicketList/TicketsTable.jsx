import { motion } from "framer-motion";
import { formatDateContacts } from "../../../utils/castings";

const statusColors = {
  open: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-800",
  resolved: "bg-green-100 text-green-800",
  closed: "bg-gray-200 text-gray-600",
};

const TicketsTable = ({ tickets = [], onView, onEdit, onDelete }) => {
  return (
    <div className="space-y-4">
        {tickets.length === 0 ? (
            <p className="text-gray-500">No tickets assigned to you yet.</p>
        ) : (
            tickets.map((ticket) => (
                <motion.div
                    key={ticket.ticketId}
                    className="bg-white p-5 rounded-xl shadow border border-gray-200 flex justify-between items-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div>
                        <h4 className="text-md font-semibold text-gray-800">
                            {ticket.title || "Untitled"}
                        </h4>
                        <p className="text-sm text-gray-500">📞 {ticket.phone}</p>
                        <p className="text-sm text-gray-500">
                            Description: {ticket.description}
                        </p>
                        <p className="text-sm text-gray-400">
                            Created: {formatDateContacts(ticket.createdAt)}
                        </p>
                        {ticket.resolvedAt && (
                            <p className="text-sm text-green-400">
                            Resolved: {formatDateContacts(ticket.resolvedAt)}
                            </p>
                        )}
                        </div>

                        <div className="flex gap-3 items-center">
                        <span
                            className={`text-sm px-3 py-1 rounded-full font-medium capitalize ${statusColors[ticket.status]}`}
                        >
                            {ticket.status.replace("_", " ")}
                        </span>
                        {onView && (
                            <button
                            onClick={() => onView(ticket.ticketId)}
                            className="text-sm text-blue-500 hover:underline"
                            >
                            View
                            </button>
                        )}

                        {onEdit && (
                            <button
                                onClick={() => onEdit(ticket)}
                                className="text-sm text-yellow-500 hover:underline"
                            >
                                Edit
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={() => onDelete(ticket)}
                                className="text-sm text-red-500 hover:underline"
                            >
                                Delete
                            </button>
                        )}
                    </div>
                </motion.div>
            ))
        )}
    </div>
  );
};

export default TicketsTable;
