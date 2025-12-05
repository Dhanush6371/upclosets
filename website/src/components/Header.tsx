import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Phone, Mail, Facebook, Instagram, Linkedin, Youtube, Sparkles } from 'lucide-react';
import { useRouter } from '../utils/router';
import { NavItem } from '../types';

const navItems: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  {
    label: 'Closets',
    dropdown: [
      { label: 'Walk-in Closets', path: '/walk-in-closets' },
      { label: 'Reach-in Closets', path: '/reach-in-closets' },
      { label: 'Office Room', path: '/office-room' },
      { label: 'Hobby Room', path: '/hobby-room' },
      { label: 'Mud Room', path: '/mud-room' },
      { label: 'Laundry Room', path: '/laundry-room' },
      { label: 'Kitchen Pantry', path: '/kitchen-pantry' },
      { label: 'Garages', path: '/garages' },
    ],
  },
  { label: 'Work Culture', path: '/process' },
  { label: 'Contact Us', path: '/contact' },
  { label: 'Closet Catalog', path: '/catalog' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { currentPath, navigate } = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (path?: string) => {
    if (path) {
      navigate(path);
      setIsMobileMenuOpen(false);
      setActiveDropdown(null);
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-lg shadow-elegant' 
        : 'bg-white shadow-sm'
    }`}>
      {/* Top bar: logo + contact + CTA */}
      <div className="container-custom mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button 
            onClick={() => handleNavClick('/')} 
            className="group flex items-center gap-3 transition-all hover:scale-105"
          >
            <div className="w-12 h-12 bg-gradient-gold rounded-xl flex items-center justify-center shadow-gold group-hover:shadow-gold-lg transition-all">
              <Sparkles className="text-white" size={24} />
            </div>
            <div className="text-left">
              <div className="text-2xl font-display font-extrabold text-dark-text leading-tight">
                Closets Pro DMV
              </div>
              <div className="text-xs tracking-widest text-gray-500 uppercase">
                Upgrade Your Space
              </div>
            </div>
          </button>

          {/* Desktop Contact & CTA */}
          <div className="hidden lg:flex items-center space-x-6">
            <a 
              href="tel:+17037839581" 
              className="flex items-center gap-2 text-dark-text hover:text-gold transition-colors group"
            >
              <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                <Phone size={18} className="text-gold" />
              </div>
              <span className="font-semibold">+1-(703)783-9581</span>
            </a>
            
            <a 
              href="mailto:lbotla@upclosets.com" 
              className="flex items-center gap-2 text-dark-text hover:text-gold transition-colors group"
            >
              <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                <Mail size={18} className="text-gold" />
              </div>
              <span className="font-semibold">Lbotla@upclosets.com</span>
            </a>
            
            <div className="flex items-center gap-3 ml-4">
              <a
                href="http://localhost:3001"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary !py-3 !px-6 text-base inline-flex items-center justify-center"
              >
                Track Order
              </a>
              <button
                onClick={() => handleNavClick('/contact')}
                className="btn-primary !py-3 !px-6 text-base"
              >
                Get Started
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center text-dark-text hover:bg-gold/20 transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Bottom bar: navigation */}
      <div className={`border-t transition-colors ${isScrolled ? 'border-gray-100' : 'border-gray-100'}`}>
        <div className="container-custom mx-auto px-6">
          <div className="hidden lg:flex items-center justify-between h-16">
            {/* Navigation */}
            <nav className="flex items-center space-x-8">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="relative group"
                >
                  {item.dropdown ? (
                    <div
                      onMouseEnter={() => setActiveDropdown(item.label)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <button className="flex items-center gap-2 font-semibold text-dark-text hover:text-gold transition-colors py-2">
                        <span>{item.label}</span>
                        <ChevronDown 
                          size={16} 
                          className={`transition-transform ${activeDropdown === item.label ? 'rotate-180' : ''}`}
                        />
                      </button>
                      
                      {/* Dropdown Menu */}
                      {activeDropdown === item.label && (
                        <div 
                          className="absolute top-full left-0 pt-2 w-64 z-50 animate-fade-in"
                        >
                          <div className="bg-white rounded-2xl shadow-elegant-lg border border-gray-100 py-3 overflow-hidden">
                            {item.dropdown.map((dropdownItem) => (
                              <button
                                key={dropdownItem.path}
                                onClick={() => handleNavClick(dropdownItem.path)}
                                className={`block w-full text-left px-6 py-3 text-dark-text hover:bg-gradient-gold hover:text-white transition-all ${
                                  currentPath === dropdownItem.path ? 'bg-gold/10 font-bold text-gold' : ''
                                }`}
                              >
                                {dropdownItem.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleNavClick(item.path)}
                      className={`font-semibold transition-all relative py-2 ${
                        currentPath === item.path
                          ? 'text-gold'
                          : 'text-dark-text hover:text-gold'
                      }`}
                    >
                      {item.label}
                      {currentPath === item.path && (
                        <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-gold rounded-full"></span>
                      )}
                    </button>
                  )}
                </div>
              ))}
            </nav>
            
            {/* Social Links */}
            <div className="flex items-center gap-2">
              <span className="text-gray-500 font-semibold text-sm mr-2">Follow Us:</span>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-10 h-10 rounded-xl bg-[#1877F2] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-md hover:shadow-lg"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="https://www.linkedin.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-10 h-10 rounded-xl bg-[#0A66C2] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-md hover:shadow-lg"
              >
                <Linkedin size={18} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#515BD4] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-md hover:shadow-lg"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-10 h-10 rounded-xl bg-[#FF0000] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-md hover:shadow-lg"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden py-6 animate-fade-in">
              {/* Mobile Contact */}
              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                <a 
                  href="tel:+17037839581" 
                  className="flex items-center gap-3 text-dark-text hover:text-gold transition-colors"
                >
                  <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
                    <Phone size={18} className="text-gold" />
                  </div>
                  <span className="font-medium">+1-(703)783-9581</span>
                </a>
                
                <a 
                  href="mailto:lbotla@upclosets.com" 
                  className="flex items-center gap-3 text-dark-text hover:text-gold transition-colors"
                >
                  <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center">
                    <Mail size={18} className="text-gold" />
                  </div>
                  <span className="font-medium">Lbotla@upclosets.com</span>
                </a>
              </div>

              {/* Mobile CTA Buttons */}
              <div className="flex flex-col gap-3 mb-6 pb-6 border-b border-gray-200">
                <a
                  href="http://localhost:3001"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary w-full inline-flex items-center justify-center"
                >
                  Track Order
                </a>
                <button
                  onClick={() => handleNavClick('/contact')}
                  className="btn-primary w-full"
                >
                  Get Started
                </button>
              </div>

              {/* Mobile Navigation */}
              <nav className="space-y-2 mb-6 pb-6 border-b border-gray-200">
                {navItems.map((item) => (
                  <div key={item.label}>
                    {item.dropdown ? (
                      <>
                        <button
                          onClick={() =>
                            setActiveDropdown(activeDropdown === item.label ? null : item.label)
                          }
                          className="flex items-center justify-between w-full text-dark-text font-semibold py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                          <span>{item.label}</span>
                          <ChevronDown
                            size={18}
                            className={`transition-transform ${
                              activeDropdown === item.label ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        {activeDropdown === item.label && (
                          <div className="pl-4 space-y-1 mt-2">
                            {item.dropdown.map((dropdownItem) => (
                              <button
                                key={dropdownItem.path}
                                onClick={() => handleNavClick(dropdownItem.path)}
                                className={`block w-full text-left py-2 px-4 rounded-lg transition-colors ${
                                  currentPath === dropdownItem.path
                                    ? 'bg-gold/10 text-gold font-semibold'
                                    : 'text-dark-text hover:bg-gray-50'
                                }`}
                              >
                                {dropdownItem.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <button
                        onClick={() => handleNavClick(item.path)}
                        className={`block w-full text-left py-3 px-4 rounded-xl font-semibold transition-colors ${
                          currentPath === item.path
                            ? 'bg-gold/10 text-gold'
                            : 'text-dark-text hover:bg-gray-50'
                        }`}
                      >
                        {item.label}
                      </button>
                    )}
                  </div>
                ))}
              </nav>

              {/* Mobile Social Links */}
              <div className="flex items-center gap-2 justify-center">
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-10 h-10 rounded-xl bg-[#1877F2] text-white flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <Facebook size={18} />
                </a>
                <a 
                  href="https://www.linkedin.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-10 h-10 rounded-xl bg-[#0A66C2] text-white flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <Linkedin size={18} />
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#515BD4] text-white flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <Instagram size={18} />
                </a>
                <a 
                  href="https://youtube.com" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-10 h-10 rounded-xl bg-[#FF0000] text-white flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <Youtube size={18} />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
