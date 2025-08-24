import { authenticatedFetch } from "../utils/apiInterceptor";
const API_BASE_URL = process.env.REACT_APP_BASE_URL + '/auth';

export const authService = {
  register: async (userData) => {
    try {
      const API_URL =`${API_BASE_URL}/register`
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const result = await response.json();
      console.log(`[authService] Recieved repssonse from register endpoint: ${JSON.stringify(result)}`);

      const token = result.token;
      localStorage.setItem('token', token);

      return result;
    } catch (error) {
      throw new Error(error.message || 'Something went wrong. Please try again.');
    }
  },

  login: async (credentials) => {
    try {
      const API_URL = `${API_BASE_URL}/login`;
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const result = await response.json();
      console.log(`[authService] Recieved repssonse from login endpoint: ${JSON.stringify(result)}`);

      const token = result.token;
      localStorage.setItem('token', token);

      return result;
    } catch (error) {
      throw new Error(error.message || 'Something went wrong. Please try again.');
    }
  },

  verifyToken: async (token) => {
    try {
      const API_URL = `${API_BASE_URL}/verifyToken`;
      const response = await authenticatedFetch(API_URL, { method: 'GET' });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Token expired or invalid');
        }
        throw new Error('Token verification failed');
      }

      const result = await response.json();
      console.log(`[authService] Token verification successful: ${JSON.stringify(result)}`);
      return { success: true, data: result };
    } catch (error) {
      console.log(`[authService] Token verification failed: ${error.message}`);
      return { success: false, error: error.message };
    }
  }
};