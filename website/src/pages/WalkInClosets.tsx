import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useRouter } from '../utils/router';

export default function WalkInClosets() {
  const { navigate } = useRouter();
  const [selectedType, setSelectedType] = useState<number | null>(null);

  const closetTypes = [
    {
      title: 'Classic Elegance Closet',
      image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Timeless design with handcrafted wooden finishes and soft lighting.',
      features: [
        'Premium wood finishes (Cherry, Walnut, Oak)',
        'Soft ambient LED lighting',
        'Custom shelving and drawer systems',
        'Full-length mirror integration',
        'Classic hardware and handles',
      ],
    },
    {
      title: 'Modern Minimalist Closet',
      image: 'https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Clean lines, built-in lighting, and seamless organization.',
      features: [
        'Matte white or gray panel systems',
        'Integrated LED strip lighting',
        'Glass door cabinets',
        'Hidden storage compartments',
        'Minimalist chrome hardware',
      ],
    },
    {
      title: 'Luxury Walk-In Suite',
      image: 'https://images.pexels.com/photos/2079246/pexels-photo-2079246.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Designed for sophistication, featuring an island, mirrors, and seating.',
      features: [
        'Center island with jewelry drawers',
        'Built-in vanity with Hollywood lighting',
        'Cushioned seating area',
        'Premium leather or velvet accents',
        'Chandelier or statement lighting',
      ],
    },
    {
      title: 'Compact Urban Closet',
      image: 'https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Perfect for apartments — stylish, smart, and space-efficient.',
      features: [
        'Space-maximizing sliding doors',
        'Vertical storage optimization',
        'Pull-out accessories organizers',
        'Compact lighting solutions',
        'Multi-functional components',
      ],
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
          <h1 className="text-5xl md:text-6xl font-bold mb-6">WALK-IN CLOSETS</h1>
          <p className="text-xl md:text-2xl font-light">
            Explore four signature closet styles designed to fit every lifestyle
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-dark-text mb-4">
              Choose Your Perfect Style
            </h2>
            <p className="text-lg text-gray-600">
              Select a closet type to view detailed features and gallery
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {closetTypes.map((type, index) => (
              <div
                key={index}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group"
                onClick={() => setSelectedType(selectedType === index ? null : index)}
              >
                <div className="h-64 overflow-hidden relative">
                  <img
                    src={type.image}
                    alt={type.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {selectedType === index && (
                    <div className="absolute inset-0 bg-gold bg-opacity-20 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">Selected</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-dark-text mb-3 group-hover:text-gold transition-colors">
                    {type.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{type.description}</p>
                  <button className="inline-flex items-center space-x-2 text-gold font-semibold hover:underline">
                    <span>View Details</span>
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {selectedType !== null && (
            <div className="bg-light-bg rounded-2xl p-8 md:p-12 animate-fade-in">
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-3xl font-bold text-dark-text mb-6">
                    {closetTypes[selectedType].title}
                  </h3>
                  <p className="text-lg text-gray-600 mb-6">
                    {closetTypes[selectedType].description}
                  </p>
                  <h4 className="text-xl font-bold text-dark-text mb-4">Key Features:</h4>
                  <ul className="space-y-3">
                    {closetTypes[selectedType].features.map((feature, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <span className="text-gold mt-1">✓</span>
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => navigate('/contact')}
                    className="mt-8 bg-gold text-white px-8 py-4 rounded-full font-semibold hover:bg-opacity-90 transition-all"
                  >
                    Book Free Consultation for This Style
                  </button>
                </div>
                <div className="space-y-4">
                  <img
                    src={closetTypes[selectedType].image}
                    alt={closetTypes[selectedType].title}
                    className="w-full h-64 object-cover rounded-lg shadow-lg"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <img
                      src={closetTypes[(selectedType + 1) % closetTypes.length].image}
                      alt="Gallery"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <img
                      src={closetTypes[(selectedType + 2) % closetTypes.length].image}
                      alt="Gallery"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-dark-text mb-4">
              Walk-In Closet Gallery
            </h2>
            <p className="text-lg text-gray-600">
              See our beautiful walk-in closet installations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {closetTypes.map((type, index) => (
              <div
                key={index}
                className="relative h-80 overflow-hidden rounded-lg shadow-lg group cursor-pointer"
              >
                <img
                  src={type.image}
                  alt={type.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300 flex items-end justify-center pb-6">
                  <span className="text-white font-semibold text-lg">{type.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-dark-text text-white text-center">
        <div className="container-custom mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Design Your Dream Walk-In Closet Today
          </h2>
          <p className="text-xl mb-8 text-gray-300">
            Schedule a free consultation with our expert design team
          </p>
          <button
            onClick={() => navigate('/contact')}
            className="bg-gold text-white px-10 py-5 rounded-full font-semibold text-lg hover:bg-opacity-90 transition-all"
          >
            Book Free Design Consultation
          </button>
        </div>
      </section>
    </div>
  );
}
