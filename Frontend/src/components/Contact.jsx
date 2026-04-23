import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaClock, FaMapMarkerAlt, FaFacebook, FaInstagram, FaTwitter, FaHeadset, FaWhatsapp, FaTiktok, FaYoutube, FaPinterest, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    orderNumber: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(''); // 'success' or 'error'
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear any previous submit status when user starts typing
    if (submitStatus) {
      setSubmitStatus('');
      setSubmitMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');
    setSubmitMessage('');

    try {
      // Prepare email data
      const emailData = {
        to: 'support@kilifoniabeautybliss.co.ke',
        from: formData.email,
        subject: `Kilifonia Beauty Contact: ${formData.subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #e11d48; border-bottom: 2px solid #e11d48; padding-bottom: 10px;">New Contact Form Submission</h2>
            
            <div style="background: #fdf2f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #e11d48; margin-top: 0;">Contact Details</h3>
              <p><strong>Name:</strong> ${formData.name}</p>
              <p><strong>Email:</strong> ${formData.email}</p>
              <p><strong>Subject:</strong> ${formData.subject}</p>
              ${formData.orderNumber ? `<p><strong>Order Number:</strong> ${formData.orderNumber}</p>` : ''}
            </div>

            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #e11d48; margin-top: 0;">Message</h3>
              <p style="white-space: pre-wrap; line-height: 1.6;">${formData.message}</p>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px;">
                This message was sent from the Dubois Beauty contact form on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}.
              </p>
            </div>
          </div>
        `,
        text: `
          New Contact Form Submission - Kilifonia Beauty

          Contact Details:
          Name: ${formData.name}
          Email: ${formData.email}
          Subject: ${formData.subject}
          ${formData.orderNumber ? `Order Number: ${formData.orderNumber}` : ''}

          Message:
          ${formData.message}

          Sent on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
        `
      };

      // Send email using your backend API
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setSubmitMessage('Thank you! Your message has been sent to Kilifonia Beauty. We will get back to you within 2-4 hours.');
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          orderNumber: ''
        });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitStatus('error');
      setSubmitMessage('Sorry, there was an error sending your message. Please try again or contact us directly at support@kilifoniabeautybliss.co.ke');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Updated contact methods with correct email
  const contactMethods = [
    {
      icon: FaHeadset,
      title: 'Customer Service',
      description: 'Our beauty experts are here to help',
      contact: '+254 792491368',
      hours: 'Mon-Sun: 8:00 AM - 10:00 PM EAT',
      action: 'Call Now',
      link: 'tel:+254792491368'
    },
    {
      icon: FaWhatsapp,
      title: 'WhatsApp Support',
      description: 'Quick responses via WhatsApp',
      contact: '+254 792491368',
      hours: '24/7 for urgent inquiries',
      action: 'Chat on WhatsApp',
      link: 'https://wa.me/254792491368'
    },
    {
      icon: FaEnvelope,
      title: 'Email Support',
      description: 'Send us a message anytime',
      contact: 'support@kilifoniabeautybliss.co.ke',
      hours: 'Response within 2-4 hours',
      action: 'Send Email',
      link: 'mailto:support@kilifonialbeautyblis.co.ke'
    },
    {
      icon: FaMapMarkerAlt,
      title: 'Visit Our Shop',
      description: 'Experience our products in person',
      contact: 'Kilifi CBD, Kenya',
      hours: 'Mon-Sat: 9:00 AM - 7:00 PM',
      action: 'Get Directions',
      link: 'https://maps.google.com/?q=Kilifi+CBD+Kenya'
    }
  ];

  const subjectOptions = [
    'Product Inquiry',
    'Order Issue',
    'Shipping Question',
    'Returns & Exchanges',
    'Skincare Advice',
    'Makeup Consultation',
    'Wholesale Inquiry',
    'Business Partnership',
    'Press & Media',
    'Other'
  ];

  // Social media links from footer
  const socialMedia = [
    {
      icon: FaInstagram,
      name: 'Instagram',
      link: 'https://instagram.com/kilifoniabeauty',
      color: 'hover:text-pink-600',
      bgColor: 'bg-gradient-to-r from-purple-500 to-pink-500'
    },
    {
      icon: FaFacebook,
      name: 'Facebook',
      link: 'https://facebook.com/kilifoniabeauty',
      color: 'hover:text-blue-600',
      bgColor: 'bg-blue-600'
    },
    {
      icon: FaTiktok,
      name: 'TikTok',
      link: 'https://tiktok.com/@kilifoniabeauty',
      color: 'hover:text-black',
      bgColor: 'bg-black'
    },
    {
      icon: FaYoutube,
      name: 'YouTube',
      link: 'https://youtube.com/@kilifoniabeauty',
      color: 'hover:text-red-600',
      bgColor: 'bg-red-600'
    },
    {
      icon: FaPinterest,
      name: 'Pinterest',
      link: 'https://pinterest.com/kilifoniabeauty',
      color: 'hover:text-red-500',
      bgColor: 'bg-red-500'
    },
    {
      icon: FaTwitter,
      name: 'Twitter',
      link: 'https://twitter.com/kilifoniabeauty',
      color: 'hover:text-blue-400',
      bgColor: 'bg-blue-400'
    }
  ];

  // Business information from footer
  const businessInfo = {
    name: 'Kilifonia Beauty',
    description: 'Your premier destination for luxury skincare and beauty products in Kenya.',
    email: 'support@kilifoniabeautybliss.co.ke',
    phone: '+254 792491368',
    address: 'Kilifi CBD, Kenya',
    operatingHours: 'Monday - Sunday: 8:00 AM - 10:00 PM EAT'
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're here to help with all your beauty questions and concerns. Get in touch with Kilifonia Beauty!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-rose-100 p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send us a Message</h2>
            
            {/* Submission Status Messages */}
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
                <FaCheckCircle className="text-green-500 text-xl mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-green-800 font-medium">Message Sent Successfully!</p>
                  <p className="text-green-700 text-sm mt-1">{submitMessage}</p>
                </div>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                <FaExclamationCircle className="text-red-500 text-xl mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-red-800 font-medium">Failed to Send Message</p>
                  <p className="text-red-700 text-sm mt-1">{submitMessage}</p>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-rose-200 focus:border-rose-300 focus:ring-2 focus:ring-rose-100 outline-none transition-all"
                    placeholder="Your full name"
                    disabled={isSubmitting}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-rose-200 focus:border-rose-300 focus:ring-2 focus:ring-rose-100 outline-none transition-all"
                    placeholder="your@email.com"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <select
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-rose-200 focus:border-rose-300 focus:ring-2 focus:ring-rose-100 outline-none transition-all"
                  disabled={isSubmitting}
                >
                  <option value="">Select a subject</option>
                  {subjectOptions.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Number (if applicable)
                </label>
                <input
                  type="text"
                  name="orderNumber"
                  value={formData.orderNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-rose-200 focus:border-rose-300 focus:ring-2 focus:ring-rose-100 outline-none transition-all"
                  placeholder="e.g., DB123456"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  required
                  rows="6"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-rose-200 focus:border-rose-300 focus:ring-2 focus:ring-rose-100 outline-none transition-all resize-vertical"
                  placeholder="Tell us how we can help you..."
                  disabled={isSubmitting}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-rose-500 text-white py-3 px-6 rounded-lg hover:bg-rose-600 disabled:bg-rose-400 transition-colors font-medium text-lg flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Sending...
                  </>
                ) : (
                  'Send Message to Kilifonia Beauty'
                )}
              </button>

              <p className="text-sm text-gray-500 text-center">
                Your message will be sent directly to <strong>support@kilifoniabeautybliss.co.ke</strong>
              </p>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Business Overview */}
            <div className="bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl p-6 text-white">
              <h3 className="text-2xl font-semibold mb-3">{businessInfo.name}</h3>
              <p className="mb-4 opacity-90">{businessInfo.description}</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <FaEnvelope className="mr-3 opacity-80" />
                  <span>{businessInfo.email}</span>
                </div>
                <div className="flex items-center">
                  <FaPhone className="mr-3 opacity-80" />
                  <span>{businessInfo.phone}</span>
                </div>
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-3 opacity-80" />
                  <span>{businessInfo.address}</span>
                </div>
                <div className="flex items-center">
                  <FaClock className="mr-3 opacity-80" />
                  <span>{businessInfo.operatingHours}</span>
                </div>
              </div>
            </div>

            {/* Contact Methods */}
            <div className="space-y-6">
              {contactMethods.map((method, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-sm border border-rose-100 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <method.icon className="text-xl text-rose-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{method.title}</h3>
                      <p className="text-gray-600 mb-3">{method.description}</p>
                      <div className="text-rose-600 font-medium mb-1">{method.contact}</div>
                      <div className="flex items-center text-sm text-gray-500">
                        <FaClock className="mr-2" />
                        {method.hours}
                      </div>
                      <a 
                        href={method.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block mt-3 text-rose-500 hover:text-rose-600 font-medium text-sm transition-colors"
                      >
                        {method.action} →
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-2xl shadow-sm border border-rose-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow Us on Social Media</h3>
              <p className="text-gray-600 mb-4">Stay updated with the latest beauty tips, product launches, and exclusive offers</p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {socialMedia.map((social, index) => (
                  <a
                    key={index}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${social.bgColor} hover:scale-110 transition-transform`}
                    aria-label={social.name}
                    title={social.name}
                  >
                    <social.icon className="text-xl" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Help Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-rose-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Help & Resources</h3>
              <div className="space-y-3">
                {[
                  { title: 'Track Your Order', desc: 'Check order status and tracking', link: '/track-order' },
                  { title: 'Shipping Information', desc: 'Delivery options and timelines', link: '/shipping' },
                  { title: 'Returns & Exchanges', desc: 'Our hassle-free return policy', link: '/returns' },
                  { title: 'Skincare Consultation', desc: 'Get personalized advice', link: '/consultation' }
                ].map((item, index) => (
                  <Link
                    key={index}
                    to={item.link}
                    className="block p-3 rounded-lg border border-rose-50 hover:border-rose-200 hover:bg-rose-50 transition-all group"
                  >
                    <div className="font-medium text-gray-900 group-hover:text-rose-600 transition-colors">
                      {item.title}
                    </div>
                    <div className="text-sm text-gray-600">{item.desc}</div>
                  </Link>
                ))}
              </div>
              <Link
                to="/faqs"
                className="inline-block w-full mt-4 text-center bg-rose-500 text-white px-4 py-3 rounded-lg font-medium hover:bg-rose-600 transition-colors"
              >
                Visit Full FAQ Section
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Business Information */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaEnvelope className="text-2xl text-rose-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Direct Email Contact</h3>
            <p className="text-gray-600">All form messages are sent directly to <strong>support@kilifoniabeautybliss.co.ke</strong></p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaHeadset className="text-2xl text-rose-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Response Time</h3>
            <p className="text-gray-600">We typically respond to all inquiries within 2-4 hours during business hours.</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCheckCircle className="text-2xl text-rose-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Multiple Contact Options</h3>
            <p className="text-gray-600">Choose your preferred method - call, WhatsApp, email, or visit our shop.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;