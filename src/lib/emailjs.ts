import emailjs from '@emailjs/browser';

export const initEmailJS = () => {
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    if (publicKey) {
        emailjs.init({ publicKey });
    }
};

export const sendAdminNotification = async (templateParams: Record<string, unknown>) => {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_ADMIN;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    if (!serviceId || !templateId || !publicKey) throw new Error("Missing EmailJS Admin config.");
    return emailjs.send(serviceId, templateId, templateParams, publicKey);
};

export const sendCustomerAutoReply = async (templateParams: Record<string, unknown>) => {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_CUSTOMER;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
    if (!serviceId || !templateId || !publicKey) throw new Error("Missing EmailJS Customer config.");
    return emailjs.send(serviceId, templateId, templateParams, publicKey);
};

/**
 * Sends an admin reply email to a customer.
 * Uses template VITE_EMAILJS_TEMPLATE_ID_REPLY.
 *
 * === HOW TO SET UP THE EMAILJS TEMPLATE ===
 * 1. Go to https://dashboard.emailjs.com → Email Templates → Create New Template
 * 2. Template Name: "admin_reply"
 * 3. To Email:  {{to_email}}
 * 4. From Name: ProBikers Hub
 * 5. Subject:   {{subject}}
 * 6. Body (HTML — paste exactly):
 * ---
 * <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;border:1px solid #eee">
 *   <div style="background:#0b0f14;padding:24px 32px">
 *     <h1 style="color:#fff;margin:0;font-size:20px;letter-spacing:1px">ProBikers Hub</h1>
 *     <p style="color:#aaa;margin:4px 0 0;font-size:12px">Chennai's Premier Cycling Store</p>
 *   </div>
 *   <div style="padding:32px">
 *     <p style="color:#333;font-size:15px">Dear <strong>{{to_name}}</strong>,</p>
 *     <p style="color:#555;font-size:14px">Thank you for reaching out about <strong>{{product_name}}</strong>. Our team has responded:</p>
 *     <div style="background:#f9fafb;border-left:4px solid #0b0f14;padding:16px 20px;margin:20px 0;border-radius:0 8px 8px 0">
 *       <p style="margin:0;color:#0b0f14;font-size:14px;line-height:1.7">{{reply_message}}</p>
 *     </div>
 *     <p style="color:#555;font-size:14px">Feel free to visit us or reply to this email if you have more questions.</p>
 *     <div style="margin-top:28px;padding-top:20px;border-top:1px solid #eee">
 *       <p style="color:#999;font-size:12px;margin:0">ProBikers Hub — No. 1 Cycling Store, Chennai</p>
 *       <p style="color:#999;font-size:12px;margin:4px 0 0">📞 +91 98765 43210 | ✉ info@probikershub.com</p>
 *     </div>
 *   </div>
 * </div>
 * ---
 * 7. Save the template → copy the Template ID
 * 8. Add to .env:  VITE_EMAILJS_TEMPLATE_ID_REPLY=template_xxxxxxx
 */
export const sendReplyEmail = async (params: {
    to_email: string;
    to_name: string;
    product_name: string;
    reply_message: string;
    subject: string;
}) => {
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_REPLY;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !publicKey) throw new Error("Missing EmailJS service config.");

    // Fallback to customer template if reply template not yet configured
    const tid = templateId || import.meta.env.VITE_EMAILJS_TEMPLATE_ID_CUSTOMER;
    if (!tid) throw new Error("No EmailJS template configured.");

    return emailjs.send(serviceId, tid, params as unknown as Record<string, unknown>, publicKey);
};
