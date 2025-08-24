import { useNavigate } from "react-router-dom";

const statusColors = {
  open: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-800",
  resolved: "bg-green-100 text-green-800",
  closed: "bg-gray-200 text-gray-600",
};


const ContactsRelatedTickets = ({ tickets }) => {
    const navigate = useNavigate();
    return (
        <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Related Tickets</h3>
            {tickets.length > 0 ? (
                <ul className="space-y-3">
                {tickets
                    .map(t => (
                    <li
                        key={t.ticketId}
                        onClick={() => navigate(`../tickets/view/${t.ticketId}`)}
                        className="cursor-pointer p-4 rounded-lg border hover:shadow-md transition-all duration-200 bg-gray-50"
                    >
                        <div className="flex justify-between items-center">
                        <div>
                            <p className="font-medium text-gray-700">{t.title || "Untitled Ticket"}</p>
                            <p className="text-sm text-gray-400">{new Date(t.createdAt).toLocaleDateString()}</p>
                        </div>
                        <span
                            className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${statusColors[t.status] || "bg-gray-200 text-gray-800"}`}
                        >
                            {t.status?.replace("_", " ")}
                        </span>
                        </div>
                    </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500 italic">No related tickets for this contact.</p>
            )}
        </section>
    );
}


export default ContactsRelatedTickets;