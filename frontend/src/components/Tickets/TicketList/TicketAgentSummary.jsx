// src/components/Tickets/TicketAgentSummary.jsx
import { motion } from "framer-motion";

const TicketAgentSummary = ({ tickets = [] }) => {
  const activeTickets = tickets.filter((t) => t.status !== "resolved");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <motion.div
        className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <h2 className="text-xl font-semibold mb-2">Ticket Summary</h2>
        <p className="text-gray-600">
          You have {activeTickets.length} active tickets.
        </p>
      </motion.div>

      <motion.div
        className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold mb-2">Total Tickets</h2>
        <p className="text-gray-600">You’ve been assigned {tickets.length} tickets.</p>
      </motion.div>
    </div>
  );
};

export default TicketAgentSummary;
