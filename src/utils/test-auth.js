// Test authentication utility
import api from './axios.js';

export const testAuthentication = async () => {
  console.log('Testing authentication...');
  
  try {
    // Test 1: Check if user is authenticated
    const userResponse = await api.get('/user/getuser');
    console.log('✅ User is authenticated:', userResponse.data);
    return { authenticated: true, user: userResponse.data.user };
  } catch (error) {
    console.log('❌ User is not authenticated:', error.response?.status);
    return { authenticated: false, error: error.response?.status };
  }
};

export const testLogin = async (email, password, role) => {
  console.log('Testing login...');
  
  try {
    const loginResponse = await api.post('/user/login', { email, password, role });
    console.log('✅ Login successful:', loginResponse.data);
    return { success: true, data: loginResponse.data };
  } catch (error) {
    console.log('❌ Login failed:', error.response?.data);
    return { success: false, error: error.response?.data };
  }
};

export const testLogout = async () => {
  console.log('Testing logout...');
  
  try {
    const logoutResponse = await api.get('/user/logout');
    console.log('✅ Logout successful:', logoutResponse.data);
    return { success: true, data: logoutResponse.data };
  } catch (error) {
    console.log('❌ Logout failed:', error.response?.data);
    return { success: false, error: error.response?.data };
  }
}; 