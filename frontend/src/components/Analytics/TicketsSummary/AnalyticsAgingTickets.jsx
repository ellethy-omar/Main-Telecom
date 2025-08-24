const AnalyticsAgingTickets = ({agingTickets}) => {
    return(
        <div className="bg-white p-4 rounded-xl shadow overflow-auto">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Unresolved Aging Tickets</h3>
            {agingTickets.length > 0 ? (
            <table className="w-full text-sm text-left text-gray-600">
                <thead className="text-xs text-gray-500 uppercase border-b">
                <tr>
                    <th className="py-2 px-4">Ticket ID</th>
                    <th className="py-2 px-4">Title</th>
                    <th className="py-2 px-4">Status</th>
                    <th className="py-2 px-4">Created At</th>
                    <th className="py-2 px-4">Hours Open</th>
                </tr>
                </thead>
                <tbody>
                {agingTickets.map(ticket => (
                    <tr key={ticket.ticketId} className="border-b">
                    <td className="py-2 px-4">{ticket.ticketId}</td>
                    <td className="py-2 px-4">{ticket.title}</td>
                    <td className="py-2 px-4 capitalize">{ticket.status.replace(/_/g, ' ')}</td>
                    <td className="py-2 px-4">{new Date(ticket.createdAt).toLocaleString()}</td>
                    <td className="py-2 px-4">{ticket.hoursOpen}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            ) : (
            <p className="text-gray-500 text-sm">No unresolved aging tickets found.</p>
            )}
        </div>
    )
}


export default AnalyticsAgingTickets;