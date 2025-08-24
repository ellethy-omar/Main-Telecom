import { useMemo } from "react";
import TicketAgentSummary from "./TicketList/TicketAgentSummary";
import TicketEditModal from "./TicketList/TicketEditModal";
import TicketsFilter from "./TicketList/TicketsFilter";
import TicketsTable from "./TicketList/TicketsTable";
import AlertOverlayed from "../Alert/AlertOverlayed";

const TicketListContainer = ({
  tickets,
  onView,
  onEdit,
  onDelete,
  statusFilter,
  setStatusFilter,
  dateSort,
  setDateSort,
  ticketToEdit,
  setTicketToEdit,
  handleEditSave,
  ticketToDelete,
  setTicketToDelete,
  handleDeleteConfirm
}) => {
    const filteredTickets = useMemo(() => {
        let filtered = [...tickets];
        if (statusFilter !== "all") {
            filtered = filtered.filter((t) => t.status === statusFilter);
        }

        filtered.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);

            return dateSort === "asc" ? dateA - dateB : dateB - dateA;
        });
        return filtered;
    }, [tickets, statusFilter, dateSort]);

    return (
        <>
            <TicketAgentSummary tickets={tickets} />

            <div className="mt-10">
                <h3 className="text-lg font-medium text-gray-700 mb-4">Your Tickets</h3>

                <TicketsFilter
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                dateSort={dateSort}
                setDateSort={setDateSort}
                />

                <TicketsTable
                tickets={filteredTickets}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
                />

                {ticketToEdit && (
                <TicketEditModal
                    ticket={ticketToEdit}
                    onSave={handleEditSave}
                    onCancel={() => setTicketToEdit(null)}
                />
                )}

                {ticketToDelete && (
                <AlertOverlayed
                    message={`Are you sure you want to delete ticket "${ticketToDelete.title}"?`}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setTicketToDelete(null)}
                />
                )}
            </div>
        </>
    );
};

export default TicketListContainer