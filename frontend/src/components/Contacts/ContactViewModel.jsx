import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { callsService } from "../../services/callsService";
import { ticketsService } from "../../services/ticketsService";
import { formatDateContacts } from "../../utils/castings";
import TicketDetailsContactInfo from "../Tickets/TicketDetails/TicketDetailsContactInfo";
import ContactsRelatedTickets from "./ContactsRelatedTickets";
import Loading from "../Loading/Loading";



const ContactViewModal = ({ contact, onClose }) => {
  const [calls, setCalls] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const callsData = await callsService.getCallsByPhone(contact.phone);
        const ticketsData = await ticketsService.getTicketsForCertainContact(contact.phone);

        setCalls(callsData.data);
        setTickets(ticketsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [contact.phone]);

  if (loading) return <Loading />;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <motion.div
        className="bg-white rounded-xl p-6 max-w-4xl w-full shadow-xl overflow-y-auto max-h-[90vh]"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25 }}
      >
        {/* Contact Info */}
        <TicketDetailsContactInfo contactProfile={contact} />

        <hr className="my-6" />

        {/* Related Tickets */}
        <ContactsRelatedTickets tickets={tickets}/>

        <hr className="my-6" />

        {/* Related Calls */}
        <section>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Related Calls</h3>
          {calls.length > 0 ? (
            <ul className="space-y-2">
              {calls.map(c => (
                <li
                  key={c.callId}
                  className="p-3 bg-gray-50 rounded-lg border"
                >
                  <span className="font-medium text-gray-700">{formatDateContacts(c.callDate)}</span> —{" "}
                  <span className="text-gray-600">{c.durationSeconds}s</span>
                  <div className="text-sm text-gray-500 mt-1">{c.summary || "No summary available"}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No related calls for this contact.</p>
          )}
        </section>

        {/* Footer */}
        <div className="mt-8 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactViewModal;
