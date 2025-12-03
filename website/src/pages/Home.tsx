import { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle, Sparkles, Clock, Award, Phone, Mail, MapPin, Calendar, Star, TrendingUp, Shield, Zap, Heart } from 'lucide-react';
import { useRouter } from '../utils/router';

export default function Home() {
  const { navigate } = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeCarouselImage, setActiveCarouselImage] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });

  // Carousel images
  const carouselImages = [
    'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1600',
    'https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg?auto=compress&cs=tinysrgb&w=1600',
    'https://images.pexels.com/photos/2079246/pexels-photo-2079246.jpeg?auto=compress&cs=tinysrgb&w=1600',
  ];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCarouselImage((prev) => (prev + 1) % carouselImages.length);
    }, 4000); // Change image every 4 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you! We will contact you soon to schedule your consultation.');
    setFormData({ name: '', email: '', phone: '', service: '', message: '' });
  };

  const services = [
    {
      title: 'Walk-in Closets',
      description: 'Luxury walk-in closets designed to maximize space and elevate your daily routine.',
      image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
      path: '/walk-in-closets',
      icon: '👔',
    },
    {
      title: 'Reach-in Closets',
      description: 'Smart organization solutions for compact spaces with maximum functionality.',
      image: 'https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg?auto=compress&cs=tinysrgb&w=800',
      path: '/reach-in-closets',
      icon: '📦',
    },
    {
      title: 'Pantry Systems',
      description: 'Custom pantry designs that bring order and elegance to your kitchen storage.',
      image: 'https://images.pexels.com/photos/6489119/pexels-photo-6489119.jpeg?auto=compress&cs=tinysrgb&w=800',
      path: '/kitchen-pantry',
      icon: '🍽️',
    },
    {
      title: 'Garage & Office Storage',
      description: 'Professional organization systems for garages, offices, and specialty spaces.',
      image: 'https://images.pexels.com/photos/7034682/pexels-photo-7034682.jpeg?auto=compress&cs=tinysrgb&w=800',
      path: '/garages',
      icon: '💼',
    },
  ];

  const galleryImages = [
    'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/1454806/pexels-photo-1454806.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/2079246/pexels-photo-2079246.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/6489119/pexels-photo-6489119.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/7034682/pexels-photo-7034682.jpeg?auto=compress&cs=tinysrgb&w=600',
  ];

  const values = [
    {
      icon: <Shield size={28} />,
      title: 'Stress Free',
      description: 'We handle everything from design to installation—so you don\'t have to worry. No stress, no surprises—just beautiful, organized spaces made for your life.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <Sparkles size={28} />,
      title: 'Affordable Elegance',
      description: 'Everyone deserves a dream closet—without the high price. That\'s what we call affordable elegance. Style, comfort, and quality—made to fit your budget.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: <Heart size={28} />,
      title: 'Empathetic & Respectful',
      description: 'Your home is personal, and we treat it that way. We listen to your needs, respect your space, and handle every step with care and attention.',
      color: 'from-pink-500 to-rose-500',
    },
    {
      icon: <Zap size={28} />,
      title: 'Kick Your Feet Up',
      description: 'Relax—we\'ve got it fully covered. We take care of every detail so you can enjoy watching your space come to life.',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: <Star size={28} />,
      title: 'Dare To Dream',
      description: 'We can\'t wait to help you create your dream closet! Don\'t be surprised if you end up saving us in your phone as closet bestie.',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      icon: <TrendingUp size={28} />,
      title: 'Stunning Spaces',
      description: 'Our sliding spaces are as functional as they are beautiful, bringing style and sophistication to every room.',
      color: 'from-teal-500 to-green-500',
    },
  ];

  const stats = [
    { number: '500+', label: 'Projects Completed', icon: <CheckCircle size={32} /> },
    { number: '98%', label: 'Customer Satisfaction', icon: <Star size={32} /> },
    { number: '15+', label: 'Years Experience', icon: <Award size={32} /> },
    { number: '24/7', label: 'Support Available', icon: <Clock size={32} /> },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Homeowner',
      text: 'UpClosets transformed our master bedroom with a stunning walk-in closet. The team was professional, and the result exceeded our expectations!',
      rating: 5,
      image: 'https://i.pravatar.cc/150?img=1',
    },
    {
      name: 'Michael Chen',
      role: 'Business Owner',
      text: 'The garage organization system they installed is incredible. Everything has its place, and my garage looks like a showroom now!',
      rating: 5,
      image: 'https://i.pravatar.cc/150?img=2',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Interior Designer',
      text: 'I recommend UpClosets to all my clients. Their attention to detail and quality craftsmanship is unmatched in Northern Virginia.',
      rating: 5,
      image: 'https://i.pravatar.cc/150?img=3',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Modern Design */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Carousel Background Images */}
        {carouselImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              index === activeCarouselImage ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${image})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80"></div>
          </div>
        ))}

        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)',
          }}></div>
        </div>

        {/* Hero Content */}
        <div className={`relative z-10 text-center text-white px-6 max-w-6xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-block mb-6">
            <span className="bg-gradient-gold text-white px-6 py-3 rounded-full text-sm font-bold uppercase tracking-widest shadow-gold-lg animate-float">
              ✨ Transform Your Space
            </span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-display font-bold mb-8 leading-tight text-shadow-lg">
            Create Your
            <br />
            <span className="bg-gradient-to-r from-gold-light via-gold to-gold-dark bg-clip-text text-transparent">
              Dream Closet
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 font-light max-w-3xl mx-auto text-gray-200">
            Premium custom closets designed for beauty, built for function. 
            Experience the perfect blend of luxury and organization.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => navigate('/contact')}
              className="btn-primary group"
            >
              <span>Book Free Consultation</span>
              <ArrowRight size={20} className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/catalog')}
              className="btn-outline"
            >
              Browse Collection
            </button>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveCarouselImage(index)}
              className={`transition-all duration-300 rounded-full ${
                index === activeCarouselImage 
                  ? 'w-12 h-3 bg-gold shadow-gold' 
                  : 'w-3 h-3 bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-gradient-to-br from-white via-gray-50 to-white">
        <div className="container-custom mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center group animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-gold rounded-2xl mb-4 shadow-gold group-hover:scale-110 transition-transform duration-300">
                  <div className="text-white">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-4xl md:text-5xl font-display font-bold text-dark-text mb-2 group-hover:text-gold transition-colors">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section-padding bg-white">
        <div className="container-custom mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6 animate-slide-up">
              <div className="inline-block">
                <span className="text-gold text-sm font-bold uppercase tracking-widest bg-gold/10 px-4 py-2 rounded-full">
                  About Us
                </span>
              </div>
              <h2 className="text-5xl md:text-6xl font-display font-bold text-dark-text">
                Welcome to
                <br />
                <span className="text-gradient-gold inline-block bg-gradient-gold bg-clip-text text-transparent">
                  UpClosets of NOVA
                </span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                We are a premier custom closet design company dedicated to transforming ordinary
                spaces into extraordinary organizational masterpieces. With years of expertise in
                precision craftsmanship and architectural design, we create bespoke storage
                solutions that perfectly blend beauty with functionality.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Every project is a collaboration, tailored to your lifestyle, preferences, and
                space. From initial consultation to final installation, we ensure a seamless
                experience that exceeds expectations.
              </p>
              <button
                onClick={() => navigate('/about')}
                className="btn-secondary inline-flex items-center space-x-2"
              >
                <span>Learn More About Us</span>
                <ArrowRight size={20} />
              </button>
            </div>
            
            <div className="relative animate-slide-up" style={{ animationDelay: '200ms' }}>
              <div className="relative h-[500px] md:h-[600px] rounded-3xl overflow-hidden shadow-elegant-lg">
                <img
                  src="https://images.pexels.com/photos/6585757/pexels-photo-6585757.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Designer working on closet design"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-elegant-lg animate-float">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-gold rounded-full flex items-center justify-center">
                    <Award className="text-white" size={32} />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-dark-text">15+ Years</div>
                    <div className="text-gray-600">Excellence</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="container-custom mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="text-gold text-sm font-bold uppercase tracking-widest bg-gold/10 px-4 py-2 rounded-full">
                Our Services
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-display font-bold text-dark-text mb-4">
              Custom <span className="text-gradient-gold inline-block bg-gradient-gold bg-clip-text text-transparent">Solutions</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tailored designs for every room in your home
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="card-elegant card-interactive group cursor-pointer animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => navigate(service.path)}
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="gradient-overlay"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl animate-float">{service.icon}</div>
                  </div>
                </div>
                <div className="p-6 bg-gradient-to-br from-white to-gray-50">
                  <h3 className="text-xl font-display font-bold text-dark-text mb-3 group-hover:text-gold transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="flex items-center text-gold font-semibold group-hover:translate-x-2 transition-transform">
                    <span>Learn More</span>
                    <ArrowRight size={18} className="ml-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-white">
        <div className="container-custom mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="text-gold text-sm font-bold uppercase tracking-widest bg-gold/10 px-4 py-2 rounded-full">
                Why Choose Us
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-display font-bold text-dark-text mb-4">
              Our <span className="text-gradient-gold inline-block bg-gradient-gold bg-clip-text text-transparent">Core Values</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              We're committed to making your closet experience easy, affordable, and personalized
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-8 shadow-elegant hover:shadow-elegant-lg transition-all duration-500 animate-slide-up border border-gray-100 hover:border-gold/30"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${value.color} rounded-2xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {value.icon}
                  </div>
                </div>
                <h3 className="text-xl font-display font-bold text-dark-text mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="section-padding bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="container-custom mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="text-gold text-sm font-bold uppercase tracking-widest bg-gold/10 px-4 py-2 rounded-full">
                Portfolio
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-display font-bold text-dark-text mb-4">
              Our Work <span className="text-gradient-gold inline-block bg-gradient-gold bg-clip-text text-transparent">Speaks</span>
            </h2>
            <p className="text-xl text-gray-600">
              Browse our portfolio of stunning custom closet designs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="relative h-80 overflow-hidden rounded-2xl shadow-elegant group cursor-pointer animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <img
                  src={image}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-white text-center">
                    <Sparkles size={40} className="mx-auto mb-2" />
                    <span className="font-semibold text-lg">View Project</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate('/catalog')}
              className="btn-primary"
            >
              View Full Catalog
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding bg-gradient-dark text-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)',
        }}></div>

        <div className="container-custom mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="bg-gradient-gold text-white px-6 py-3 rounded-full text-sm font-bold uppercase tracking-widest">
                Testimonials
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-display font-bold mb-4">
              What Our <span className="text-gradient-gold inline-block bg-gradient-gold bg-clip-text text-transparent">Clients Say</span>
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`transition-all duration-500 ${
                    index === activeTestimonial ? 'opacity-100 translate-x-0' : 'opacity-0 absolute inset-0 translate-x-full'
                  }`}
                >
                  <div className="glass-effect rounded-3xl p-12 shadow-elegant-lg">
                    <div className="flex items-center gap-2 mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} size={24} className="fill-gold text-gold" />
                      ))}
                    </div>
                    <p className="text-2xl text-white mb-8 leading-relaxed font-light italic">
                      "{testimonial.text}"
                    </p>
                    <div className="flex items-center gap-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full border-4 border-gold/30"
                      />
                      <div>
                        <div className="font-bold text-white text-lg">{testimonial.name}</div>
                        <div className="text-gray-300">{testimonial.role}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Testimonial Navigation */}
            <div className="flex justify-center gap-3 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === activeTestimonial ? 'w-12 bg-gold' : 'w-2 bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process Section - Redesigned Modern Timeline */}
      <section className="section-padding bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gold rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="container-custom mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block mb-6">
              <span className="text-gold text-sm font-bold uppercase tracking-widest bg-gold/20 px-6 py-3 rounded-full border border-gold/30">
                Our Process
              </span>
            </div>
            <h2 className="text-5xl md:text-7xl font-display font-bold text-white mb-6">
              How It <span className="text-gradient-gold inline-block bg-gradient-gold bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              From vision to reality in four seamless steps
            </p>
          </div>

          {/* Desktop Timeline View */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Connection Line */}
              <div className="absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent"></div>
              
              <div className="grid grid-cols-4 gap-8 relative">
                {[
                  { 
                    step: 1, 
                    title: 'Consultation', 
                    desc: 'Free design consultation',
                    details: 'Meet with our experts to discuss your vision and space',
                    icon: '💬'
                  },
                  { 
                    step: 2, 
                    title: 'Custom Design', 
                    desc: '3D visualization',
                    details: 'See your dream closet come to life with stunning 3D renderings',
                    icon: '🎨'
                  },
                  { 
                    step: 3, 
                    title: 'Personalization', 
                    desc: 'Select finishes',
                    details: 'Choose from premium materials, colors, and accessories',
                    icon: '✨'
                  },
                  { 
                    step: 4, 
                    title: 'Installation', 
                    desc: 'Professional setup',
                    details: 'Expert installation by our certified craftsmen',
                    icon: '🔧'
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="relative animate-slide-up"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    {/* Step Number Circle */}
                    <div className="relative mx-auto w-48 h-48 mb-8">
                      {/* Glow effect */}
                      <div className="absolute inset-0 bg-gradient-gold rounded-full blur-xl opacity-50 animate-pulse"></div>
                      
                      {/* Main circle */}
                      <div className="relative w-full h-full bg-gradient-to-br from-gold-light via-gold to-gold-dark rounded-full shadow-2xl flex flex-col items-center justify-center transform transition-all duration-500 hover:scale-110 hover:rotate-6 cursor-pointer group">
                        <div className="text-6xl mb-2 group-hover:scale-125 transition-transform duration-300">
                          {item.icon}
                        </div>
                        <div className="text-4xl font-display font-extrabold text-white text-shadow">
                          {item.step}
                        </div>
                      </div>

                      {/* Connecting dot */}
                      <div className="absolute top-24 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rounded-full border-4 border-gold shadow-lg"></div>
                    </div>

                    {/* Content Card */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                      <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-gold text-sm font-semibold mb-3 uppercase tracking-wider">{item.desc}</p>
                      <p className="text-gray-300 text-sm leading-relaxed">{item.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile/Tablet View */}
          <div className="lg:hidden space-y-8">
            {[
              { 
                step: 1, 
                title: 'Consultation', 
                desc: 'Free design consultation',
                details: 'Meet with our experts to discuss your vision and space',
                icon: '💬'
              },
              { 
                step: 2, 
                title: 'Custom Design', 
                desc: '3D visualization',
                details: 'See your dream closet come to life with stunning 3D renderings',
                icon: '🎨'
              },
              { 
                step: 3, 
                title: 'Personalization', 
                desc: 'Select finishes',
                details: 'Choose from premium materials, colors, and accessories',
                icon: '✨'
              },
              { 
                step: 4, 
                title: 'Installation', 
                desc: 'Professional setup',
                details: 'Expert installation by our certified craftsmen',
                icon: '🔧'
              },
            ].map((item, index) => (
              <div
                key={index}
                className="relative animate-slide-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="flex items-start gap-6">
                  {/* Step Circle */}
                  <div className="relative flex-shrink-0">
                    <div className="w-20 h-20 bg-gradient-gold rounded-full shadow-gold-lg flex flex-col items-center justify-center">
                      <div className="text-3xl">{item.icon}</div>
                      <div className="text-xs font-bold text-white">{item.step}</div>
                    </div>
                    
                    {/* Vertical line connector */}
                    {index < 3 && (
                      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-0.5 h-16 bg-gradient-to-b from-gold to-transparent"></div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-gold text-sm font-semibold mb-3 uppercase tracking-wider">{item.desc}</p>
                    <p className="text-gray-300 text-sm leading-relaxed">{item.details}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <button
              onClick={() => navigate('/process')}
              className="bg-gradient-gold text-white px-10 py-5 rounded-full font-bold text-lg shadow-gold-lg hover:shadow-gold-xl transition-all duration-300 hover:scale-105 inline-flex items-center space-x-3 group"
            >
              <span>Explore Our Full Process</span>
              <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Contact Form Section - Redesigned with Split Layout */}
      <section className="section-padding bg-white relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-gold/5 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl"></div>

        <div className="container-custom mx-auto relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block mb-6">
              <span className="text-gold text-sm font-bold uppercase tracking-widest bg-gradient-gold/10 px-6 py-3 rounded-full border-2 border-gold/20">
                Get Started Today
              </span>
            </div>
            <h2 className="text-5xl md:text-7xl font-display font-bold text-dark-text mb-6">
              Let's Create <span className="text-gradient-gold inline-block bg-gradient-gold bg-clip-text text-transparent">Something Amazing</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Schedule your complimentary consultation and take the first step toward your dream space
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-12 max-w-7xl mx-auto">
            {/* Left Side - Contact Cards */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Methods */}
              <div className="space-y-4">
                {[
                  { 
                    icon: <Phone size={24} />, 
                    title: 'Call Us', 
                    value: '+1-(703)783-9581', 
                    href: 'tel:+17037839581',
                    bgColor: 'from-blue-500 to-blue-600',
                    description: 'Mon-Sat: 9 AM - 6 PM'
                  },
                  { 
                    icon: <Mail size={24} />, 
                    title: 'Email Us', 
                    value: 'Lbotla@upclosets.com', 
                    href: 'mailto:lbotla@upclosets.com',
                    bgColor: 'from-purple-500 to-purple-600',
                    description: 'Quick response within 24h'
                  },
                  { 
                    icon: <MapPin size={24} />, 
                    title: 'Visit Our Showroom', 
                    value: 'Northern Virginia', 
                    href: null,
                    bgColor: 'from-red-500 to-red-600',
                    description: 'By appointment only'
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="group relative overflow-hidden rounded-2xl p-6 bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 animate-slide-up border border-gray-100"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-14 h-14 bg-gradient-to-br ${item.bgColor} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-dark-text mb-1 text-lg">{item.title}</h4>
                        {item.href ? (
                          <a 
                            href={item.href} 
                            className="text-gray-700 hover:text-gold transition-colors font-medium block mb-1"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-gray-700 font-medium mb-1">{item.value}</p>
                        )}
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Benefits Card */}
              <div className="mt-8 p-8 bg-gradient-to-br from-gold via-gold-light to-gold-dark rounded-2xl shadow-gold-lg animate-slide-up" style={{ animationDelay: '300ms' }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Star size={24} className="text-white fill-white" />
                  </div>
                  <h4 className="font-bold text-white text-xl">What You Get</h4>
                </div>
                <ul className="space-y-4">
                  {[
                    { icon: '✓', text: 'Free in-home or virtual consultation' },
                    { icon: '✓', text: 'Professional 3D design visualization' },
                    { icon: '✓', text: 'Transparent pricing with no hidden fees' },
                    { icon: '✓', text: 'Expert guidance from our design team' },
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-white text-gold rounded-full flex items-center justify-center text-sm font-bold">
                        {item.icon}
                      </span>
                      <span className="text-white font-medium leading-relaxed">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="lg:col-span-3 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <form onSubmit={handleSubmit} className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 md:p-10 shadow-2xl border border-gray-100">
                <div className="mb-8">
                  <h3 className="text-3xl font-display font-bold text-dark-text mb-2">
                    Book Your Consultation
                  </h3>
                  <p className="text-gray-600">Fill out the form below and we'll get back to you within 24 hours</p>
                </div>

                <div className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-dark-text font-bold mb-2 text-sm uppercase tracking-wide">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/10 transition-all text-dark-text font-medium"
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-dark-text font-bold mb-2 text-sm uppercase tracking-wide">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/10 transition-all text-dark-text font-medium"
                        placeholder="(703) 123-4567"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-dark-text font-bold mb-2 text-sm uppercase tracking-wide">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/10 transition-all text-dark-text font-medium"
                      placeholder="john@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-dark-text font-bold mb-2 text-sm uppercase tracking-wide">
                      What Are You Looking For? <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/10 transition-all text-dark-text font-medium"
                      required
                    >
                      <option value="">Select a service</option>
                      <option value="walk-in-closets">Walk-in Closets</option>
                      <option value="reach-in-closets">Reach-in Closets</option>
                      <option value="office-room">Office Room</option>
                      <option value="hobby-room">Hobby Room</option>
                      <option value="mud-room">Mud Room</option>
                      <option value="laundry-room">Laundry Room</option>
                      <option value="kitchen-pantry">Kitchen Pantry</option>
                      <option value="garages">Garages</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-dark-text font-bold mb-2 text-sm uppercase tracking-wide">
                      Tell Us About Your Vision
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-5 py-4 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/10 transition-all resize-none text-dark-text font-medium"
                      rows={5}
                      placeholder="Share details about your space, style preferences, timeline, or any specific requirements..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-gold text-white px-8 py-6 rounded-xl font-bold text-lg hover:shadow-gold-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-3 group mt-6"
                  >
                    <Calendar size={28} className="group-hover:rotate-12 transition-transform" />
                    <span>Schedule My Free Consultation</span>
                    <ArrowRight size={28} className="group-hover:translate-x-2 transition-transform" />
                  </button>

                  <p className="text-sm text-gray-500 text-center pt-4">
                    🔒 Your information is secure. By submitting, you agree to be contacted regarding your consultation.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="section-padding bg-gradient-dark text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)',
        }}></div>
        
        <div className="container-custom mx-auto relative z-10">
          <Sparkles className="w-20 h-20 text-gold mx-auto mb-8 animate-float" />
          <h2 className="text-5xl md:text-6xl font-display font-bold mb-6">
            Ready to Transform <span className="text-gradient-gold inline-block bg-gradient-gold bg-clip-text text-transparent">Your Space</span>?
          </h2>
          <p className="text-xl mb-10 text-gray-300 max-w-2xl mx-auto">
            Let's bring your vision to life with our expert design team
          </p>
          <button
            onClick={() => navigate('/contact')}
            className="btn-primary"
          >
            Schedule Free Consultation
          </button>
        </div>
      </section>
    </div>
  );
}
