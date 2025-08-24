import { authenticatedFetch } from "../utils/apiInterceptor";
const API_BASE_URL = process.env.REACT_APP_BASE_URL + '/contacts';

export const contactsService = {
  async getAllContacts() {
    const API_URL = API_BASE_URL + "/getAllContacts";
    try {
      const result = await authenticatedFetch(API_URL, { method: 'GET' });

      if (!result.ok) {
        throw new Error('Failed to fetch all contacts');
      }

      const data = await result.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error fetching all contacts:', error);
      throw error;
    }
  },

  async getContactByPhone(phone) {
    const API_URL = API_BASE_URL + `/getContactByPhone/${phone}`;
    try {
      const result = await authenticatedFetch(API_URL, { method: 'GET' });

      if (!result.ok) {
        throw new Error('Failed to fetch contact by phone');
      }

      const data = await result.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error fetching contact by phone:', error);
      throw error;
    }
  },

  async createContact(formData) {
    const API_URL = API_BASE_URL + `/createContact`;

    try {
      const result = await authenticatedFetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      if (!result.ok) {
        throw new Error('Failed to create contact');
      }

      const data = await result.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
  },

  async updateContact(phone, formData) {
    const API_URL = API_BASE_URL + `/updateContact/${phone}`;

    try {
      const result = await authenticatedFetch(API_URL, {
        method: 'PUT',
        body: JSON.stringify(formData)
      });

      if (!result.ok) {
        throw new Error('Failed to update contact');
      }

      const data = await result.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  },

  async deleteContact(phone) {
    const API_URL = API_BASE_URL + `/deleteContact/${phone}`;
    try {
      const result = await authenticatedFetch(API_URL, { method: 'DELETE' });

      if (!result.ok) {
        throw new Error('Failed to delete contact');
      }

      const data = await result.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw error;
    }
  },
};
