import { motion } from 'framer-motion';

const TicketDetailsTicketInfo = ({ticket, statusColors}) => {
    return (
        <motion.div
        className="bg-white shadow rounded-xl p-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">🎫 Ticket Details</h2>
            <p><strong>Title:</strong> {ticket.title}</p>
            <p><strong>Description:</strong> {ticket.description}</p>
            <p><strong>Created:</strong> {new Date(ticket.createdAt).toLocaleString()}</p>
            <p>
                <strong>Status:</strong>{" "}
                <span className={`text-sm px-2 py-1 rounded-full font-medium capitalize ${statusColors[ticket.status]}`}>
                {ticket.status.replace("_", " ")}
                </span>
            </p>
        </motion.div>
    )
}

export default TicketDetailsTicketInfo;