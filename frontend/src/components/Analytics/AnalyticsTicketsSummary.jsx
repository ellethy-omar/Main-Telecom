import AnalyticsAgingTickets from "./TicketsSummary/AnalyticsAgingTickets";
import AnalyticsAverageResoultionTime from "./TicketsSummary/AnalyticsAverageResoultionTime";
import AnalyticsTicketsOpenPerAgent from "./TicketsSummary/AnalyticsTicketsOpenPerAgent";

const AnalyticsTicketsSummary = ({avgResolutionTime, statusCounts, ticketsPerAgent, agingTickets}) => {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Average Resolution Time */}
                { avgResolutionTime && <AnalyticsAverageResoultionTime avgResolutionTime={avgResolutionTime} /> }

                {/* Tickets by Status */}
                <div className="bg-white p-4 rounded-xl shadow">
                <h3 className="text-lg font-semibold mb-2 text-gray-700">Tickets by Status</h3>
                <ul className="text-gray-700 space-y-1">
                    {statusCounts.map(({ status, count }) => (
                    <li key={status} className="flex justify-between">
                        <span className="capitalize">{status.replace(/_/g, ' ')}</span>
                        <span className="font-semibold">{count}</span>
                    </li>
                    ))}
                </ul>
                </div>
            </div>

            <AnalyticsTicketsOpenPerAgent ticketsPerAgent={ticketsPerAgent} />

            <AnalyticsAgingTickets agingTickets={agingTickets}/>
        </>
    );
}

export default AnalyticsTicketsSummary;