import { Toast } from 'bootstrap';

export default function showToast(containerId: string, message: string, type = "danger") {
    const alertPlaceholder = document.getElementById(containerId);

    // Create the toast element directly
    const toastElement = document.createElement('div');
    toastElement.id = 'liveToast';
    toastElement.classList.add('toast', 'align-items-center', `text-bg-${type}`, 'border-0');
    toastElement.setAttribute('role', type);
    toastElement.setAttribute('aria-live', 'assertive');
    toastElement.setAttribute('aria-atomic', 'true');

    toastElement.innerHTML = `
    <div class="d-flex">
    <div class="toast-body">
      ${message}
    </div>
    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
  </div>
    `;

    alertPlaceholder.append(toastElement);

    const toastBootstrap = new Toast(toastElement, {
        autohide: false // Disable autohide
    });

    toastBootstrap.show();
}

//more "reactish" way: but not practicle cause it needs an ContextPRovder
// const ToastComponent = ({ message, type = 'danger', autohide = true, delay = 5000 }) => {
//     const [showToast, setShowToast] = useState(true);
  
//     useEffect(() => {
//       if (showToast && autohide) {
//         const timer = setTimeout(() => setShowToast(false), delay);
  
//         return () => clearTimeout(timer);
//       }
//     }, [showToast, autohide, delay]);
  
//     useEffect(() => {
//       if (showToast) {
//         const toastBootstrap = new Toast({
//           message,
//           type,
//           // Other options for your toast library (e.g., position, animation, etc.)
//         });
  
//         toastBootstrap.show();
  
//         return () => {
//           toastBootstrap.hide(); // Hide the toast when the component unmounts
//         };
//       }
//     }, [showToast, message, type]);
  
//     return null; // Return null since we don't need any rendering for the component
//   };
  
//   export default ToastComponent;