import { useEffect, useState } from "react";
import { contactsService } from "../services/contactsService";
import Loading from "../components/Loading/Loading";
import ContactsBigContainer from "../components/Contacts/ContactsBigContainer";
import ContactDetails from "../components/Contacts/ContactDetails";
import { Routes, Route } from 'react-router-dom';
import ContactViewModal from "../components/Contacts/ContactViewModel";

const DashboardContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewContact, setViewContact] = useState(null);

  useEffect(() => {
    async function fetchContacts() {
      const data = await contactsService.getAllContacts();
      setContacts(data);
      setLoading(false);
    }
    fetchContacts();
  }, []);

  if (loading) return <Loading />;

  return (
    <>
      <Routes>
        <Route
          index
          element={
            <ContactsBigContainer
              contacts={contacts}
              onViewContact={(contact) => setViewContact(contact)}
            />
          }
        />
        <Route path="new" element={<ContactDetails isCreating={true} />} />
        <Route path=":phone" element={<ContactDetails isCreating={false} />} />
      </Routes>

      {viewContact && (
        <ContactViewModal
          contact={viewContact}
          onClose={() => setViewContact(null)}
        />
      )}
    </>
  );
};

export default DashboardContacts;
