import { AnimatePresence } from "framer-motion";
import CallsRow from "./CallsRow.jsx";

const CallsTable = ({calls, saveSummary, setDeleteTarget}) => {
    return (
        <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                <th className="px-6 py-3 text-left">Caller</th>
                <th className="px-6 py-3 text-left">Company</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Position</th>
                <th className="px-6 py-3 text-left">Time (sec)</th>
                <th className="px-10 py-3 text-left">Summary</th>
                <th className="px-6 py-3 text-left">Actions</th>
                </tr>
            </thead>
            <tbody>
                <AnimatePresence>
                    {calls.length ? (
                        calls.map(call => (
                        <CallsRow
                            key={call.callId}
                            call={call}
                            onEdit={(phone) => console.log(`Go to ${phone}`)}
                            onSave={saveSummary}
                            onDelete={setDeleteTarget}
                        />
                        ))
                    ) : (
                        <tr>
                        <td colSpan="7" className="px-6 py-8 text-center text-gray-500 italic">
                            No calls available
                        </td>
                        </tr>
                    )}
                </AnimatePresence>
            </tbody>
        </table>  
    );
    
}


export default CallsTable