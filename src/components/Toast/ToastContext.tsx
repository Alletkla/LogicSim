import { PropsWithChildren, createContext, useContext, useState } from "react";
import ToastMessage from "./ToastMessage";


export interface Toast {
    message: string,
    type: string
}

interface ToastContextProps {
    addToast: (message: string, type: string, delay?: number) => void;
    removeToast: (index: number) => void;
}

const ToastContext = createContext<ToastContextProps>(null)

export function ToastProvider({ children }: PropsWithChildren) {
    const [toasts, setToasts] = useState<{message: string, type: string, delay: number}[]>([])

    /**
     * Adds a new Toast to the Context
     * @param message to print in the toast
     * @param type Bootstrap type [primary, secondary, success, danger, warning, info, light, dark]
     * @param delay Set to -1 for not autohiding the toast
     */
    function addToast(message: string, type: string, delay?: number) {
        setToasts(prevToasts => [...prevToasts, { message, type,  delay}])
    }

    function removeToast(index: number) {
        setToasts(prevToasts => prevToasts.filter((_, i) => i !== index))
    }

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            <div id="toast_container" className="toast-container position-fixed top-0 end-0 p-3">
                {/* @TODO dont use index as key */}
                {toasts.map((toast, index) => (
                    <ToastMessage key={index} message={toast.message} type={toast.type} onClose={() => removeToast(index)} autohide={toast.delay !== -1}  delay={toast.delay}/>
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export function useToast() {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider')
    }
    return context
}