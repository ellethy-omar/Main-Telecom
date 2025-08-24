const TicketsFilter = ({ statusFilter, setStatusFilter, dateSort, setDateSort }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow border border-gray-200 mb-6">
      <h4 className="text-md font-semibold text-gray-700 mb-4">Filter Tickets</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {/* Created At Sort */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1" htmlFor="sort">
            Sort By Created At
          </label>
          <select
            id="sort"
            value={dateSort}
            onChange={(e) => setDateSort(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>

        {/* Reset Button */}
        <div className="flex items-end">
          <button
            onClick={() => {
              setStatusFilter("all");
              setDateSort("desc");
            }}
            className="w-full bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-lg text-sm shadow-sm transition"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketsFilter;
