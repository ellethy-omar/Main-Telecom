const AnalyticsTicketsOpenPerAgent = ({ticketsPerAgent}) => {
    return (
        <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Open/In-Progress Tickets per Agent</h3>
            <ul className="text-gray-700 space-y-1">
                {ticketsPerAgent.map(({ agentName, totalOpenOrInProgressTickets }) => (
                    <li key={agentName} className="flex justify-between">
                    <span>{agentName}</span>
                    <span className="font-semibold">{totalOpenOrInProgressTickets}</span>
                    </li>
                ))}
            </ul>
      </div>
    );
}


export default AnalyticsTicketsOpenPerAgent