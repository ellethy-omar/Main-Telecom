import { authenticatedFetch } from "../utils/apiInterceptor";
const API_BASE_URL = process.env.REACT_APP_BASE_URL + '/tickets';

export const ticketsService = {
    async getTicketById(ticketId) {
        const API_URL = API_BASE_URL + `/getTicketById?ticketId=${ticketId}`;

        try {
            const response = await authenticatedFetch(API_URL, { method: 'GET' });

            if (!response.ok) {
                throw new Error("Failed to fetch ticket by ID");
            }

            const data = await response.json();
            console.log(data);
            return data;
        } catch (error) {
            console.error('Error fetching ticket by ID:', error);
            throw error;
        }
    },

    async getTicketsForAgent() {
        const API_URL = API_BASE_URL + "/getTicketByAgentId";

        try {
            const response = await authenticatedFetch(API_URL, { method: 'GET' });

            if (!response.ok) {
                throw new Error("Failed to fetch tickets for agent");
            }

            const data = await response.json();
            console.log(data);
            return data;
        } catch (error) {
            console.error('Error fetching tickets for agent:', error);
            throw error;
        }
    },

    async getTicketsForCertainContact(contactPhone) {
        const API_URL = API_BASE_URL + `/getTicketsByContact?phone=${encodeURIComponent(contactPhone)}`;

        try {
            const response = await authenticatedFetch(API_URL, { method: 'GET' });

            if (!response.ok) {
                throw new Error("Failed to fetch tickets for contact");
            }

            const data = await response.json();
            console.log(data);
            return data;
        } catch (error) {
            console.error('Error fetching tickets for contact:', error);
            throw error;
        }
    },

    async getTicketsByStatus(status) {
        const API_URL = API_BASE_URL + `/getTicketsByStatus?status=${encodeURIComponent(status)}`;

        try {
            const response = await authenticatedFetch(API_URL, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error("Failed to fetch tickets by status");
            }

            const data = await response.json();
            console.log(data);
            return data;
        } catch (error) {
            console.error('Error fetching tickets by status:', error);
            throw error;
        }
    },

    async createTicket(formData) {
        // ! formData should have phone, title, description, status
        // ! Assume the assignedAgentId will that of the sending agent
        const API_URL = API_BASE_URL + `/createTicket`;

        try {
            const response = await authenticatedFetch(API_URL, {
                method: 'POST',
                body: JSON.stringify(formData) 
            });

            if (!response.ok) {
                throw new Error("Failed to create ticket");
            }

            const data = response.json();

            console.log(data);

            return data;
        } catch (error) {
            console.error('Error creating ticket:', error);
            throw error;
        }
    },

    async updateTicket(ticketId, formData) {
        // ! formData should have title, description, status
        const API_URL = API_BASE_URL + `/updateTicket?ticketId=${ticketId}`;

        try {
            const response = await authenticatedFetch(API_URL, {
                method: 'PUT',
                body: JSON.stringify(formData) 
            });

            if (!response.ok) {
                throw new Error("Failed to update ticket");
            }

            const data = response.json();

            console.log(data);

            return data;
        } catch (error) {
            console.error('Error updating ticket:', error);
            throw error;
        }
    },

    async deleteTicket(ticketId) {
        const API_URL = API_BASE_URL + `/deleteTicket?ticketId=${ticketId}`;

        try {
            const response = await authenticatedFetch(API_URL, { method: 'DELETE' });

            if (!response.ok) {
                throw new Error("Failed to delete ticket");
            }
            const data = response.json();

            console.log(data);

            return data;
        } catch (error) {
            console.error('Error deleting ticket:', error);
            throw error;
        }
    }
};
