import { useState, useEffect, useRef } from 'react';
import { Toast } from 'bootstrap';

export default function ToastMessage({ message, type = 'danger', autohide = true, delay = 5000, onClose }) {
    const [showToast, setShowToast] = useState(true);
    const toastRef = useRef()

    useEffect(() => {
        if (showToast) {
            const toastBootstrap = new Toast(toastRef.current, {
                message,
                type,
                autohide: autohide,
                delay: delay,
            });
            console.log(autohide)

            toastBootstrap.show();

            return () => {
                toastBootstrap.hide(); // Hide the toast when the component unmounts
            };
        }
    }, [showToast, message, type]);

    return (
        <div ref={toastRef} className={`toast align-items-center text-bg-${type} border-0`} role={type} aria-live='assertive' aria-atomic='true'>
            <div className="d-flex">
                <div className="toast-body">
                    {message}
                </div>
                <button onClick={onClose} type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    )
};
