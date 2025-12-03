const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true
  },
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true
  },
  progressStage: {
    type: String,
    enum: ['pending', 'in_design', 'in_production', 'in_finishing', 'in_dispatch', 'dispatched'],
    default: 'pending'
  },
  currentDepartment: {
    type: String,
    enum: ['admin', 'design', 'production', 'finishing', 'dispatch', 'dispatched'],
    default: 'admin'
  },
  designCompleted: {
    type: Boolean,
    default: false
  },
  designCompletedAt: {
    type: Date,
    default: null
  },
  productionPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  productionCompletedAt: {
    type: Date,
    default: null
  },
  finishingCompleted: {
    type: Boolean,
    default: false
  },
  finishingCompletedAt: {
    type: Date,
    default: null
  },
  dispatchCompleted: {
    type: Boolean,
    default: false
  },
  dispatchCompletedAt: {
    type: Date,
    default: null
  },
  // Expected completion dates for each department
  expectedDates: {
    design: {
      type: Date,
      default: function() {
        // Design: 3 days from order creation
        return new Date(Date.now() + (3 * 24 * 60 * 60 * 1000));
      }
    },
    production: {
      type: Date,
      default: function() {
        // Production: 3 days (design) + 5 weeks from order creation
        return new Date(Date.now() + (3 * 24 * 60 * 60 * 1000) + (5 * 7 * 24 * 60 * 60 * 1000));
      }
    },
    finishing: {
      type: Date,
      default: function() {
        // Finishing: 3 days (design) + 5 weeks (production) + 4 days from order creation
        return new Date(Date.now() + (3 * 24 * 60 * 60 * 1000) + (5 * 7 * 24 * 60 * 60 * 1000) + (4 * 24 * 60 * 60 * 1000));
      }
    },
    dispatch: {
      type: Date,
      default: function() {
        // Dispatch: 3 days (design) + 5 weeks (production) + 4 days (finishing) + 3 days from order creation
        return new Date(Date.now() + (3 * 24 * 60 * 60 * 1000) + (5 * 7 * 24 * 60 * 60 * 1000) + (4 * 24 * 60 * 60 * 1000) + (3 * 24 * 60 * 60 * 1000));
      }
    }
  },
  department: {
    type: String,
    default: 'overall'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  departmentMessages: [{
    fromDepartment: {
      type: String,
      enum: ['admin', 'design', 'production', 'finishing', 'dispatch'],
      required: true
    },
    toDepartment: {
      type: String,
      enum: ['design', 'production', 'finishing', 'dispatch', 'dispatched'],
      required: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    sentAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Method to recalculate expected dates based on actual completion times for all departments
orderSchema.methods.recalculateExpectedDates = function() {
  const orderDate = this.createdAt || new Date();
  
  // Calculate design completion date
  let designDate;
  if (this.designCompletedAt) {
    // Use actual completion date
    designDate = this.designCompletedAt;
  } else if (this.designCompleted) {
    // If completed but no timestamp, use current time
    designDate = new Date();
  } else {
    // Calculate expected date (3 days from order creation)
    designDate = new Date(orderDate.getTime() + (3 * 24 * 60 * 60 * 1000));
  }
  
  // Calculate production completion date
  let productionDate;
  if (this.productionCompletedAt) {
    // Use actual completion date
    productionDate = this.productionCompletedAt;
  } else if (this.productionPercentage === 100) {
    // If 100% but no timestamp, use current time
    productionDate = new Date();
  } else {
    // Calculate expected date based on design completion
    productionDate = new Date(designDate.getTime() + (5 * 7 * 24 * 60 * 60 * 1000)); // 5 weeks after design
  }
  
  // Calculate finishing completion date
  let finishingDate;
  if (this.finishingCompletedAt) {
    // Use actual completion date
    finishingDate = this.finishingCompletedAt;
  } else if (this.finishingCompleted) {
    // If completed but no timestamp, use current time
    finishingDate = new Date();
  } else {
    // Calculate expected date based on production completion
    finishingDate = new Date(productionDate.getTime() + (4 * 24 * 60 * 60 * 1000)); // 4 days after production
  }
  
  // Calculate dispatch completion date
  let dispatchDate;
  if (this.dispatchCompletedAt) {
    // Use actual completion date
    dispatchDate = this.dispatchCompletedAt;
  } else if (this.dispatchCompleted) {
    // If completed but no timestamp, use current time
    dispatchDate = new Date();
  } else {
    // Calculate expected date based on finishing completion
    dispatchDate = new Date(finishingDate.getTime() + (3 * 24 * 60 * 60 * 1000)); // 3 days after finishing
  }
  
  this.expectedDates = {
    design: designDate,
    production: productionDate,
    finishing: finishingDate,
    dispatch: dispatchDate
  };
  
  return this;
};

// Auto-increment order ID middleware
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    console.log('Pre-save middleware triggered for new order');
    console.log('Current orderId:', this.orderId);
    try {
      if (!this.orderId) {
        console.log('Generating new order ID...');
        const Order = this.constructor;
        const count = await Order.countDocuments();
        this.orderId = `ORD-${String(count + 1).padStart(3, '0')}`;
        console.log('Generated orderId:', this.orderId);
      }
    } catch (error) {
      console.error('Error generating order ID:', error);
      // Fallback to timestamp-based ID
      this.orderId = `ORD-${Date.now()}`;
      console.log('Fallback orderId:', this.orderId);
    }
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);