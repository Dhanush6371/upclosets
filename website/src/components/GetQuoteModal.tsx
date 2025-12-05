import { useState } from 'react';
import { X, Ruler, Package, DollarSign, Calculator } from 'lucide-react';

interface GetQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemTitle?: string;
  categoryName?: string;
}

export default function GetQuoteModal({ isOpen, onClose, itemTitle, categoryName }: GetQuoteModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    classification: categoryName || '',
    woodType: '',
    length: '',
    height: '',
    width: '',
    finishQuality: '',
    accessories: '',
    message: ''
  });

  const [estimation, setEstimation] = useState<number | null>(null);

  // Closet classifications
  const classifications = [
    'Walk-in Closets',
    'Reach-in Closets',
    'Kitchen Pantry',
    'Laundry Room',
    'Garage Storage',
    'Office Storage',
    'Mud Room',
    'Hobby Room',
    'Custom Design'
  ];

  // Wood types with price multipliers
  const woodTypes = [
    { name: 'Pine', multiplier: 1.0, description: 'Budget-friendly' },
    { name: 'Oak', multiplier: 1.3, description: 'Classic & Durable' },
    { name: 'Cherry', multiplier: 1.5, description: 'Rich & Elegant' },
    { name: 'Walnut', multiplier: 1.7, description: 'Premium Dark Wood' },
    { name: 'Maple', multiplier: 1.4, description: 'Modern & Smooth' },
    { name: 'Mahogany', multiplier: 1.8, description: 'Luxury Grade' }
  ];

  // Finish quality options
  const finishOptions = [
    { name: 'Standard', multiplier: 1.0, description: 'Basic finish' },
    { name: 'Premium', multiplier: 1.3, description: 'Enhanced finish with soft-close' },
    { name: 'Luxury', multiplier: 1.6, description: 'High-end finish with custom hardware' }
  ];

  // Accessory packages
  const accessoryOptions = [
    { name: 'Basic', cost: 0, description: 'Standard shelving & rods' },
    { name: 'Enhanced', cost: 500, description: 'LED lighting, pull-out drawers' },
    { name: 'Premium', cost: 1200, description: 'Full lighting, islands, mirrors, seating' }
  ];

  // Calculate estimation
  const calculateEstimation = () => {
    const length = parseFloat(formData.length) || 0;
    const height = parseFloat(formData.height) || 0;
    const width = parseFloat(formData.width) || 0;
    
    if (length === 0 || height === 0 || width === 0) {
      alert('Please enter valid dimensions');
      return;
    }

    // Base rate per cubic foot
    const baseRatePerCubicFoot = 45;
    
    // Calculate cubic footage
    const cubicFootage = length * height * width;
    
    // Get multipliers
    const woodMultiplier = woodTypes.find(w => w.name === formData.woodType)?.multiplier || 1.0;
    const finishMultiplier = finishOptions.find(f => f.name === formData.finishQuality)?.multiplier || 1.0;
    const accessoryCost = accessoryOptions.find(a => a.name === formData.accessories)?.cost || 0;
    
    // Calculate final price
    const basePrice = cubicFootage * baseRatePerCubicFoot;
    const woodAdjustment = basePrice * woodMultiplier;
    const finishAdjustment = woodAdjustment * finishMultiplier;
    const totalEstimation = finishAdjustment + accessoryCost;
    
    setEstimation(Math.round(totalEstimation));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateEstimation();
    
    // You can also send this data to your backend
    console.log('Estimation Request:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Reset estimation when form changes
    setEstimation(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-gold text-white p-6 rounded-t-2xl flex justify-between items-center z-10">
          <div>
            <h2 className="text-3xl font-display font-bold mb-1">Get Your Estimation</h2>
            {itemTitle && (
              <p className="text-white/90 text-sm">For: {itemTitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Contact Information */}
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="text-xl font-display font-bold text-dark-text mb-4">Contact Information</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all outline-none"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all outline-none"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all outline-none"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>
          </div>

          {/* Classification & Wood Type */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Package className="inline mr-2 text-gold" size={18} />
                Closet Classification *
              </label>
              <select
                name="classification"
                value={formData.classification}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all outline-none"
              >
                <option value="">Select type...</option>
                {classifications.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Wood Type *
              </label>
              <select
                name="woodType"
                value={formData.woodType}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all outline-none"
              >
                <option value="">Select wood...</option>
                {woodTypes.map((wood) => (
                  <option key={wood.name} value={wood.name}>
                    {wood.name} - {wood.description} (×{wood.multiplier})
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Wood type affects the final price</p>
            </div>
          </div>

          {/* Dimensions */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <Ruler className="inline mr-2 text-gold" size={18} />
              Dimensions (in feet) *
            </label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Length (ft)</label>
                <input
                  type="number"
                  name="length"
                  value={formData.length}
                  onChange={handleChange}
                  required
                  min="1"
                  step="0.1"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all outline-none"
                  placeholder="10"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Height (ft)</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  required
                  min="1"
                  step="0.1"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all outline-none"
                  placeholder="8"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Width/Depth (ft)</label>
                <input
                  type="number"
                  name="width"
                  value={formData.width}
                  onChange={handleChange}
                  required
                  min="1"
                  step="0.1"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all outline-none"
                  placeholder="6"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Cubic footage: {formData.length && formData.height && formData.width 
                ? (parseFloat(formData.length) * parseFloat(formData.height) * parseFloat(formData.width)).toFixed(2) 
                : '0'} ft³
            </p>
          </div>

          {/* Finish Quality */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <DollarSign className="inline mr-2 text-gold" size={18} />
                Finish Quality *
              </label>
              <select
                name="finishQuality"
                value={formData.finishQuality}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all outline-none"
              >
                <option value="">Select finish...</option>
                {finishOptions.map((finish) => (
                  <option key={finish.name} value={finish.name}>
                    {finish.name} - {finish.description} (×{finish.multiplier})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Accessories Package *
              </label>
              <select
                name="accessories"
                value={formData.accessories}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all outline-none"
              >
                <option value="">Select package...</option>
                {accessoryOptions.map((acc) => (
                  <option key={acc.name} value={acc.name}>
                    {acc.name} - {acc.description} (+${acc.cost})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Additional Message */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Additional Requirements
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all outline-none resize-none"
              placeholder="Any specific requirements or questions..."
            />
          </div>

          {/* Estimation Result */}
          {estimation !== null && (
            <div className="bg-gradient-gold text-white p-6 rounded-xl animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-1">Estimated Cost</p>
                  <p className="text-4xl font-display font-bold">
                    ${estimation.toLocaleString()}
                  </p>
                  <p className="text-xs opacity-75 mt-2">
                    *This is an approximate estimate. Final price may vary based on site inspection and specific requirements.
                  </p>
                </div>
                <Calculator size={48} className="opacity-50" />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-gradient-gold text-white px-8 py-4 rounded-xl font-semibold hover:shadow-gold-lg transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Calculator size={20} />
              <span>Calculate Estimation</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-4 rounded-xl font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300"
            >
              Close
            </button>
          </div>

          {estimation !== null && (
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  alert('Thank you! Our team will contact you shortly with a detailed quote.');
                  onClose();
                }}
                className="btn-primary"
              >
                Request Detailed Quote
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

