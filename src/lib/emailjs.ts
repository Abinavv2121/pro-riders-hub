import emailjs from '@emailjs/browser';

/**
 * Initialize EmailJS with your public key.
 * This should ideally be called once, perhaps in App.tsx or main.tsx,
 * but it can also just be configured before sending.
 */
export const initEmailJS = () => {
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    if (publicKey) {
        emailjs.init({
            publicKey: publicKey,
        });
    }
};

/**
 * Send an enquiry notification to the Shop/Admin
 */
export const sendAdminNotification = async (templateParams: Record<string, unknown>) => {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_ADMIN;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
        console.error("EmailJS Admin Template missing configuration.");
        throw new Error("Missing EmailJS Admin configuration.");
    }

    return emailjs.send(serviceId, templateId, templateParams, publicKey);
};

/**
 * Send an auto-reply notification to the Customer
 */
export const sendCustomerAutoReply = async (templateParams: Record<string, unknown>) => {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_CUSTOMER;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
        console.error("EmailJS Customer Template missing configuration.");
        throw new Error("Missing EmailJS Customer configuration.");
    }

    return emailjs.send(serviceId, templateId, templateParams, publicKey);
};
