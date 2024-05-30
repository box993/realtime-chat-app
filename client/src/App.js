import React, { useState, useEffect } from 'react';
import LoginRegister from './pages/LoginRegister';
import FrontPage from './pages/FrontPage';
import { removeToken, axiosInstance } from './utils/authUtil'; // Import the configured Axios instance

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          setIsLoggedIn(false);
          localStorage.removeItem('isLoggedIn');
          removeToken();
          setShowAlert(true); // Set showAlert to true on 401 response
          setTimeout(() => {
            window.location.href = '/login';
          }, 5000); // Redirect to login page after 2 seconds
        }
        return Promise.reject(error);
      }
    );
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
    setShowAlert(false); // Hide the alert on successful login
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    removeToken();
    setShowAlert(false); // Hide the alert on logout
  };

  const handleAlertClose = () => {
    setShowAlert(false); // Close the alert manually
  };

  return (
    <>
      {showAlert && (
        <div
          className='alert alert-danger alert-dismissible fade show'
          role='alert'
        >
          You have been logged out due to inactivity.
          <button
            type='button'
            className='btn-close'
            data-bs-dismiss='alert'
            aria-label='Close'
            onClick={handleAlertClose}
          ></button>
        </div>
      )}
      {isLoggedIn ? (
        <FrontPage onLogout={handleLogout} />
      ) : (
        <LoginRegister onLogin={handleLogin} />
      )}
    </>
  );
};

export default App;
