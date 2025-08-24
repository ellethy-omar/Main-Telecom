import { motion } from 'framer-motion';

const TicketDetailsContactsTickets = ({contactTickets, ticketId, statusColors, handleContactRelatedTicketClick}) => {
    return (
        <motion.div
          className="bg-white shadow rounded-xl p-6 h-fit"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact-related Tickets</h2>
          {contactTickets.filter(t => t.ticketId !== ticketId).length > 0 ? (
            <ul className="space-y-4">
              {contactTickets
                .filter(t => t.ticketId !== ticketId)
                .map(t => (
                  <li
                    key={t.ticketId}
                    onClick={() => handleContactRelatedTicketClick(t.ticketId)}
                    className="cursor-pointer p-3 rounded-lg border hover:shadow transition-all duration-200"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-700">{t.title || 'Untitled Ticket'}</p>
                        <p className="text-sm text-gray-400">{new Date(t.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${statusColors[t.status]}`}
                      >
                        {t.status.replace("_", " ")}
                      </span>
                    </div>
                  </li>
                ))}
            </ul>
          ) : (
            <p className="text-gray-500">No tickets related to this contact.</p>
          )}
        </motion.div>
    )
}


export default TicketDetailsContactsTickets