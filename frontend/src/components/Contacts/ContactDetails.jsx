import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import FormContainer from "../Form/FormContainer";
import FormInput from "../Form/FormInput";
import AlertOverlayed from "../Alert/AlertOverlayed";
import Alert from "../Alert/Alert";
import { contactsService } from "../../services/contactsService";
import Loading from "../Loading/Loading";
import { validateContact } from "../../utils/validations";
import { useNavigate } from "react-router-dom";

const ContactDetails = ({ isCreating = false }) => {
  const navigate = useNavigate();
  const { phone } = useParams();
  const [alert, setAlert] = useState(null);
  const [contact, setContact] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const initializeEmptyContact = () => ({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    position: '',
    notes: '',
    phone: ''
  });

  useEffect(() => {
    if (isCreating) {
      setContact(initializeEmptyContact());
    } else {
      const fetchContact = async () => {
        const result = await contactsService.getContactByPhone(phone);
        setContact(result);
      };
      fetchContact();
    }
  }, [phone, isCreating]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContact((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreate = async () => {
    try {
      const { isValid, errors } = validateContact(contact);

      if (!isValid) {
        setAlert({
          message: errors[0],
          type: 'error'
        });
        return;
      }

      await contactsService.createContact(contact);

      setAlert({
        message: 'Contact created successfully',
        type: 'success'
      });

      // Navigate back to contacts list after successful creation
      setTimeout(() => {
        navigate('/dashboard/contacts');
      }, 1500);

    } catch (err) {
      console.error("Create failed", err);
      setAlert({
        message: 'Failed to create contact',
        type: 'error'
      });
    }
  };

  const handleUpdate = async () => {
    try {
      const { isValid, errors } = validateContact(contact);

      if (!isValid) {
        setAlert({
          message: errors[0],
          type: 'error'
        });
        return;
      }

      await contactsService.updateContact(contact.phone, contact);

      setAlert({
        message: 'Contact updated successfully',
        type: 'success'
      });

    } catch (err) {
      console.error("Update failed", err);
      setAlert({
        message: 'Failed to update contact',
        type: 'error'
      });
    }
  };

  const handleDelete = async () => {
    try {
      await contactsService.deleteContact(contact.phone);
      setAlert({
        message: 'Contact deleted successfully',
        type: 'success'
      });

      setTimeout(() => {
        navigate('/dashboard/contacts');
      }, 1500);

    } catch (err) {
      console.error("Delete failed", err);
      setAlert({
        message: 'Failed to delete contact',
        type: 'error'
      });
    }
  };

  if (!contact) return <Loading />;

  return (
    <>
      <FormContainer title={isCreating ? "Create New Contact" : "Edit Contact"}>
        <div className="space-y-4">
          <FormInput
            id="firstName"
            name="firstName"
            label="First Name"
            type="text"
            value={contact.firstName}
            onChange={handleChange}
          />
          <FormInput
            id="lastName"
            name="lastName"
            label="Last Name"
            type="text"
            value={contact.lastName}
            onChange={handleChange}
          />
          <FormInput
            id="email"
            name="email"
            label="Email"
            type="email"
            value={contact.email}
            onChange={handleChange}
          />
          <FormInput
            id="company"
            name="company"
            label="Company"
            type="text"
            value={contact.company}
            onChange={handleChange}
          />
          <FormInput
            id="position"
            name="position"
            label="Position"
            type="text"
            value={contact.position}
            onChange={handleChange}
          />
          <FormInput
            id="notes"
            name="notes"
            label="Notes"
            type="text"
            value={contact.notes}
            onChange={handleChange}
          />
          <FormInput
            id="phone"
            name="phone"
            label={isCreating ? "Phone" : "Phone (Uneditable)"}
            type="text"
            value={contact.phone}
            onChange={isCreating ? handleChange : () => {}}
            disabled={!isCreating}
            className={!isCreating ? "disabled" : ""}
          />
          
          <div className="flex justify-between space-x-2 pt-2">
            {isCreating ? (
              <>
                <button
                  onClick={handleCreate}
                  className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
                >
                  Create Contact
                </button>
                <button
                  onClick={() => navigate('/dashboard/contacts')}
                  className="w-full bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleUpdate}
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition"
                >
                  Delete Contact
                </button>
              </>
            )}
          </div>
        </div>

        {showDeleteConfirm && !isCreating && (
          <AlertOverlayed
            message={`Are you sure you want to delete ${contact.firstName} ${contact.lastName}?`}
            onConfirm={handleDelete}
            onCancel={() => setShowDeleteConfirm(false)}
          />
        )}
      </FormContainer>

      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
    </>
  );
};

export default ContactDetails;