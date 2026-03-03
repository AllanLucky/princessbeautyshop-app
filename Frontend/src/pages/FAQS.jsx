import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown, FaChevronUp, FaSearch} from 'react-icons/fa';

const FAQ = () => {
  const [openItems, setOpenItems] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  const faqCategories = [
    {
      title: 'Product Information',
      icon: '💄',
      questions: [
        {
          question: 'How do I choose the right skincare products for my skin type?',
          answer: 'We recommend starting with our Skin Quiz on the product pages. For personalized advice, look for products labeled for your specific skin type (dry, oily, combination, sensitive). Our Vitamin C Serum works for most skin types, while our Hyaluronic Acid Serum is perfect for dry skin.'
        },
        {
          question: 'Are your products cruelty-free and vegan?',
          answer: 'Yes! All Dubois Beauty products are 100% cruelty-free and many are vegan. Look for the vegan badge on product pages. We never test on animals and all our ingredients are ethically sourced.'
        },
        {
          question: 'What is the shelf life of your products?',
          answer: 'Unopened products have a shelf life of 2-3 years. Once opened, most skincare products are best used within 6-12 months. Look for the period-after-opening symbol (⏳) on packaging for specific timelines.'
        }
      ]
    },
    {
      title: 'Orders & Shipping',
      icon: '📦',
      questions: [
        {
          question: 'How long does shipping take?',
          answer: 'Standard shipping takes 3-5 business days, express shipping 1-2 business days. International orders typically take 7-14 business days. You\'ll receive tracking information as soon as your order ships.'
        },
        {
          question: 'Can I modify or cancel my order?',
          answer: 'You can modify or cancel your order within 1 hour of placement by contacting our customer service. After that, orders enter our fulfillment process and cannot be changed.'
        },
        {
          question: 'Do you ship internationally?',
          answer: 'Yes! We ship to over 50 countries. International shipping costs and delivery times vary by location. Some product restrictions may apply based on local regulations.'
        }
      ]
    },
    {
      title: 'Returns & Exchanges',
      icon: '🔄',
      questions: [
        {
          question: 'What is your return policy?',
          answer: 'We offer a 30-day return policy for unused, unopened products in original packaging. For opened products that cause reactions, we offer exchanges within 14 days. See our Returns page for full details.'
        },
        {
          question: 'How do I return a product?',
          answer: 'Start the return process through your account page or contact our customer service. We\'ll provide a return label and instructions. Returns are typically processed within 3-5 business days of receipt.'
        },
        {
          question: 'Can I exchange a product for a different shade?',
          answer: 'Absolutely! We offer free exchanges for shade mismatches within 30 days. The product must be lightly used (less than 20%) and in resalable condition.'
        }
      ]
    },
    {
      title: 'Skincare & Routine Advice',
      icon: '✨',
      questions: [
        {
          question: 'What order should I apply my skincare products?',
          answer: 'Follow this order: 1) Cleanser, 2) Toner, 3) Serums (thinnest to thickest), 4) Treatments, 5) Moisturizer, 6) Sunscreen (AM) or Face Oil (PM). Wait 30-60 seconds between layers for better absorption.'
        },
        {
          question: 'How often should I exfoliate?',
          answer: 'It depends on your skin type: Oily skin 2-3 times weekly, Combination skin 1-2 times weekly, Dry/Sensitive skin once weekly. Always listen to your skin and reduce frequency if irritation occurs.'
        },
        {
          question: 'Can I mix different product lines?',
          answer: 'Yes, our products are formulated to work well together. However, avoid mixing retinol with Vitamin C in the same routine. Use retinol at night and Vitamin C in the morning for best results.'
        }
      ]
    }
  ];

  const toggleItem = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our products, routines, and policies
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search FAQs..."
              className="w-full pl-12 pr-4 py-3 rounded-full border border-rose-200 focus:border-rose-300 focus:ring-2 focus:ring-rose-100 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* FAQ Content */}
        <div className="space-y-6">
          {filteredCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-2xl shadow-sm border border-rose-100 overflow-hidden">
              <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-6 border-b border-rose-100">
                <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                  <span className="text-2xl mr-3">{category.icon}</span>
                  {category.title}
                </h2>
              </div>
              
              <div className="divide-y divide-rose-50">
                {category.questions.map((item, questionIndex) => {
                  const key = `${categoryIndex}-${questionIndex}`;
                  const isOpen = openItems[key];
                  
                  return (
                    <div key={questionIndex} className="p-6">
                      <button
                        className="flex justify-between items-center w-full text-left group"
                        onClick={() => toggleItem(categoryIndex, questionIndex)}
                      >
                        <span className="text-lg font-medium text-gray-900 group-hover:text-rose-600 transition-colors pr-4">
                          {item.question}
                        </span>
                        {isOpen ? (
                          <FaChevronUp className="text-rose-500 flex-shrink-0" />
                        ) : (
                          <FaChevronDown className="text-gray-400 group-hover:text-rose-500 flex-shrink-0" />
                        )}
                      </button>
                      
                      {isOpen && (
                        <div className="mt-4 pl-2">
                          <p className="text-gray-600 leading-relaxed border-l-2 border-rose-200 pl-4">
                            {item.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Still Need Help */}
        <div className="text-center mt-12 p-8 bg-white rounded-2xl shadow-sm border border-rose-100">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Still need help?</h3>
          <p className="text-gray-600 mb-6">
            Can't find the answer you're looking for? Our beauty experts are here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact-us"
              className="bg-rose-500 text-white px-8 py-3 rounded-full hover:bg-rose-600 transition-colors font-medium"
            >
              Contact Us
            </Link>
            <Link
              to="/shipping"
              className="border border-rose-200 text-rose-600 px-8 py-3 rounded-full hover:bg-rose-50 transition-colors font-medium"
            >
              Shipping Info
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;