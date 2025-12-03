const mongoose = require('mongoose');

const consultationSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  zip_code: {
    type: String,
    required: [true, 'Zip code is required'],
    trim: true
  },
  closet_type: {
    type: String,
    required: [true, 'Closet type is required'],
    trim: true
  },
  number_of_spaces: {
    type: Number,
    required: [true, 'Number of spaces is required'],
    min: 1
  },
  consultation_type: {
    type: String,
    enum: ['phone_only', 'in_person', 'virtual'],
    required: [true, 'Consultation type is required']
  },
  preferred_date: {
    type: String,
    required: [true, 'Preferred date is required']
  },
  preferred_time: {
    type: String,
    required: [true, 'Preferred time is required']
  },
  status: {
    type: String,
    enum: ['pending', 'scheduled', 'completed', 'cancelled'],
    default: 'pending'
  },
  confirmation_status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  phone_source: {
    type: String,
    enum: ['provided_by_customer', 'lead_generation', 'referral'],
    default: 'provided_by_customer'
  },
  notes: {
    type: String,
    trim: true,
    default: ''
  },
  assigned_to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  created_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
consultationSchema.index({ phone: 1 });
consultationSchema.index({ status: 1 });
consultationSchema.index({ confirmation_status: 1 });
consultationSchema.index({ created_at: -1 });

module.exports = mongoose.model('Consultation', consultationSchema);
