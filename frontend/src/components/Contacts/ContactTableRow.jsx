import ContactAction from "./ContactAction";
import { formatDateContacts } from "../../utils/castings";
import { useNavigate } from "react-router-dom";

const ContactTableRow = ({ contact, onRequestDelete, onRequestView  }) => {
  const navigate = useNavigate();

  const handleDelete = (e) => {
    e.stopPropagation();
    onRequestDelete(contact);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    console.log("Edit contact:", contact);
    navigate(`/dashboard/contacts/${contact.phone}`);
  };

  const handleView = (e) => {
    e.stopPropagation();
    onRequestView(contact);
  };

  return (
    <tr className="border-t">
      <td className="px-2 py-3">
        {contact.firstName} {contact.lastName}
      </td>
      <td className="px-4 py-2">{contact.phone}</td>
      <td className="px-4 py-2">{contact.email}</td>
      <td className="px-4 py-2">{contact.company || '-'}</td>
      <td className="px-4 py-2">{contact.position || '-'}</td>
      <td className="px-4 py-2">{contact.notes || '-'}</td>
      <td className="px-4 py-2 whitespace-nowrap">
        {formatDateContacts(contact.createdAt)}
      </td>
      <td className="px-4 py-2 whitespace-nowrap">
        {formatDateContacts(contact.updatedAt)}
      </td>
      <td className="px-4 py-2">
        <ContactAction onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
      </td>
    </tr>
  );
};

export default ContactTableRow;
