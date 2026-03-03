import { Link } from 'react-router-dom';
import { FaShippingFast, FaBox, FaGlobeAmericas, FaClock, FaCheckCircle, FaTruck } from 'react-icons/fa';

const Shipping = () => {
  // Updated shipping options with Cart page fees
  const shippingOptions = [
    {
      name: 'Pickup from Shop',
      price: 'FREE',
      freeThreshold: 'All orders',
      delivery: 'Same day pickup',
      icon: FaShippingFast,
      features: ['No waiting for delivery', 'Personal assistance', 'Immediate product inspection']
    },
    {
      name: 'Kilifonia Delivery',
      price: 'KES 300',
      freeThreshold: 'Orders over KES 5,000',
      delivery: '1-2 business days',
      icon: FaTruck,
      features: ['Trackable delivery', 'Safe packaging', 'Within Nairobi areas']
    },
    {
      name: 'Outside Kilifonia',
      price: 'KES 750',
      freeThreshold: 'Orders over KES 8,000',
      delivery: '3-5 business days',
      icon: FaGlobeAmericas,
      features: ['Nationwide coverage', 'Tracked & insured', 'Duty handled']
    }
  ];

  const shippingTimeline = [
    { step: 1, title: 'Order Placed', description: 'We receive your order and begin processing', time: 'Within minutes' },
    { step: 2, title: 'Order Processing', description: 'Our beauty experts prepare your products with care', time: '1-2 business days' },
    { step: 3, title: 'Shipped', description: 'Your order is dispatched with tracking information', time: 'Next business day' },
    { step: 4, title: 'Out for Delivery', description: 'Your beauty products are on their way to you', time: '1-5 business days' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Shipping Information</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Fast, reliable delivery for all your beauty needs with transparent pricing
          </p>
        </div>

        {/* Shipping Options */}
        <div className="mb-16">
          <h2 className="text-3xl font-semibold text-center text-gray-900 mb-12">Shipping Options</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {shippingOptions.map((option, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm border border-rose-100 p-8 text-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <option.icon className="text-2xl text-rose-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{option.name}</h3>
                <div className={`text-2xl font-bold mb-2 ${
                  option.price === 'FREE' ? 'text-green-600' : 'text-rose-600'
                }`}>
                  {option.price}
                </div>
                <p className="text-gray-600 mb-4">Free on orders over {option.freeThreshold}</p>
                <div className="flex items-center justify-center text-gray-700 mb-6">
                  <FaClock className="text-rose-500 mr-2" />
                  <span>{option.delivery}</span>
                </div>
                <ul className="space-y-2">
                  {option.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <FaCheckCircle className="text-rose-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Timeline */}
        <div className="mb-16">
          <h2 className="text-3xl font-semibold text-center text-gray-900 mb-12">Order Journey</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {shippingTimeline.map((step, index) => (
              <div key={step.step} className="text-center relative">
                {/* Connector Line */}
                {index < shippingTimeline.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-rose-200 -z-10"></div>
                )}
                
                <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-semibold text-lg">
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{step.description}</p>
                <div className="text-rose-600 text-sm font-medium">{step.time}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Important Information */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-2xl shadow-sm border border-rose-100 p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <FaBox className="text-rose-500 mr-3" />
              Packaging & Care
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <FaCheckCircle className="text-rose-500 mr-3 mt-1 flex-shrink-0" />
                <span>All products packaged in temperature-controlled boxes</span>
              </li>
              <li className="flex items-start">
                <FaCheckCircle className="text-rose-500 mr-3 mt-1 flex-shrink-0" />
                <span>Recyclable and eco-friendly materials</span>
              </li>
              <li className="flex items-start">
                <FaCheckCircle className="text-rose-500 mr-3 mt-1 flex-shrink-0" />
                <span>Freeze packs included for temperature-sensitive items</span>
              </li>
              <li className="flex items-start">
                <FaCheckCircle className="text-rose-500 mr-3 mt-1 flex-shrink-0" />
                <span>Signature required for high-value orders (KES 5,000+)</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-rose-100 p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <FaClock className="text-rose-500 mr-3" />
              Delivery Notes
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <FaCheckCircle className="text-rose-500 mr-3 mt-1 flex-shrink-0" />
                <span>Business days exclude weekends and holidays</span>
              </li>
              <li className="flex items-start">
                <FaCheckCircle className="text-rose-500 mr-3 mt-1 flex-shrink-0" />
                <span>Delivery delays may occur during peak seasons</span>
              </li>
              <li className="flex items-start">
                <FaCheckCircle className="text-rose-500 mr-3 mt-1 flex-shrink-0" />
                <span>Track your order in real-time from your account</span>
              </li>
              <li className="flex items-start">
                <FaCheckCircle className="text-rose-500 mr-3 mt-1 flex-shrink-0" />
                <span>Contact us if your order is delayed beyond estimated date</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-rose-100 p-8 mb-16">
          <h3 className="text-2xl font-semibold text-center text-gray-900 mb-6">Shipping Fees Summary</h3>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">Pickup from Shop</h4>
              <div className="text-2xl font-bold text-green-600">FREE</div>
              <p className="text-sm text-green-700 mt-2">Available for all orders</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Kilifonia Delivery</h4>
              <div className="text-2xl font-bold text-blue-600">KES 300</div>
              <p className="text-sm text-blue-700 mt-2">Free on orders over KES 5,000</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-800 mb-2">Outside Kilifonia</h4>
              <div className="text-2xl font-bold text-purple-600">KES 750</div>
              <p className="text-sm text-purple-700 mt-2">Free on orders over KES 8,000</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl p-12 text-white">
          <h3 className="text-2xl font-semibold mb-4">Ready to Shop?</h3>
          <p className="mb-6 opacity-90">Enjoy fast, reliable shipping with transparent pricing on all your favorite beauty products</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="bg-white text-rose-600 px-8 py-3 rounded-full hover:bg-rose-50 transition-colors font-medium"
            >
              Shop Now
            </Link>
            <Link
              to="/cart"
              className="border border-white text-white px-8 py-3 rounded-full hover:bg-white hover:bg-opacity-10 transition-colors font-medium"
            >
              View Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shipping;