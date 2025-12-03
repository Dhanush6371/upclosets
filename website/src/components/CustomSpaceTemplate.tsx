import { useRouter } from '../utils/router';

interface CustomSpaceProps {
  title: string;
  heroImage: string;
  description: string;
  features: string[];
  galleryImages: string[];
}

export default function CustomSpaceTemplate({
  title,
  heroImage,
  description,
  features,
  galleryImages,
}: CustomSpaceProps) {
  const { navigate } = useRouter();

  return (
    <div className="min-h-screen">
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>

        <div className="relative z-10 text-center text-white px-6">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">{title.toUpperCase()}</h1>
          <p className="text-xl md:text-2xl font-light max-w-3xl mx-auto">
            {description}
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-dark-text mb-6">
                Custom {title} Solutions
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {description}
              </p>
              <h3 className="text-2xl font-bold text-dark-text mb-4">Key Features:</h3>
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <span className="text-gold text-xl mt-1">✓</span>
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative h-[500px]">
              <img
                src={galleryImages[0]}
                alt={title}
                className="w-full h-full object-cover rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-light-bg">
        <div className="container-custom mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-dark-text mb-4">
              Project Gallery
            </h2>
            <p className="text-lg text-gray-600">
              Browse through our {title.toLowerCase()} designs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="relative h-80 overflow-hidden rounded-lg shadow-lg group cursor-pointer"
              >
                <img
                  src={image}
                  alt={`${title} ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300 flex items-end justify-center pb-6">
                  <span className="text-white font-semibold">View Project</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-dark-text text-white text-center">
        <div className="container-custom mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Transform Your Home Today
          </h2>
          <p className="text-xl mb-8 text-gray-300">
            Schedule your free design consultation and let's create something beautiful
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
