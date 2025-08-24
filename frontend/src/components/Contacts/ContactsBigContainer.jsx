import { useState } from "react";
import { contactsService } from "../../services/contactsService";
import { useNavigate } from "react-router-dom";
import ContactsTable from "./ContactsTable";
import ContactViewModal from "./ContactViewModel";
import AlertOverlayed from "../Alert/AlertOverlayed";
import Alert from "../Alert/Alert";
import ContactsHeader from "./ContactsHeader";

const ContactsBigContainer = ({ contacts: initialContacts }) => {
    const navigate = useNavigate();
    const [alert, setAlert] = useState(null);
    const [contacts, setContacts] = useState(initialContacts);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);
    const [viewContact, setViewContact] = useState(null);

    const handleRequestDelete = (contact) => {
        setSelectedContact(contact);
        setShowConfirm(true);
    };

    const handleRequestView = (contact) => {
        setViewContact(contact);
    };

    const confirmDelete = async () => {
        await contactsService.deleteContact(selectedContact.phone);

        if (selectedContact) {
            const updatedContacts = contacts.filter((c) => c !== selectedContact);
            setContacts(updatedContacts);
        }

        setShowConfirm(false);
        setSelectedContact(null);
        setAlert({
            message: 'Delete successfully!',
            type: 'success'
        });
    };

    const cancelDelete = () => {
        setShowConfirm(false);
        setSelectedContact(null);
    };

     const handleCreateContact = () => {
        navigate('/dashboard/contacts/new');
    };


    return (
        <div className="p-6 relative">
            <ContactsHeader handleCreateContact={handleCreateContact}/>

            <ContactsTable 
                contacts= {contacts}
                handleRequestDelete={handleRequestDelete}
                handleRequestView={handleRequestView}
            />

            {showConfirm && (
                <AlertOverlayed
                message={`Are you sure you want to delete ${selectedContact?.firstName} ${selectedContact?.lastName}?`}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
                />
            )}

            {alert && (
                <Alert
                message={alert.message}
                type={alert.type}
                onClose={() => setAlert(null)}
                />
            )}
            
            {viewContact && (
                <ContactViewModal
                    contact={viewContact}
                    onClose={() => setViewContact(null)}
                />
            )}
        </div>
    );
};

export default ContactsBigContainer;
