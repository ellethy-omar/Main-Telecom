import { authenticatedFetch } from "../utils/apiInterceptor";
const API_BASE_URL = process.env.REACT_APP_BASE_URL + '/profile';

export const profileService = {
  async getProfile() {
    const token = localStorage.getItem('token');
    const API_URL = API_BASE_URL + "/getAgentProfile";

    try {
      const result = await authenticatedFetch(API_URL, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!result.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await result.json();
      console.log(data);

      return data;
    } catch (error) {
      console.log('Profile fetch error:', error);
      throw error;
    }
  },

  async updateProfile(profileData) {
    const API_URL = API_BASE_URL + "/updateAgentProfile";

    console.log(profileData);

    const result = await authenticatedFetch(API_URL, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });

    if (!result.ok) {
      throw new Error('Failed to update profile');
    }

    return await result.json();
  },

  async updateProfileImage(formData) {
    // ! content-type is multipart/form-data
    const API_URL = process.env.REACT_APP_BASE_URL + '/cloudinary/uploadProfileImage';
    const token = localStorage.getItem('token');

    const result = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData,
    });

    if (!result.ok) {
      const errorText = await result.text();
      throw new Error(errorText || 'Image upload failed');
    }

    const data = await result.json();
    console.log(data);

    return data.imageURL;
  },
};
