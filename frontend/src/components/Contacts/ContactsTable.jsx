import ContactTableRow from "./ContactTableRow";

const ContactsTable = ({ contacts, handleRequestDelete, handleRequestView }) => {
    return (
        <div className="overflow-x-auto mt-4">
            <table className="min-w-full bg-white border rounded-lg shadow-sm">
            <thead className="bg-gray-100 text-left text-sm">
                <tr>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Phone</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Company</th>
                    <th className="px-4 py-2">Position</th>
                    <th className="px-4 py-2">Notes</th>
                    <th className="px-4 py-2">Created</th>
                    <th className="px-4 py-2">Updated</th>
                    <th className="px-4 py-2">Actions</th>
                </tr>
            </thead>
            <tbody>
                {contacts.length > 0 ? (
                    contacts.map((contact, index) => (
                        <ContactTableRow
                            key={index}
                            contact={contact}
                            onRequestDelete={handleRequestDelete}
                            onRequestView={handleRequestView}
                        />
                    ))
                ) : (
                    <tr>
                        <td colSpan="9" className="text-center py-4 text-gray-500">
                        No contacts available.
                        </td>
                    </tr>
                )}
            </tbody>
            </table>
        </div>
    );
};

export default ContactsTable;