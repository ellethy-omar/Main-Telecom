import { useEffect, useState } from "react";
import { ticketsService } from "../services/ticketsService.js";
import { useNavigate, Route, Routes } from 'react-router-dom';
import Loading from "../components/Loading/Loading";
import Alert from "../components/Alert/Alert";
import TicketListContainer from "../components/Tickets/TicketListContainer.jsx";
import TicketDetailsContainer from "../components/Tickets/TicketDetailsContainer.jsx";

const DashboardTicket = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  const [ticketToEdit, setTicketToEdit] = useState(null);
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateSort, setDateSort] = useState("desc");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await ticketsService.getTicketsForAgent();
        setTickets(data || []);
      } catch (err) {
        setAlert({ message: err.message || "Failed to load tickets.", type: "danger" });
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const handleView = (ticketId) => navigate(`/dashboard/tickets/view/${ticketId}`);
  const handleEdit = (ticket) => setTicketToEdit(ticket);
  const handleDelete = (ticket) => setTicketToDelete(ticket);

  const handleDeleteConfirm = async () => {
    try {
      await ticketsService.deleteTicket(ticketToDelete.ticketId);
      setTickets((prev) =>
        prev.filter((t) => t.ticketId !== ticketToDelete.ticketId)
      );
      setAlert({ message: "Ticket deleted.", type: "success" });
    } catch (err) {
      setAlert({ message: err.message || "Delete failed.", type: "danger" });
    } finally {
      setTicketToDelete(null);
    }
  };

  const handleEditSave = async (updatedTicket) => {
    try {
      const ticketId = updatedTicket.ticketId
      await ticketsService.updateTicket(updatedTicket.ticketId, updatedTicket);
      const ticket = await ticketsService.getTicketById(ticketId);

      // ! edit the ticket
      setTickets((prev) =>
        prev.map((t) => (t.ticketId === ticket.ticketId ? ticket : t))
      );
      setAlert({ message: "Ticket updated.", type: "success" });
    } catch (err) {
      setAlert({ message: err.message || "Update failed.", type: "danger" });
    } finally {
      setTicketToEdit(null);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="p-10 min-h-screen bg-gray-50">
      <Routes>
        <Route
          index
          element={
            <TicketListContainer
              tickets={tickets}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              dateSort={dateSort}
              setDateSort={setDateSort}
              ticketToEdit={ticketToEdit}
              setTicketToEdit={setTicketToEdit}
              handleEditSave={handleEditSave}
              ticketToDelete={ticketToDelete}
              setTicketToDelete={setTicketToDelete}
              handleDeleteConfirm={handleDeleteConfirm}
            />
          }
        />
        <Route path="view/:ticketId" element={<TicketDetailsContainer />} />
      </Routes>

      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
    </div>
  );
};

export default DashboardTicket;