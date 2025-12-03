import { Award, Users, Heart, Target } from 'lucide-react';
import { useRouter } from '../utils/router';
import ownerImage from '../assets/image.png';

export default function About() {
  const { navigate } = useRouter();

  const values = [
    {
      icon: <Award size={32} />,
      title: 'Excellence',
      description: 'We are committed to delivering exceptional quality in every project.',
    },
    {
      icon: <Users size={32} />,
      title: 'Collaboration',
      description: 'Your vision guides our design process from consultation to completion.',
    },
    {
      icon: <Heart size={32} />,
      title: 'Passion',
      description: 'We love what we do and it shows in our meticulous craftsmanship.',
    },
    {
      icon: <Target size={32} />,
      title: 'Precision',
      description: 'Every measurement, cut, and installation is executed with accuracy.',
    },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/6585757/pexels-photo-6585757.jpeg?auto=compress&cs=tinysrgb&w=1600)',
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>

        <div className="relative z-10 text-center text-white px-6">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">ABOUT UPCLOSETS OF NOVA</h1>
          <p className="text-xl md:text-2xl font-light max-w-3xl mx-auto">
            Crafting custom closet solutions with precision, passion, and unparalleled expertise
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-dark-text mb-6">Our Story</h2>
              <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                UpClosets of NOVA was founded with a singular mission: to transform ordinary spaces
                into extraordinary organizational masterpieces. For over a decade, we have been
                serving upscale homeowners throughout Northern Virginia with custom closet designs
                that blend beauty, functionality, and craftsmanship.
              </p>
              <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                Our team of experienced designers and skilled craftsmen work together to create
                bespoke storage solutions tailored to each client's unique lifestyle and aesthetic
                preferences. We believe that every home deserves thoughtful organization that
                enhances daily living.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                From initial consultation through final installation, we are committed to exceeding
                expectations with meticulous attention to detail, premium materials, and seamless
                project management.
              </p>
            </div>
            <div className="relative h-[500px]">
              <img
                src="https://images.pexels.com/photos/6585757/pexels-photo-6585757.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Our team"
                className="w-full h-full object-cover rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-to-br from-gray-50 to-white">
        <div className="container-custom mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-dark-text mb-4">Meet Our Founder</h2>
            <p className="text-xl text-gray-600">
              The vision and passion behind UpClosets of NOVA
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="flex justify-center">
                <div className="relative">
                  <img
                    src={ownerImage}
                    alt="Owner of UpClosets of NOVA"
                    className="w-full max-w-md h-auto rounded-lg shadow-2xl object-cover"
                  />
                  <div className="absolute inset-0 rounded-lg ring-4 ring-gold ring-opacity-30"></div>
                </div>
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-3xl font-bold text-dark-text mb-4">
                  Dedicated to Excellence
                </h3>
                <p className="text-lg text-gray-600 mb-4 leading-relaxed">
                  With a passion for transforming spaces and a commitment to exceptional craftsmanship,
                  our founder has built UpClosets of NOVA into a trusted name in custom closet solutions
                  throughout Northern Virginia.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Every project reflects our dedication to quality, attention to detail, and the belief
                  that a well-organized space can truly enhance the way you live.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-light-bg">
        <div className="container-custom mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-dark-text mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-lg shadow-lg text-center hover:shadow-2xl transition-all"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gold text-white rounded-full mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-dark-text mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[500px] order-2 md:order-1">
              <img
                src="https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Premium materials"
                className="w-full h-full object-cover rounded-lg shadow-2xl"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-4xl font-bold text-dark-text mb-6">
                Why Choose UpClosets of NOVA?
              </h2>
              <ul className="space-y-4">
                {[
                  'Over 10 years of experience in custom closet design',
                  '100% custom solutions tailored to your space',
                  'Premium materials sourced from trusted suppliers',
                  'Professional 3D design visualization',
                  'Expert installation by certified craftsmen',
                  'Comprehensive warranty and ongoing support',
                  'Serving Northern Virginia homeowners',
                  'Competitive pricing with transparent quotes',
                ].map((item, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <span className="text-gold text-xl mt-1">✓</span>
                    <span className="text-lg text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-dark-text text-white text-center">
        <div className="container-custom mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Work with the Best?
          </h2>
          <p className="text-xl mb-8 text-gray-300 max-w-3xl mx-auto">
            Let's create a custom closet that transforms your space and simplifies your life
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
