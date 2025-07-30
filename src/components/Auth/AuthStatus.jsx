import React, { useContext, useState } from "react";
import { Context } from "../../main";
import api from "../../utils/axios.js";
import toast from "react-hot-toast";

const AuthStatus = () => {
  const { isAuthorized, user } = useContext(Context);
  const [testing, setTesting] = useState(false);

  const testAuth = async () => {
    setTesting(true);
    try {
      const response = await api.get("/user/getuser");
      console.log("✅ Authentication test successful:", response.data);
      toast.success("Authentication working!");
    } catch (error) {
      console.error("❌ Authentication test failed:", error.response?.status);
      if (error.response?.status === 401) {
        toast.error("Not authenticated. Please login first.");
      } else {
        toast.error("Authentication test failed");
      }
    } finally {
      setTesting(false);
    }
  };

  const checkCookies = () => {
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
    
    if (tokenCookie) {
      console.log("✅ Token cookie found:", tokenCookie);
      toast.success("Token cookie is present");
    } else {
      console.log("❌ No token cookie found");
      toast.error("No token cookie found");
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>Authentication Status</h3>
      <p><strong>isAuthorized:</strong> {isAuthorized ? '✅ Yes' : '❌ No'}</p>
      <p><strong>User:</strong> {user ? `${user.name} (${user.role})` : 'None'}</p>
      
      <div style={{ marginTop: '10px' }}>
        <button 
          onClick={testAuth} 
          disabled={testing}
          style={{ marginRight: '10px', padding: '5px 10px' }}
        >
          {testing ? 'Testing...' : 'Test Authentication'}
        </button>
        
        <button 
          onClick={checkCookies}
          style={{ padding: '5px 10px' }}
        >
          Check Cookies
        </button>
      </div>
      
      <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
        <p>Open browser console to see detailed logs</p>
      </div>
    </div>
  );
};

export default AuthStatus; 