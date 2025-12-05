import { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Star, Eye, Heart, Loader2 } from 'lucide-react';
import { useRouter } from '../utils/router';
import { 
  fetchCategories, 
  fetchAllCatalogItems 
} from '../services/googleDrive';
import GetQuoteModal from '../components/GetQuoteModal';

interface Category {
  id: string;
  label: string;
  icon: string;
}

interface CatalogItem {
  id: string;
  title: string;
  image: string;
  categoryId: string;
  categoryName: string;
}

// Google Drive API Key for fallback URLs
const API_KEY = 'AIzaSyDr-0-WButyM1rAXdA1wxFQGrFYwFVOP2g';

export default function Catalog() {
  const { navigate } = useRouter();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);

  // Icon mapping for categories (you can customize this)
  const getIconForCategory = (index: number): string => {
    const icons = ['🚪', '👔', '📦', '🏠', '✨', '💼', '🎨', '👞', '🧺', '🍽️', '🔧'];
    return icons[index % icons.length];
  };

  // Fetch categories and catalog items from Google Drive
  useEffect(() => {
    async function loadData() {
      try {
        console.log('📦 Starting to load catalog data...');
        setLoading(true);
        setError(null);

        // Fetch categories from Google Drive
        console.log('1️⃣ Fetching categories...');
        const driveCategories = await fetchCategories();
        console.log('✅ Categories received:', driveCategories);
        
        // Transform to UI categories with "All" option
        const allCategory: Category = { id: 'all', label: 'All Collections', icon: '✨' };
        const transformedCategories = driveCategories.map((cat, index) => ({
          id: cat.id,
          label: cat.name,
          icon: getIconForCategory(index)
        }));
        
        console.log('✅ Transformed categories:', [allCategory, ...transformedCategories]);
        setCategories([allCategory, ...transformedCategories]);

        // Fetch all catalog items
        console.log('2️⃣ Fetching catalog items...');
        const items = await fetchAllCatalogItems();
        console.log('✅ Catalog items received:', items);
        setCatalogItems(items);

        console.log('🎉 Catalog data loaded successfully!');
        setLoading(false);
      } catch (err) {
        console.error('❌ Error loading catalog data:', err);
        setError('Failed to load catalog. Please try again later.');
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const filteredItems = activeCategory === 'all' 
    ? catalogItems 
    : catalogItems.filter(item => item.categoryId === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1600)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
          {/* Animated overlay pattern */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)',
          }}></div>
        </div>

        <div className="relative z-10 text-center text-white px-6 animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-gold rounded-full mb-8 shadow-gold-lg animate-float">
            <Sparkles size={48} className="text-white" />
          </div>
          <h1 className="text-6xl md:text-7xl font-display font-bold mb-6 text-shadow-lg">
            Explore Our<br />
            <span className="text-gradient-gold inline-block bg-gradient-to-r from-gold-light via-gold to-gold-dark bg-clip-text text-transparent">
              Stunning Collection
            </span>
          </h1>
          <p className="text-xl md:text-2xl font-light max-w-3xl mx-auto text-gray-200 mb-8">
            Browse beautifully designed custom closets and find the perfect solution for your lifestyle
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="btn-primary"
            >
              Get Free Estimation
            </button>
            <button 
              onClick={() => navigate('/process')}
              className="btn-outline"
            >
              Our Process
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/70 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Category Filter Section */}
      <section className="section-padding bg-white">
        <div className="container-custom mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="text-gold text-sm font-semibold uppercase tracking-widest bg-gold/10 px-4 py-2 rounded-full">
                Our Categories
              </span>
            </div>
            <h2 className="text-5xl font-display font-bold text-dark-text mb-4">
              Choose Your <span className="text-gradient-gold inline-block bg-gradient-gold bg-clip-text text-transparent">Category</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Select a category to discover our expertly crafted custom solutions
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-12 h-12 text-gold animate-spin" />
              <span className="ml-4 text-lg text-gray-600">Loading categories...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="inline-block p-6 bg-red-50 rounded-2xl shadow-elegant">
                <p className="text-red-600 text-lg">{error}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap justify-center gap-3 mb-12">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`group px-6 py-3.5 rounded-full font-semibold transition-all duration-300 ${
                      activeCategory === cat.id
                        ? 'bg-gradient-gold text-white shadow-gold-lg scale-105'
                        : 'bg-white text-dark-text hover:bg-gray-50 shadow-md hover:shadow-lg border border-gray-100'
                    }`}
                  >
                    <span className="mr-2 text-lg">{cat.icon}</span>
                    {cat.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Catalog Grid Section */}
      <section className="section-padding bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="container-custom mx-auto">
          {!loading && !error && (
            <div className="text-center mb-10">
              <div className="inline-flex items-center space-x-3 bg-white rounded-full px-8 py-4 shadow-elegant">
                <Star className="text-gold fill-gold" size={24} />
                <p className="text-gray-700 text-lg">
                  Showing <span className="font-bold text-gold text-xl">{filteredItems.length}</span> 
                  <span className="mx-2">·</span>
                  <span className="font-semibold">
                    {activeCategory === 'all' ? 'All Collections' : categories.find(c => c.id === activeCategory)?.label}
                  </span>
                </p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-16 h-16 text-gold animate-spin" />
              <span className="ml-4 text-xl text-gray-600">Loading catalog items...</span>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <div className="inline-block p-6 bg-red-50 rounded-2xl shadow-elegant">
                <p className="text-red-600 text-lg">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 bg-gold text-white px-6 py-3 rounded-xl font-semibold hover:shadow-gold-lg transition-all duration-300"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  className="card-elegant card-interactive group animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  {/* Image Container */}
                  <div className="relative h-72 overflow-hidden bg-gray-200">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                      crossOrigin="anonymous"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        const currentSrc = img.src;
                        console.error('❌ Failed to load image:', currentSrc);
                        
                        // Try fallback URLs in sequence
                        const fallbackUrls = [
                          `https://www.googleapis.com/drive/v3/files/${item.id}?alt=media&key=${API_KEY}`,
                          `https://drive.google.com/uc?export=download&id=${item.id}`,
                          `https://lh3.googleusercontent.com/d/${item.id}`,
                          `https://drive.google.com/thumbnail?id=${item.id}&sz=w1000-h1000`,
                          'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800'
                        ];
                        
                        // Find next URL to try
                        const currentIndex = fallbackUrls.findIndex(url => currentSrc.includes(url) || url === currentSrc);
                        const nextIndex = currentIndex + 1;
                        
                        if (nextIndex < fallbackUrls.length) {
                          console.log(`🔄 Trying fallback ${nextIndex + 1}/${fallbackUrls.length}:`, fallbackUrls[nextIndex]);
                          img.src = fallbackUrls[nextIndex];
                        } else {
                          console.error('❌ All fallback URLs failed for image:', item.id);
                        }
                      }}
                    />
                    
                    {/* Overlay on hover */}
                    <div className={`gradient-overlay transition-opacity duration-500 ${hoveredItem === item.id ? 'opacity-100' : 'opacity-0'}`}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Eye className="text-white" size={40} />
                      </div>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="glass-effect text-dark-text px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                        {item.categoryName}
                      </span>
                    </div>

                    {/* Quick Action Button */}
                    <div className={`absolute bottom-4 right-4 transition-all duration-300 ${hoveredItem === item.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                      <button className="bg-white text-gold p-3 rounded-full shadow-elegant hover:shadow-elegant-lg hover:scale-110 transition-all duration-300">
                        <Heart size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 bg-gradient-to-br from-white to-gray-50">
                    <h3 className="text-2xl font-display font-bold text-dark-text mb-3 group-hover:text-gold transition-colors">
                      {item.title}
                    </h3>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => navigate('/contact')}
                        className="flex-1 bg-gradient-gold text-white px-4 py-3.5 rounded-xl font-semibold hover:shadow-gold-lg transition-all duration-300 flex items-center justify-center space-x-2 group/btn"
                      >
                        <span>View Details</span>
                        <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setIsModalOpen(true);
                        }}
                        className="flex-1 bg-white border-2 border-gold text-gold px-4 py-3.5 rounded-xl font-semibold hover:bg-gold hover:text-white hover:shadow-gold transition-all duration-300"
                      >
                        Get Estimation
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="inline-block p-6 bg-white rounded-2xl shadow-elegant">
                <p className="text-gray-400 text-xl">No items found in this category.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-dark text-white text-center relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)',
        }}></div>
        
        <div className="container-custom mx-auto relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="inline-block mb-6">
              <Sparkles className="text-gold w-16 h-16 animate-float" />
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Can't Find What You're <span className="text-gradient-gold inline-block bg-gradient-gold bg-clip-text text-transparent">Looking For</span>?
            </h2>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Every project is unique. Let's create a custom solution tailored specifically to your needs and vision.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/contact')}
                className="btn-primary"
              >
                Schedule Free Consultation
              </button>
              <button
                onClick={() => navigate('/catalog')}
                className="btn-outline"
              >
                Browse More Designs
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Get Estimation Modal */}
      <GetQuoteModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedItem(null);
        }}
        itemTitle={selectedItem?.title}
        categoryName={selectedItem?.categoryName}
      />
    </div>
  );
}
