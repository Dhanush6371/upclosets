import { Users, Sparkles, CheckCircle, Award, Shield, Clock, ThumbsUp, Star, ClipboardCheck, Factory, Wrench, Package } from 'lucide-react';
import { useRouter } from '../utils/router';

export default function Process() {
  const { navigate } = useRouter();

  const steps = [
    {
      icon: <Users size={48} />,
      title: 'Free Consultation',
      description:
        'We discuss your goals and measure your space. Our design experts visit your home to take precise measurements and understand your vision, lifestyle, and storage needs.',
      details: [
        'In-home or virtual consultation available',
        'Detailed space measurements',
        'Discussion of design preferences',
        'Budget planning and timeline',
      ],
    },
    {
      icon: <Sparkles size={48} />,
      title: 'Custom Design',
      description:
        'You receive a personalized 3D layout. Our talented designers create stunning 3D visualizations of your custom closet, allowing you to see exactly how your space will transform.',
      details: [
        '3D rendering and visualization',
        'Interactive design modifications',
        'Material and finish selection',
        'Detailed project specifications',
      ],
    },
    {
      icon: <ClipboardCheck size={48} />,
      title: 'Approval',
      description:
        'Review and approve your final design. We work collaboratively with you, making adjustments until everything is perfect and you\'re completely satisfied with the design.',
      details: [
        'Review all design details',
        'Make final adjustments',
        'Approve materials and finishes',
        'Confirm project timeline',
      ],
    },
    {
      icon: <Factory size={48} />,
      title: 'Manufacturing',
      description:
        'Your closet is built to your exact specs. Once approved, our expert craftsmen begin manufacturing your custom closet using premium materials and precise measurements.',
      details: [
        'Precision manufacturing process',
        'Premium quality materials',
        'Built to exact specifications',
        'Quality control inspection',
      ],
    },
    {
      icon: <Wrench size={48} />,
      title: 'Installation',
      description:
        'Our experts complete the installation. Our professional installation team brings your design to life with precision and care, ensuring every component is perfectly installed.',
      details: [
        'Professional installation team',
        'Minimal disruption to your home',
        'Attention to every detail',
        'Clean workspace after completion',
      ],
    },
    {
      icon: <Award size={48} />,
      title: 'Final Review',
      description:
        'We ensure everything is perfect before we leave. Our team conducts a thorough walkthrough with you, ensuring every detail meets your expectations and you\'re completely satisfied.',
      details: [
        'Complete quality inspection',
        'Final walkthrough with you',
        'Address any concerns',
        'Warranty and care instructions',
      ],
    },
  ];

  const qualityPoints = [
    {
      icon: <Star size={32} />,
      title: '100% Custom Design',
      description: 'Every project is uniquely tailored to your space and needs',
    },
    {
      icon: <Shield size={32} />,
      title: 'Premium Materials',
      description: 'We use only the highest quality materials and finishes',
    },
    {
      icon: <Award size={32} />,
      title: 'Professional Installation',
      description: 'Expert craftsmen ensure flawless execution',
    },
    {
      icon: <ThumbsUp size={32} />,
      title: 'Warranty & Support',
      description: 'Comprehensive warranty and ongoing customer service',
    },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1600)',
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>

        <div className="relative z-10 text-center text-white px-6">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">OUR PROCESS</h1>
          <p className="text-xl md:text-2xl font-light max-w-3xl mx-auto">
            Seamless, transparent, and crafted around you
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-dark-text mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              From initial consultation to final review, we guide you every step of the way
            </p>
          </div>

          <div className="space-y-16">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`grid md:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'md:flex-row-reverse' : ''
                }`}
              >
                <div className={`${index % 2 === 1 ? 'md:order-2' : ''}`}>
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gold text-white rounded-full mb-6">
                    {step.icon}
                  </div>
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="text-6xl font-bold text-gray-200">0{index + 1}</span>
                    <h3 className="text-3xl font-bold text-dark-text">{step.title}</h3>
                  </div>
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                    {step.description}
                  </p>
                  <ul className="space-y-2">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <span className="text-gold mt-1">✓</span>
                        <span className="text-gray-600">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`relative h-96 ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                  <img
                    src={`https://images.pexels.com/photos/${
                      [1643383, 6585757, 2079246, 5691577, 1090638, 3825517][index]
                    }/pexels-photo-${
                      [1643383, 6585757, 2079246, 5691577, 1090638, 3825517][index]
                    }.jpeg?auto=compress&cs=tinysrgb&w=800`}
                    alt={step.title}
                    className="w-full h-full object-cover rounded-lg shadow-2xl"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-light-bg">
        <div className="container-custom mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-dark-text mb-4">
              Quality & Service Commitment
            </h2>
            <p className="text-xl text-gray-600">
              What sets us apart from the competition
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {qualityPoints.map((point, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-lg shadow-lg text-center hover:shadow-2xl transition-all"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gold text-white rounded-full mb-6">
                  {point.icon}
                </div>
                <h3 className="text-xl font-bold text-dark-text mb-3">{point.title}</h3>
                <p className="text-gray-600">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Track Your Order Section */}
      <section className="section-padding bg-white">
        <div className="container-custom mx-auto max-w-4xl">
          <div className="bg-gradient-to-br from-gold to-amber-600 rounded-3xl p-8 md:p-12 text-white shadow-2xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-6">
                <Package size={48} />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Track Your Order
              </h2>
              <p className="text-lg text-white text-opacity-90 mb-8">
                Stay informed every step of the way. Track your custom closet from manufacturing to installation.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 text-dark-text">
              <h3 className="text-xl font-bold mb-6">Real-Time Order Updates</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gold bg-opacity-10 rounded-full flex items-center justify-center">
                    <CheckCircle size={20} className="text-gold" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Design Approved</h4>
                    <p className="text-sm text-gray-600">Receive confirmation when your design is finalized</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gold bg-opacity-10 rounded-full flex items-center justify-center">
                    <Factory size={20} className="text-gold" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">In Manufacturing</h4>
                    <p className="text-sm text-gray-600">Get updates as your closet is being built</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gold bg-opacity-10 rounded-full flex items-center justify-center">
                    <Package size={20} className="text-gold" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Ready for Installation</h4>
                    <p className="text-sm text-gray-600">Be notified when your order is ready</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gold bg-opacity-10 rounded-full flex items-center justify-center">
                    <Wrench size={20} className="text-gold" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Installation Scheduled</h4>
                    <p className="text-sm text-gray-600">Know exactly when we'll arrive</p>
                  </div>
                </div>
              </div>

              <a
                href="tel:+17037839581"
                className="w-full bg-gold text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-opacity-90 transition-all flex items-center justify-center space-x-2"
              >
                <Package size={24} />
                <span>Call to Track Your Order</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-dark-text text-white text-center">
        <div className="container-custom mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Take the First Step — Schedule Your Free Consultation Today
          </h2>
          <p className="text-xl mb-8 text-gray-300 max-w-3xl mx-auto">
            Let's discuss your vision and create a custom closet solution that transforms your space
          </p>
          <button
            onClick={() => navigate('/contact')}
            className="bg-gold text-white px-10 py-5 rounded-full font-semibold text-lg hover:bg-opacity-90 transition-all"
          >
            Schedule Consultation
          </button>
        </div>
      </section>
    </div>
  );
}
