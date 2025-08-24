let authContext = null;

export const setAuthContext = (context) => {
  authContext = context;
};

export const authenticatedFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    
    if (response.status === 401 || response.status === 403) {
        console.log('[API Interceptor] Authentication failed - Token expired or invalid');

        authContext?.setSessionExpired(true);

        setTimeout(() => {
            authContext.forceLogout();
        }, 3000);
      
        throw new Error('Authentication expired. Please log in again.');
    }
    
    return response;
  } catch (error) {
    if (error.message === 'Authentication expired. Please log in again.') {
      throw error;
    }
    
    console.log('[API Interceptor] Network or other error:', error);
    throw error;
  }
};