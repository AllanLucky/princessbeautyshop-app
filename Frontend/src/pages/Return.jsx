import { Link } from 'react-router-dom';
import { FaUndo, FaBox, FaCheckCircle, FaTimesCircle, FaShippingFast, FaClock, FaExchangeAlt } from 'react-icons/fa';

const Returns = () => {
  const returnSteps = [
    {
      step: 1,
      icon: FaBox,
      title: 'Initiate Return',
      description: 'Start your return through your account page or contact us',
      time: 'Within 30 days of delivery'
    },
    {
      step: 2,
      icon: FaShippingFast,
      title: 'Package Items',
      description: 'Include all original packaging and items in resalable condition',
      time: 'Use original packaging if possible'
    },
    {
      step: 3,
      icon: FaUndo,
      title: 'Ship Back',
      description: 'Use provided return label and drop off at any shipping location',
      time: 'Free returns within US'
    },
    {
      step: 4,
      icon: FaCheckCircle,
      title: 'Receive Refund',
      description: 'Get your refund processed to original payment method',
      time: 'Within 5-7 business days'
    }
  ];

  const returnPolicies = [
    {
      type: 'Full Refund',
      condition: 'Unopened & Unused',
      timeframe: '30 days',
      icon: FaCheckCircle,
      color: 'text-green-500',
      items: ['Original packaging', 'All components included', 'Resalable condition']
    },
    {
      type: 'Exchange Only',
      condition: 'Lightly Used',
      timeframe: '14 days',
      icon: FaExchangeAlt,
      color: 'text-blue-500',
      items: ['Less than 20% used', 'No allergic reactions', 'Original packaging']
    },
    {
      type: 'Not Eligible',
      condition: 'Opened & Used',
      timeframe: 'N/A',
      icon: FaTimesCircle,
      color: 'text-red-400',
      items: ['Over 50% used', 'Damaged packaging', 'Final sale items']
    }
  ];

  const faqItems = [
    {
      question: 'How long do I have to return a product?',
      answer: 'You have 30 days from the delivery date to return unopened products for a full refund. For exchanges of lightly used products, you have 14 days.'
    },
    {
      question: 'Are return shipping costs covered?',
      answer: 'Yes! We provide free return shipping labels for all returns within the United States. International returns may incur shipping costs.'
    },
    {
      question: 'Can I return products that cause skin reactions?',
      answer: 'Absolutely. If you experience any adverse reactions, contact us within 14 days of delivery for a full exchange or store credit.'
    },
    {
      question: 'What if I received a damaged or wrong item?',
      answer: 'Contact us immediately at support@duboisbeauty.com with photos of the issue. We\'ll expedite a replacement at no cost to you.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Returns & Exchanges</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Easy, hassle-free returns because your satisfaction matters
          </p>
        </div>

        {/* Return Process */}
        <div className="mb-16">
          <h2 className="text-3xl font-semibold text-center text-gray-900 mb-12">Simple Return Process</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {returnSteps.map((step, index) => (
              <div key={step.step} className="text-center relative">
                {/* Connector Line */}
                {index < returnSteps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-rose-200 -z-10"></div>
                )}
                
                <div className="w-24 h-24 bg-gradient-to-br from-rose-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <step.icon className="text-3xl text-rose-600" />
                </div>
                <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center text-white font-semibold text-sm mx-auto mb-3">
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{step.description}</p>
                <div className="text-rose-600 text-sm font-medium flex items-center justify-center">
                  <FaClock className="mr-1" />
                  {step.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Return Policies */}
        <div className="mb-16">
          <h2 className="text-3xl font-semibold text-center text-gray-900 mb-12">Return Policies</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {returnPolicies.map((policy, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm border border-rose-100 p-8 text-center hover:shadow-md transition-shadow">
                <policy.icon className={`text-4xl mx-auto mb-4 ${policy.color}`} />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{policy.type}</h3>
                <div className="text-lg text-gray-700 mb-2">{policy.condition}</div>
                <div className="text-rose-600 font-semibold mb-6">{policy.timeframe}</div>
                <ul className="space-y-2 text-left">
                  {policy.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center text-sm text-gray-600">
                      <FaCheckCircle className="text-rose-500 mr-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Important Notes */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-gradient-to-br from-rose-500 to-pink-500 rounded-2xl p-8 text-white">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <FaCheckCircle className="mr-3" />
              What You Can Return
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="mr-3">•</span>
                <span>Unopened products in original packaging</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">•</span>
                <span>Products causing allergic reactions (within 14 days)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">•</span>
                <span>Wrong items received</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">•</span>
                <span>Damaged or defective products</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-rose-100 p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <FaTimesCircle className="text-rose-500 mr-3" />
              Non-Returnable Items
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <span className="text-rose-500 mr-3">•</span>
                <span>Products marked "Final Sale"</span>
              </li>
              <li className="flex items-start">
                <span className="text-rose-500 mr-3">•</span>
                <span>Gift cards and digital products</span>
              </li>
              <li className="flex items-start">
                <span className="text-rose-500 mr-3">•</span>
                <span>Products used beyond 50%</span>
              </li>
              <li className="flex items-start">
                <span className="text-rose-500 mr-3">•</span>
                <span>Items without original packaging</span>
              </li>
            </ul>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-semibold text-center text-gray-900 mb-12">Common Questions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {faqItems.map((item, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm border border-rose-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.question}</h3>
                <p className="text-gray-600 leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-sm border border-rose-100 p-12">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Ready to Start a Return?</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Log in to your account to initiate a return or exchange. Our customer service team is here to help if you need assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/customer-dashboard/profile"
                className="bg-rose-500 text-white px-8 py-3 rounded-full hover:bg-rose-600 transition-colors font-medium"
              >
                Start Return
              </Link>
              <Link
                to="/contact-us"
                className="border border-rose-200 text-rose-600 px-8 py-3 rounded-full hover:bg-rose-50 transition-colors font-medium"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Returns;