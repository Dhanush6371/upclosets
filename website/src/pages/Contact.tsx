import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Calendar, Video, Home, CheckCircle, Sparkles, Award, TrendingUp, Package } from 'lucide-react';
import { submitConsultation, ConsultationFormData } from '../services/api';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    zip_code: '',
    closet_type: '',
    number_of_spaces: '',
    date: '',
    time: '',
    meetingType: 'virtual' as 'virtual' | 'in-person' | 'phone_only',
    projectDetails: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Map meetingType to consultation_type for backend
      const consultationType = formData.meetingType === 'in-person' ? 'in_person' : formData.meetingType;
      
      const consultationData: ConsultationFormData = {
        phone: formData.phone,
        name: formData.name,
        address: formData.address,
        zip_code: formData.zip_code,
        closet_type: formData.closet_type,
        number_of_spaces: parseInt(formData.number_of_spaces) || 1,
        consultation_type: consultationType as 'phone_only' | 'in_person' | 'virtual',
        preferred_date: formData.date,
        preferred_time: formData.time,
      };

      await submitConsultation(consultationData);
      
      alert(`Thank you for booking your consultation! We've received your request and will contact you at ${formData.phone} to confirm your appointment for ${formData.date} at ${formData.time}.`);
      
      // Reset form
      setFormData({ 
        name: '', 
        email: '', 
        phone: '', 
        address: '',
        zip_code: '',
        closet_type: '',
        number_of_spaces: '',
        date: '', 
        time: '', 
        meetingType: 'virtual',
        projectDetails: '' 
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit consultation request';
      setSubmitError(errorMessage);
      alert(`Error: ${errorMessage}. Please try again or call us directly.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  return (
    <div className="min-h-screen">
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=1600)',
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>

        <div className="relative z-10 text-center text-white px-6">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Book Your Free Consultation</h1>
          <p className="text-xl md:text-2xl font-light max-w-3xl mx-auto">
            Choose a time that fits your schedule and meet with one of our expert designers.
            You'll receive a custom 3D design, price estimate, and timeline.
          </p>
        </div>
      </section>

      {/* What You'll Receive Section */}
      <section className="section-padding bg-light-bg">
        <div className="container-custom mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-dark-text mb-4">
              What You'll Receive
              </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our free consultation is comprehensive and designed to turn your vision into reality
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-2xl transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gold bg-opacity-10 text-gold rounded-full mb-4">
                <Sparkles size={32} />
              </div>
              <h3 className="text-xl font-bold text-dark-text mb-3">Custom 3D Design</h3>
              <p className="text-gray-600">
                See your space come to life with detailed 3D visualizations before any work begins
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-2xl transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gold bg-opacity-10 text-gold rounded-full mb-4">
                <TrendingUp size={32} />
              </div>
              <h3 className="text-xl font-bold text-dark-text mb-3">Detailed Price Estimate</h3>
              <p className="text-gray-600">
                Transparent pricing with no hidden fees - know exactly what to expect
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg text-center hover:shadow-2xl transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gold bg-opacity-10 text-gold rounded-full mb-4">
                <Award size={32} />
              </div>
              <h3 className="text-xl font-bold text-dark-text mb-3">Project Timeline</h3>
              <p className="text-gray-600">
                Clear timeline from design to installation so you can plan accordingly
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section className="section-padding bg-white">
        <div className="container-custom mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-dark-text mb-4">
              Book Your Free Consultation
            </h2>
            <p className="text-lg text-gray-600">
              It only takes a few minutes to get started
            </p>
          </div>

          {/* Simple 3-Step Process */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gold text-white rounded-full font-bold text-xl mb-3">
                1
              </div>
              <h3 className="font-semibold text-dark-text mb-2">Select Date & Time</h3>
              <p className="text-sm text-gray-600">Pick a convenient slot</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gold text-white rounded-full font-bold text-xl mb-3">
                2
              </div>
              <h3 className="font-semibold text-dark-text mb-2">Choose Format</h3>
              <p className="text-sm text-gray-600">Virtual or in-person</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gold text-white rounded-full font-bold text-xl mb-3">
                3
              </div>
              <h3 className="font-semibold text-dark-text mb-2">Get Confirmation</h3>
              <p className="text-sm text-gray-600">Receive reminders</p>
            </div>
          </div>

          {/* Booking Form Card */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 md:p-12 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-xl font-bold text-dark-text mb-6 pb-3 border-b-2 border-gold">
                  Your Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-dark-text font-semibold mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gold transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-dark-text font-semibold mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(555) 123-4567"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gold transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-dark-text font-semibold mb-2">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gold transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-dark-text font-semibold mb-2">Zip Code *</label>
                    <input
                      type="text"
                      value={formData.zip_code}
                      onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                      placeholder="22102"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gold transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-dark-text font-semibold mb-2">Address *</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="123 Main Street, City, State"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gold transition-all"
                    required
                  />
                </div>
              </div>

              {/* Project Information */}
              <div>
                <h3 className="text-xl font-bold text-dark-text mb-6 pb-3 border-b-2 border-gold">
                  Project Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-dark-text font-semibold mb-2 flex items-center space-x-2">
                      <Package size={20} className="text-gold" />
                      <span>Closet Type *</span>
                    </label>
                    <select
                      value={formData.closet_type}
                      onChange={(e) => setFormData({ ...formData, closet_type: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gold transition-all"
                      required
                    >
                      <option value="">Select closet type</option>
                      <option value="Walk-in Closet">Walk-in Closet</option>
                      <option value="Reach-in Closet">Reach-in Closet</option>
                      <option value="Garage">Garage</option>
                      <option value="Kitchen Pantry">Kitchen Pantry</option>
                      <option value="Laundry Room">Laundry Room</option>
                      <option value="Home Office">Home Office</option>
                      <option value="Mud Room">Mud Room</option>
                      <option value="Hobby Room">Hobby Room</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-dark-text font-semibold mb-2">Number of Spaces *</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.number_of_spaces}
                      onChange={(e) => setFormData({ ...formData, number_of_spaces: e.target.value })}
                      placeholder="1"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gold transition-all"
                      required
                    />
                  </div>
                </div>
                </div>

              {/* Schedule Selection */}
              <div>
                <h3 className="text-xl font-bold text-dark-text mb-6 pb-3 border-b-2 border-gold">
                  Choose Your Schedule
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-dark-text font-semibold mb-2 flex items-center space-x-2">
                      <Calendar size={20} className="text-gold" />
                      <span>Preferred Date *</span>
                    </label>
                  <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gold transition-all"
                    required
                  />
                </div>

                  <div>
                    <label className="block text-dark-text font-semibold mb-2 flex items-center space-x-2">
                      <Clock size={20} className="text-gold" />
                      <span>Preferred Time *</span>
                    </label>
                    <select
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gold transition-all"
                      required
                    >
                      <option value="">Select time slot</option>
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Meeting Type */}
              <div>
                <h3 className="text-xl font-bold text-dark-text mb-6 pb-3 border-b-2 border-gold">
                  Meeting Preference
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, meetingType: 'virtual' })}
                    className={`p-6 border-2 rounded-xl transition-all text-left ${
                      formData.meetingType === 'virtual'
                        ? 'border-gold bg-gold bg-opacity-5 shadow-lg'
                        : 'border-gray-300 hover:border-gold hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <Video size={40} className={formData.meetingType === 'virtual' ? 'text-gold' : 'text-gray-400'} />
                      <div>
                        <h4 className={`text-lg font-bold mb-2 ${formData.meetingType === 'virtual' ? 'text-gold' : 'text-dark-text'}`}>
                          Virtual Meeting
                        </h4>
                        <p className="text-sm text-gray-600">
                          Meet via video call
                        </p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, meetingType: 'in-person' })}
                    className={`p-6 border-2 rounded-xl transition-all text-left ${
                      formData.meetingType === 'in-person'
                        ? 'border-gold bg-gold bg-opacity-5 shadow-lg'
                        : 'border-gray-300 hover:border-gold hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <Home size={40} className={formData.meetingType === 'in-person' ? 'text-gold' : 'text-gray-400'} />
                      <div>
                        <h4 className={`text-lg font-bold mb-2 ${formData.meetingType === 'in-person' ? 'text-gold' : 'text-dark-text'}`}>
                          In-Person Visit
                        </h4>
                        <p className="text-sm text-gray-600">
                          Visit at your location
                        </p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, meetingType: 'phone_only' })}
                    className={`p-6 border-2 rounded-xl transition-all text-left ${
                      formData.meetingType === 'phone_only'
                        ? 'border-gold bg-gold bg-opacity-5 shadow-lg'
                        : 'border-gray-300 hover:border-gold hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <Phone size={40} className={formData.meetingType === 'phone_only' ? 'text-gold' : 'text-gray-400'} />
                      <div>
                        <h4 className={`text-lg font-bold mb-2 ${formData.meetingType === 'phone_only' ? 'text-gold' : 'text-dark-text'}`}>
                          Phone Only
                        </h4>
                        <p className="text-sm text-gray-600">
                          Quick phone consultation
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Project Details */}
                <div>
                  <label className="block text-dark-text font-semibold mb-2">
                  Tell Us About Your Project (Optional)
                  </label>
                  <textarea
                  value={formData.projectDetails}
                  onChange={(e) => setFormData({ ...formData, projectDetails: e.target.value })}
                  rows={4}
                  placeholder="e.g., Walk-in closet remodel, need more storage space, prefer modern style..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gold transition-all resize-none"
                  />
                </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-gold text-white px-8 py-5 rounded-full font-bold text-lg transition-all flex items-center justify-center space-x-3 shadow-lg ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90 hover:shadow-xl'
                  }`}
                >
                  <CheckCircle size={24} />
                  <span>{isSubmitting ? 'Submitting...' : 'Book My Free Consultation'}</span>
                </button>
                <p className="text-center text-sm text-gray-500 mt-4">
                  We'll contact you to confirm your appointment details
                </p>
              </div>
              </form>
            </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="section-padding bg-light-bg">
        <div className="container-custom mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-dark-text mb-4">
              Have Questions? Get In Touch
            </h2>
            <p className="text-lg text-gray-600">
              We're here to help you every step of the way
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <Phone className="text-gold mx-auto mb-3" size={32} />
              <h4 className="font-semibold text-dark-text mb-2">Phone</h4>
              <a href="tel:+15551234567" className="text-gray-600 hover:text-gold transition-all">
                        (555) 123-4567
                      </a>
                  </div>

            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <Mail className="text-gold mx-auto mb-3" size={32} />
              <h4 className="font-semibold text-dark-text mb-2">Email</h4>
              <a href="mailto:info@upclosetsofnova.com" className="text-gray-600 hover:text-gold transition-all break-all">
                        info@upclosetsofnova.com
                      </a>
                    </div>

            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <MapPin className="text-gold mx-auto mb-3" size={32} />
              <h4 className="font-semibold text-dark-text mb-2">Location</h4>
              <p className="text-gray-600 text-sm">
                123 Design Avenue<br />Northern Virginia, VA 22102
              </p>
                  </div>

            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <Clock className="text-gold mx-auto mb-3" size={32} />
              <h4 className="font-semibold text-dark-text mb-2">Hours</h4>
              <p className="text-gray-600 text-sm">
                Mon-Fri: 9AM-6PM<br />Sat: 10AM-4PM
                      </p>
                    </div>
                  </div>

          <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3105.542796612796!2d-77.18126968464798!3d38.94074597956891!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89b64ea4ca5b7b31%3A0x9d1b3c3f3d3f3d3f!2sNorthern%20Virginia!5e0!3m2!1sen!2sus!4v1234567890"
                  width="100%"
              height="400"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="Map"
                />
          </div>
        </div>
      </section>

      <section className="section-padding bg-light-bg text-center">
        <div className="container-custom mx-auto">
          <h2 className="text-3xl font-bold text-dark-text mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-6">
            Give us a call now or visit our showroom to see our work firsthand
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+15551234567"
              className="bg-gold text-white px-8 py-4 rounded-full font-semibold hover:bg-opacity-90 transition-all"
            >
              Call Now
            </a>
            <a
              href="mailto:info@upclosetsofnova.com"
              className="bg-dark-text text-white px-8 py-4 rounded-full font-semibold hover:bg-opacity-90 transition-all"
            >
              Email Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
