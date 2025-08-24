import { authenticatedFetch } from "../utils/apiInterceptor";

const API_BASE_URL = process.env.REACT_APP_BASE_URL + "/calls";
const API_BASE_URL_CRUD = API_BASE_URL + "/crud";

export const callsService = {
    async getCallsForMe() {
        const API_URL = API_BASE_URL_CRUD + "/getCallsForMe";
        try {
            const response = await authenticatedFetch(API_URL, { method: "GET" });

            if (!response.ok) 
                throw new Error("Failed to fetch calls for agent");

            return await response.json();
        } catch (error) {
            console.error("Error fetching calls for agent:", error);
            throw error;
        }
    },

    async createCall(callData) {
        const API_URL = API_BASE_URL_CRUD + "/createCall";
        try {
            const response = await authenticatedFetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(callData),
            });

            if (!response.ok)
                throw new Error("Failed to create call");

            return await response.json();
        } catch (error) {
            console.error("Error creating call:", error);
            throw error;
        }
    },

    async getCallById(id) {
        const API_URL = `${API_BASE_URL_CRUD}/getCallById/${id}`;
        try {
            const response = await authenticatedFetch(API_URL, { method: "GET" });

            if (!response.ok)
                throw new Error("Failed to fetch call by ID");

            return await response.json();
        } catch (error) {
            console.error("Error fetching call by ID:", error);
            throw error;
        }
    },

    async getCallsByPhone(phone) {
        const API_URL = `${API_BASE_URL_CRUD}/getCallsByPhone/${encodeURIComponent(phone)}`;
        try {
            const response = await authenticatedFetch(API_URL, { method: "GET" });

            if (!response.ok) 
                throw new Error("Failed to fetch calls by phone");

            return await response.json();
        } catch (error) {
            console.error("Error fetching calls by phone:", error);
            throw error;
        }
    },

    async getCallsByAgent(agentId) {
        const API_URL = `${API_BASE_URL_CRUD}/getCallsByAgent/${agentId}`;
        try {

            const response = await authenticatedFetch(API_URL, { method: "GET" });
            if (!response.ok) 
                throw new Error("Failed to fetch calls by agent");

            return await response.json();
        } catch (error) {
        console.error("Error fetching calls by agent:", error);
        throw error;
        }
    },

    async getCallsByDateRange(startDate, endDate) {
        const API_URL = `${API_BASE_URL_CRUD}/getCallsByDateRange?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
        try {
            const response = await authenticatedFetch(API_URL, { method: "GET" });

            if (!response.ok) 
                throw new Error("Failed to fetch calls by date range");

            return await response.json();
        } catch (error) {
            console.error("Error fetching calls by date range:", error);
            throw error;
        }
    },

    async searchCallsBySummary(query) {
        const API_URL = `${API_BASE_URL_CRUD}/searchCallsBySummary?q=${encodeURIComponent(query)}`;
        try {
            const response = await authenticatedFetch(API_URL, { method: "GET" });

            if (!response.ok) 
                throw new Error("Failed to search calls by summary");
            
            return await response.json();
        } catch (error) {
            console.error("Error searching calls by summary:", error);
            throw error;
        }
    },

    async updateCallSummary(id, summary) {
        const API_URL = `${API_BASE_URL_CRUD}/updateCallSummary/${id}`;
        try {
            const response = await authenticatedFetch(API_URL, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ summary }),
            });

            if (!response.ok) 
                throw new Error("Failed to update call summary");
            
            return await response.json();
        } catch (error) {
        console.error("Error updating call summary:", error);
        throw error;
        }
    },

    async getCallsWithoutSummary() {
        const API_URL = API_BASE_URL_CRUD + "/getCallsWithoutSummary";
        try {
            const response = await authenticatedFetch(API_URL, { method: "GET" });

            if (!response.ok) 
                throw new Error("Failed to fetch calls without summary");

            return await response.json();
        } catch (error) {
            console.error("Error fetching calls without summary:", error);
            throw error;
        }
    },

    async deleteCall(id) {
        const API_URL = `${API_BASE_URL_CRUD}/deleteCall/${id}`;
        try {
            const response = await authenticatedFetch(API_URL, { method: "DELETE" });

            if (!response.ok)
                throw new Error("Failed to delete call");
            return await response.json();
        } catch (error) {
            console.error("Error deleting call:", error);
            throw error;
        }
    }
};
