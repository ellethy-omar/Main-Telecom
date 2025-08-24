import { motion } from "framer-motion";

const CallsNewCall = ({ newCall, setNewCall, setShowAddModal, addCall, contacts }) => {
    return (
        <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="bg-white rounded-lg p-6 w-full max-w-md"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
            >
                <h3 className="text-lg font-semibold mb-4">Add New Call</h3>

                {/* Select contact phone */}
                <select
                    value={newCall.phone}
                    onChange={(e) => setNewCall({ ...newCall, phone: e.target.value })}
                    className="border rounded w-full mb-3 p-2"
                >
                    <option value="">Select Contact</option>
                    {contacts.map((c) => (
                        <option key={c.contactId} value={c.phone}>
                            {c.contactFirstName} {c.contactLastName} ({c.phone})
                        </option>
                    ))}
                </select>

                <input
                    type="number"
                    placeholder="Duration (seconds)"
                    value={newCall.durationSeconds}
                    onChange={(e) => setNewCall({ ...newCall, durationSeconds: e.target.value })}
                    className="border rounded w-full mb-3 p-2"
                />
                <textarea
                    placeholder="Summary (optional)"
                    value={newCall.summary}
                    onChange={(e) => setNewCall({ ...newCall, summary: e.target.value })}
                    className="border rounded w-full mb-3 p-2"
                />
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={() => setShowAddModal(false)}
                        className="px-4 py-2 bg-gray-200 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={addCall}
                        className="px-4 py-2 bg-green-500 text-white rounded"
                    >
                        Add
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default CallsNewCall;
