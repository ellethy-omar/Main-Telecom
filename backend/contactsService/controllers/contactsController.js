const Contact = require('../models/Contact');
const { validateContact, isValidPhone } = require('../utils/validators');

const getAllContacts = async (req, res) => {
    console.log('getAllContacts endpoint hit')
    try {
        const contacts = await Contact.findAll();

        console.log('fetched contacts', contacts);

        res.json(contacts);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ error: 'Failed to fetch contacts' });
    }
};

const getContactByPhone = async (req, res) => {
    const { phone } = req.params;

    console.log('getContactByPhone endpoint hit for phone: ', phone);
    if (!phone || !isValidPhone(phone)) {
        return res.status(400).json({ error: "No phone provided!" })
    }

    try {
        const contact = await Contact.findByPhone(phone);

        console.log('Contact fetched:', contact);

        if (!contact) {
            console.log('Contact not found!');
            return res.status(404).json({ error: 'Contact not found' });
        }

        res.json(contact);
    } catch (error) {
        console.error('Error fetching contact by phone:', error);
        res.status(500).json({ error: 'Failed to fetch contact' });
    }
};

const createContact = async (req, res) => {
    const validation = validateContact(req.body);

    console.log('createContact endpoint hit');
    if (!validation.isValid) {
        return res.status(400).json({ error: validation.errors });
    }

    try {
        const { phone } = req.body.phone;
        const contact = await Contact.findByPhone(phone)

        if (contact) {
            console.log('Contact already exists!');
            return res.status(400).json({ error: "Contact with this phone number already exists" });
        }

        const createdContact = await Contact.create(req.body);

        console.log('createdContact:', createdContact);

        res.status(201).json(createdContact);
    } catch (error) {
        console.error('Error creating contact:', error);
        res.status(500).json({ error: 'Failed to create contact' });
    }
};

const updateContact = async (req, res) => {
    const { phone } = req.params;

    console.log('updateContact endpoint hit for phone:', phone);

    if (!phone || !isValidPhone(phone)) {
        return res.status(400).json({ error: "No phone provided!" })
    }

    const validation = validateContact(req.body);
    if (!validation.isValid) {
        return res.status(400).json({ error: validation.errors });
    }

    try {
        const updated = await Contact.update(phone, req.body);

        console.log('updated:', updated);

        if (!updated) {
            console.log('Contact not found!');
            return res.status(404).json({ error: 'Contact not found' });
        }

        res.json({ message: 'Contact updated successfully' });
    } catch (error) {
        console.error('Error updating contact:', error);
        res.status(500).json({ error: 'Failed to update contact' });
    }
};

const updateContactNotes = async (req, res) => {
    const { phone } = req.params;

    console.log('deleteContact endpoint hit for phone:', phone);

    if (!phone || !isValidPhone(phone)) {
        return res.status(400).json({ error: "No phone provided!" })
    }

    const { notes } = req.body;

    if (!notes) {
        return res.status(400).json({ error: "No notes provided!" })
    }

    try {
        const updated = await Contact.updateNotes(phone, notes);

        console.log('updated:', updated);

        if (!updated) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        res.json({ message: 'Contact notes updated successfully' });
    } catch (error) {
        console.error('Error updating contact:', error);
        res.status(500).json({ error: 'Failed to update contact' });
    }
}

const deleteContact = async (req, res) => {
    const { phone } = req.params;

    console.log('deleteContact endpoint hit for phone:', phone);

    if (!phone || !isValidPhone(phone)) {
        return res.status(400).json({ error: "No phone provided!" })
    }

    try {
        const deleted = await Contact.delete(phone);

         console.log('deleted:', deleted);

        if (!deleted) {
            console.log('Contact not found!');
            return res.status(404).json({ error: 'Contact not found' });
        }

        res.json({ message: 'Contact deleted successfully' });
    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({ error: 'Failed to delete contact' });
    }
};

const search3CX = async (req, res) => {
    const { phoneNumber, displayName } = req.query;

    console.log('Searching for 3CX contact with phone:', phoneNumber, 'and display name:', displayName);

    if (!phoneNumber) {
        return res.status(400).json({ error: 'Phone number is required' });
    }

    try {
        const contact = await Contact.findByPhone(phoneNumber);

        if (!contact) {
            return res.json({
                found: false,
                message: 'Contact not found',
                phoneNumber: phoneNumber
            });
        }

        console.log('Contact found for phone:', phoneNumber, contact);

        res.json({
            found: true,
            contact: contact
        });
    } catch (error) {
        console.error('Error fetching contact for 3CX:', error);
        res.status(500).json({ error: 'Failed to fetch contact' });
    }
};

module.exports = {
  getAllContacts,
  getContactByPhone,
  createContact,
  updateContact,
  updateContactNotes,
  deleteContact,
  search3CX
};