import React, { useRef, useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { toast } from 'react-toastify';
import emailjs from "@emailjs/browser";

const Contact = () => {
  const formRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // EmailJS configuration
    const serviceId = 'service_nkh3h2o';
    const templateId = 'template_9j52fmf';
    const publicKey = 'H-Pf9nDC3WyS-5kuc';
    const toName = 'Theja Ashwin';
    const toEmail = 'thejaashwin62@gmail.com';

    const templateParams = {
      from_name: formData.name,
      to_name: toName,
      from_email: formData.email,
      to_email: toEmail,
      subject: formData.subject,
      message: formData.message,
    };

    try {
      const response = await emailjs.send(
        serviceId, 
        templateId, 
        templateParams, 
        publicKey
      );
      toast.success('Message sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Get in Touch</h1>
              <p className="mt-4 text-lg text-gray-600">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </div>

            <div className="space-y-6">
              {/* Email Card */}
              <div className="flex items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-6">
                  <h3 className="text-lg font-medium text-gray-900">Email</h3>
                  <p className="mt-1 text-gray-600">thejaashwin62@gmail.com</p>
                </div>
              </div>

              {/* Phone Card */}
              <div className="flex items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Phone className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-6">
                  <h3 className="text-lg font-medium text-gray-900">Phone</h3>
                  <p className="mt-1 text-gray-600">+91 9876543210</p>
                </div>
              </div>

              {/* Address Card */}
              <div className="flex items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-6">
                  <h3 className="text-lg font-medium text-gray-900">Address</h3>
                  <p className="mt-1 text-gray-600">Salem, Tamil Nadu, India</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
              {/* Name Field */}
              <div className="form-control">
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                    transition-all duration-200
                    bg-gray-50 focus:bg-white"
                  placeholder="Enter your name"
                  required
                />
              </div>

              {/* Email Field */}
              <div className="form-control">
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                    transition-all duration-200
                    bg-gray-50 focus:bg-white"
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Subject Field */}
              <div className="form-control">
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                    transition-all duration-200
                    bg-gray-50 focus:bg-white"
                  placeholder="Enter subject"
                  required
                />
              </div>

              {/* Message Field */}
              <div className="form-control">
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                    transition-all duration-200
                    bg-gray-50 focus:bg-white
                    h-32 resize-none"
                  placeholder="Write your message here..."
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 rounded-xl font-medium transition-all duration-300
                  bg-gradient-to-r from-blue-600 to-indigo-600 
                  hover:from-blue-700 hover:to-indigo-700
                  text-white shadow-lg hover:shadow-xl
                  disabled:opacity-70 disabled:cursor-not-allowed
                  flex items-center justify-center space-x-2
                  mt-6"
              >
                {isLoading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;