import { Mail, Phone, Facebook, Instagram, Linkedin, MapPin, Clock, ArrowRight, Heart, Sparkles, Youtube } from 'lucide-react';
import { useRouter } from '../utils/router';

export default function Footer() {
  const { navigate } = useRouter();

  const quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Our Process', path: '/process' },
    { label: 'Contact', path: '/contact' },
  ];

  const services = [
    { label: 'Walk-in Closets', path: '/walk-in-closets' },
    { label: 'Reach-in Closets', path: '/reach-in-closets' },
    { label: 'Kitchen Pantry', path: '/kitchen-pantry' },
    { label: 'Office Storage', path: '/office-room' },
    { label: 'Garage Organization', path: '/garages' },
    { label: 'View All Services', path: '/catalog' },
  ];

  const socialLinks = [
    { 
      name: 'Facebook', 
      icon: <Facebook size={20} />, 
      url: 'https://facebook.com',
      color: 'bg-[#1877F2] hover:bg-[#1877F2]/90',
    },
    { 
      name: 'LinkedIn', 
      icon: <Linkedin size={20} />, 
      url: 'https://www.linkedin.com',
      color: 'bg-[#0A66C2] hover:bg-[#0A66C2]/90',
    },
    { 
      name: 'Instagram', 
      icon: <Instagram size={20} />, 
      url: 'https://instagram.com',
      color: 'bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#515BD4]',
    },
    { 
      name: 'YouTube', 
      icon: <Youtube size={20} />, 
      url: 'https://youtube.com',
      color: 'bg-[#FF0000] hover:bg-[#FF0000]/90',
    },
  ];

  return (
    <footer className="bg-gradient-dark text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)',
        }}></div>
      </div>

      {/* Main Footer Content */}
      <div className="container-custom mx-auto px-6 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6 group">
              <div className="w-14 h-14 bg-gradient-gold rounded-xl flex items-center justify-center shadow-gold group-hover:scale-110 transition-transform">
                <Sparkles className="text-white" size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold text-white">Up Closets</h3>
                <p className="text-xs text-gray-400 uppercase tracking-widest">Upgrade Your Space</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6">
              Transforming spaces with custom closet solutions designed for beauty and built for
              function. Experience premium craftsmanship and personalized service.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <a 
                href="tel:+17037839581"
                className="flex items-center gap-3 text-gray-300 hover:text-gold transition-colors group"
              >
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                  <Phone size={18} />
                </div>
                <span className="font-medium">+1-(703)783-9581</span>
              </a>
              <a
                href="mailto:lbotla@upclosets.com"
                className="flex items-center gap-3 text-gray-300 hover:text-gold transition-colors group"
              >
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                  <Mail size={18} />
                </div>
                <span className="font-medium">lbotla@upclosets.com</span>
              </a>
              <div className="flex items-start gap-3 text-gray-300">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <MapPin size={18} />
                </div>
                <div>
                  <div className="font-medium">Northern Virginia</div>
                  <div className="text-sm text-gray-400">Serving all NOVA counties</div>
                </div>
              </div>
              <div className="flex items-start gap-3 text-gray-300">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <Clock size={18} />
                </div>
                <div>
                  <div className="font-medium">Mon - Sat: 9 AM - 6 PM</div>
                  <div className="text-sm text-gray-400">Sunday: By Appointment</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-display font-bold mb-6 text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-gold rounded-full"></span>
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="text-gray-300 hover:text-gold transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 -ml-6 group-hover:ml-0 transition-all" />
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xl font-display font-bold mb-6 text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-gold rounded-full"></span>
              Our Services
            </h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.path}>
                  <button
                    onClick={() => navigate(service.path)}
                    className="text-gray-300 hover:text-gold transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 -ml-6 group-hover:ml-0 transition-all" />
                    <span>{service.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Social */}
          <div>
            <h4 className="text-xl font-display font-bold mb-6 text-white flex items-center gap-2">
              <span className="w-1 h-6 bg-gradient-gold rounded-full"></span>
              Stay Connected
            </h4>
            <p className="text-gray-300 mb-4">
              Follow us on social media for inspiration, tips, and special offers.
            </p>
            
            {/* Social Links */}
            <div className="flex flex-wrap gap-3 mb-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`w-12 h-12 rounded-xl ${social.color} text-white flex items-center justify-center hover:scale-110 transition-transform shadow-md hover:shadow-lg`}
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* CTA Card */}
            <div className="bg-gradient-gold rounded-2xl p-6 shadow-gold">
              <h5 className="text-white font-bold text-lg mb-2">Ready to Get Started?</h5>
              <p className="text-white/90 text-sm mb-4">
                Book your free consultation today!
              </p>
              <button
                onClick={() => navigate('/contact')}
                className="w-full bg-white text-gold px-4 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Contact Us</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              &copy; {new Date().getFullYear()} UpClosets of NOVA. All Rights Reserved.
            </p>
            
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <button 
                onClick={() => navigate('/about')}
                className="text-gray-400 hover:text-gold transition-colors"
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => navigate('/about')}
                className="text-gray-400 hover:text-gold transition-colors"
              >
                Terms of Service
              </button>
              <button 
                onClick={() => navigate('/about')}
                className="text-gray-400 hover:text-gold transition-colors"
              >
                Sitemap
              </button>
            </div>

            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <span>Made with</span>
              <Heart size={16} className="text-red-500 fill-red-500 animate-pulse" />
              <span>in Virginia</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -mb-32 -ml-32"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl -mt-48 -mr-48"></div>
    </footer>
  );
}
