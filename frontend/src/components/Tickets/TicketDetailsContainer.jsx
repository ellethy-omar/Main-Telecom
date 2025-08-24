import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ticketsService } from '../../services/ticketsService';
import { contactsService } from '../../services/contactsService';
import Loading from '../Loading/Loading';
import NotFound from '../NotFound/NotFound';
import { motion } from 'framer-motion';
import TicketDetailsContactInfo from './TicketDetails/TicketDetailsContactInfo';
import TicketDetailsContactsTickets from './TicketDetails/TicketDetailsContactTickets';
import TicketDetailsTicketInfo from './TicketDetails/TicketDetailsTicketInfo';

const statusColors = {
  open: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-800",
  resolved: "bg-green-100 text-green-800",
  closed: "bg-gray-200 text-gray-600",
};

const TicketDetailsContainer = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [contactTickets, setContactTickets] = useState([]);
  const [contactProfile, setContactProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const currentTicket = await ticketsService.getTicketById(ticketId);

        if (!currentTicket) {
          setAlert({ message: 'Ticket not found.', type: 'danger' });
          return;
        }

        setTicket(currentTicket);

        const phone = currentTicket.phone;
        const [relatedTickets, profile] = await Promise.all([
          ticketsService.getTicketsForCertainContact(phone),
          contactsService.getContactByPhone(phone),
        ]);

        setContactTickets(relatedTickets);
        setContactProfile(profile);
      } catch (err) {
        setAlert({ message: err.message || 'Failed to load ticket details.', type: 'danger' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ticketId]);

  const handleContactRelatedTicketClick = (id) => {
    if (id !== ticketId) navigate(`/dashboard/tickets/view/${id}`);
  };

  if (loading) return <Loading />;

  if (alert) {
    return (
      <NotFound 
        title="Ticket Not Found" 
        message="The ticket you're trying to view does not exist or may have been deleted." 
      />
    );
  }


  return (
    <div className="p-10 min-h-screen bg-gray-50">
      <button onClick={() => navigate('/dashboard/tickets')} className="text-blue-600 hover:underline mb-4">
        ← Back to Tickets
      </button>

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="lg:col-span-2 space-y-6">
          {/* Ticket Details */}
          {ticket && 
            <TicketDetailsTicketInfo 
            ticket={ticket} statusColors = {statusColors}/>}

          {/* Contact Info */}
          {contactProfile && <TicketDetailsContactInfo contactProfile={contactProfile} />}
        </div>

        {/* Contact-related Tickets */}
        {contactTickets && 
          <TicketDetailsContactsTickets
            contactTickets= {contactTickets}
            ticketId ={ticket.ticketId}
            statusColors={statusColors}
            handleContactRelatedTicketClick={handleContactRelatedTicketClick}
          />}
      </motion.div>
    </div>
  );
};

export default TicketDetailsContainer;
