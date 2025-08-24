const CallsHeader = ({setShowAddModal}) => {
    return(
        <div className="flex justify-between mb-3">
            <h2 className="text-lg font-semibold">Call List</h2>
            <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={() => setShowAddModal(true)}
            >
            + Add Call
            </button>
        </div>
    );
}


export default CallsHeader;