import { useRouter } from '../utils/router';

export default function Services() {
  const { navigate } = useRouter();

  const services = [
    {
      title: 'Walk-in Closets',
      image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
      description:
        'Transform your walk-in closet into a luxurious dressing suite with custom shelving, island seating, and integrated lighting. Perfect for master bedrooms and large spaces.',
      path: '/walk-in-closets',
    },
    {
      title: 'Reach-in Closets',
      image: 'https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg?auto=compress&cs=tinysrgb&w=800',
      description:
        'Maximize every inch of your reach-in closet with smart organization systems, adjustable shelving, and custom configurations designed for efficiency.',
      path: '/reach-in-closets',
    },
    {
      title: 'Home Office Storage',
      image: 'https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&w=800',
      description:
        'Create a productive workspace with built-in desks, filing systems, and custom shelving that keeps your office organized and inspiring.',
      path: '/office-room',
    },
    {
      title: 'Hobby Rooms',
      image: 'https://images.pexels.com/photos/6957906/pexels-photo-6957906.jpeg?auto=compress&cs=tinysrgb&w=800',
      description:
        'Design the perfect craft, music, or art room with specialized storage for supplies, equipment, and materials tailored to your creative pursuits.',
      path: '/hobby-room',
    },
    {
      title: 'Mud Rooms',
      image: 'https://images.pexels.com/photos/6283961/pexels-photo-6283961.jpeg?auto=compress&cs=tinysrgb&w=800',
      description:
        'Create an organized entry space with bench seating, coat hooks, shoe storage, and individual cubbies for the entire family.',
      path: '/mud-room',
    },
    {
      title: 'Laundry Rooms',
      image: 'https://images.pexels.com/photos/5824508/pexels-photo-5824508.jpeg?auto=compress&cs=tinysrgb&w=800',
      description:
        'Upgrade your laundry room with folding counters, cabinets, and smart storage solutions that make this essential space both functional and beautiful.',
      path: '/laundry-room',
    },
    {
      title: 'Kitchen Pantries',
      image: 'https://images.pexels.com/photos/6489119/pexels-photo-6489119.jpeg?auto=compress&cs=tinysrgb&w=800',
      description:
        'Organize your kitchen pantry with adjustable shelving, pull-out drawers, and specialized storage for groceries, appliances, and cooking essentials.',
      path: '/kitchen-pantry',
    },
    {
      title: 'Garage Systems',
      image: 'https://images.pexels.com/photos/7034682/pexels-photo-7034682.jpeg?auto=compress&cs=tinysrgb&w=800',
      description:
        'Transform your garage with heavy-duty shelving, wall systems, tool organization, and durable cabinets designed to withstand years of use.',
      path: '/garages',
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
          <h1 className="text-5xl md:text-6xl font-bold mb-6">CUSTOM CLOSET SOLUTIONS</h1>
          <p className="text-xl md:text-2xl font-light max-w-3xl mx-auto">
            Comprehensive storage solutions for every room in your home
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-dark-text mb-4">
              Explore Our Custom Solutions
            </h2>
            <p className="text-xl text-gray-600">
              Tailored designs that bring organization and elegance to every space
            </p>
          </div>

          <div className="space-y-16">
            {services.map((service, index) => (
              <div
                key={index}
                className={`grid md:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'md:flex-row-reverse' : ''
                }`}
              >
                <div className={`${index % 2 === 1 ? 'md:order-2' : ''}`}>
                  <h3 className="text-3xl font-bold text-dark-text mb-4">{service.title}</h3>
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <button
                    onClick={() => navigate(service.path)}
                    className="bg-gold text-white px-8 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-all"
                  >
                    Learn More
                  </button>
                </div>
                <div
                  className={`relative h-96 overflow-hidden rounded-lg shadow-2xl group cursor-pointer ${
                    index % 2 === 1 ? 'md:order-1' : ''
                  }`}
                  onClick={() => navigate(service.path)}
                >
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-dark-text text-white text-center">
        <div className="container-custom mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Transform Your Home Today — Book Consultation
          </h2>
          <p className="text-xl mb-8 text-gray-300 max-w-3xl mx-auto">
            Let our expert design team create a custom solution perfect for your space
          </p>
          <button
            onClick={() => navigate('/contact')}
            className="bg-gold text-white px-10 py-5 rounded-full font-semibold text-lg hover:bg-opacity-90 transition-all"
          >
            Schedule Your Free Consultation
          </button>
        </div>
      </section>
    </div>
  );
}
