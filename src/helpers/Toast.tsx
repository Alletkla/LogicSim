import React, { useState, useEffect } from 'react';
import { Toast } from 'bootstrap';

const ToastComponent = ({ message, type = 'danger', autohide = true, delay = 5000 }) => {
  const [showToast, setShowToast] = useState(true);

  useEffect(() => {
    if (showToast && autohide) {
      const timer = setTimeout(() => setShowToast(false), delay);

      return () => clearTimeout(timer);
    }
  }, [showToast, autohide, delay]);

  useEffect(() => {
    if (showToast) {
      const toastBootstrap = new Toast({
        message,
        type,
        // Other options for your toast library (e.g., position, animation, etc.)
      });

      toastBootstrap.show();

      return () => {
        toastBootstrap.hide(); // Hide the toast when the component unmounts
      };
    }
  }, [showToast, message, type]);

  return null; // Return null since we don't need any rendering for the component
};

export default ToastComponent;
