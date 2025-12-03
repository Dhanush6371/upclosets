   const express = require('express');
    const mongoose = require('mongoose');
    const bcrypt = require('bcryptjs');
    const jwt = require('jsonwebtoken');
    const cors = require('cors');
    const helmet = require('helmet');
   const path = require('path');
   // Load env from multiple common locations (first one found wins)
   const dotenv = require('dotenv');
   const envCandidates = [
       path.resolve(__dirname, '.env'),
       path.resolve(__dirname, '..', '.env'),
       path.resolve(__dirname, '..', 'env.txt')
   ];
   for (const p of envCandidates) {
       const result = dotenv.config({ path: p, override: false });
       if (!result.error) {
           console.log(`Loaded env from: ${p}`);
           break;
       }
   }
   const twilio = require('twilio');

    const User = require('./models/User');
const Order = require('./models/Order');
const Consultation = require('./models/Consultation');

// Test Order model import
console.log('Order model imported:', Order);
console.log('Order model name:', Order.modelName);

    const app = express();

    // Middleware
    app.use(helmet());
    app.use(cors());
    app.use(express.json());

   // Twilio Initialization
   // Development-only hardcoded fallback values (NOT for production)
  

   const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || FALLBACK_TWILIO_ACCOUNT_SID;
   const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || FALLBACK_TWILIO_AUTH_TOKEN;
   const TWILIO_FROM_NUMBER = process.env.TWILIO_FROM_NUMBER || FALLBACK_TWILIO_FROM_NUMBER; // E.164 format, e.g. +12025550123
   const TWILIO_MESSAGING_SERVICE_SID = process.env.TWILIO_MESSAGING_SERVICE_SID || FALLBACK_TWILIO_MESSAGING_SERVICE_SID; // optional for better global deliverability

   console.log('Twilio env present -', {
       SID: Boolean(TWILIO_ACCOUNT_SID),
       AUTH: Boolean(TWILIO_AUTH_TOKEN),
       FROM: Boolean(TWILIO_FROM_NUMBER),
       MSG_SVC: Boolean(TWILIO_MESSAGING_SERVICE_SID)
   });

   let twilioClient = null;
   if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
       twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
   } else {
       console.warn('⚠️  Twilio credentials are not set. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN to enable SMS.');
   }

    // MongoDB Connection
    const MONGODB_URI = process.env.MONGODB_URI;

    mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    })
    .then(() => {
        console.log('✅ Connected to MongoDB');
        console.log('Database:', MONGODB_URI);
        
        // Test database operations
        console.log('Testing database operations...');
        Order.countDocuments()
            .then(count => console.log('✅ Order count:', count))
            .catch(err => console.error('❌ Error counting orders:', err));
            
        Consultation.countDocuments()
            .then(count => console.log('✅ Consultation count:', count))
            .catch(err => console.error('❌ Error counting consultations:', err));
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        console.error('Connection string:', MONGODB_URI);
    });

    // JWT Secret
    const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

    // Generate JWT Token
    const signToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
    };

    // Send token response
    const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    
    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
        user
        }
    });
    };

    // Auth middleware
    const protect = async (req, res, next) => {
    try {
        let token;
        
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
        return res.status(401).json({
            status: 'fail',
            message: 'You are not logged in. Please log in to get access.'
        });
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Check if user still exists
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
        return res.status(401).json({
            status: 'fail',
            message: 'The user belonging to this token no longer exists.'
        });
        }

        req.user = currentUser;
        next();
    } catch (error) {
        return res.status(401).json({
        status: 'fail',
        message: 'Invalid token. Please log in again.'
        });
    }
    };

    // Admin-only middleware
    const restrictToAdmin = (req, res, next) => {
        if (req.user.department !== 'overall') {
        return res.status(403).json({
            status: 'fail',
            message: 'Access denied. Admin privileges required.'
        });
        }
        next();
    };

    // Routes

    // Register route
    app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, department } = req.body;

        // Validation
        if (!email || !password || !department) {
        return res.status(400).json({
            status: 'fail',
            message: 'Please provide email, password, and department'
        });
        }

        if (password.length < 6) {
        return res.status(400).json({
            status: 'fail',
            message: 'Password must be at least 6 characters'
        });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
        return res.status(400).json({
            status: 'fail',
            message: 'User already exists with this email'
        });
        }

        // Create new user
        const newUser = await User.create({
        email: email.toLowerCase(),
        password,
        department
        });

        createSendToken(newUser, 201, res);
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
        status: 'error',
        message: 'Internal server error during registration'
        });
    }
    });

    // Login route
    app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password, department } = req.body;

        // Validation
        if (!email || !password || !department) {
        return res.status(400).json({
            status: 'fail',
            message: 'Please provide email, password, and department'
        });
        }

        // Check if user exists and password is correct
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
        
        if (!user || !(await user.correctPassword(password, user.password))) {
        return res.status(401).json({
            status: 'fail',
            message: 'Incorrect email or password'
        });
        }

        // Check department match
        if (user.department !== department) {
        return res.status(401).json({
            status: 'fail',
            message: 'Department mismatch'
        });
        }

        createSendToken(user, 200, res);
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
        status: 'error',
        message: 'Internal server error during login'
        });
    }
    });

    // Get current user route
    app.get('/api/auth/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        res.status(200).json({
        status: 'success',
        data: {
            user
        }
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
        status: 'error',
        message: 'Internal server error'
        });
    }
    });

    // Logout route (client-side token removal)
    app.post('/api/auth/logout', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Logged out successfully'
    });
    });

    // Order Management Routes

    // Database cleanup route (for development only)
    app.post('/api/admin/reset-database', protect, restrictToAdmin, async (req, res) => {
    try {
        console.log('Resetting database...');
        
        // Drop orders collection
        await mongoose.connection.db.collection('orders').drop();
        console.log('✅ Dropped orders collection');
        
        // Drop users collection  
        await mongoose.connection.db.collection('users').drop();
        console.log('✅ Dropped users collection');
        
        res.status(200).json({
        status: 'success',
        message: 'Database reset successfully'
        });
    } catch (error) {
        if (error.code === 26) {
        res.status(200).json({
            status: 'success',
            message: 'Collections already dropped or never existed'
        });
        } else {
        console.error('Database reset error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to reset database',
            error: error.message
        });
        }
    }
    });

    // Test route to verify Order model
    app.get('/api/orders/test', protect, async (req, res) => {
    try {
        console.log('Testing Order model...');
        const count = await Order.countDocuments();
        console.log('Order count:', count);
        
        // Try to create a test order
        console.log('Testing order creation...');
        const testOrder = await Order.create({
            orderId: 'TEST-001',
            customerName: 'Test Customer',
            department: 'overall',
            createdBy: req.user._id
        });
        console.log('Test order created:', testOrder);
        
        // Delete the test order
        await Order.findByIdAndDelete(testOrder._id);
        console.log('Test order deleted');
        
        res.status(200).json({
        status: 'success',
        message: 'Order model is working',
        count
        });
    } catch (error) {
        console.error('Order model test error:', error);
        res.status(500).json({
        status: 'error',
        message: 'Order model test failed',
        error: error.message
        });
    }
    });

    // Get next order ID
    app.get('/api/orders/next-id', protect, restrictToAdmin, async (req, res) => {
    try {
        const count = await Order.countDocuments();
        const nextOrderId = `ORD-${String(count + 1).padStart(3, '0')}`;
        
        res.status(200).json({
        status: 'success',
        data: {
            nextOrderId
        }
        });
    } catch (error) {
        console.error('Get next order ID error:', error);
        res.status(500).json({
        status: 'error',
        message: 'Internal server error'
        });
    }
    });

    // Create new order (Admin only)
    app.post('/api/orders', protect, restrictToAdmin, async (req, res) => {
    try {
        console.log('Creating order with data:', req.body);
        console.log('User creating order:', req.user);
        
        const { customerName } = req.body;

        if (!customerName || customerName.trim() === '') {
        return res.status(400).json({
            status: 'fail',
            message: 'Customer name is required'
        });
        }

        console.log('About to create order in database...');
        
        // Generate order ID manually
        let count;
        try {
            count = await Order.countDocuments();
            console.log('Current order count:', count);
        } catch (countError) {
            console.error('Error getting order count:', countError);
            count = 0; // Fallback to 0 if count fails
        }
        
        const orderId = `ORD-${String(count + 1).padStart(3, '0')}`;
        console.log('Generated orderId:', orderId);
        
        console.log('Creating order with data:', {
            orderId,
            customerName: customerName.trim(),
            department: 'overall',
            createdBy: req.user._id
        });
        
        const newOrder = await Order.create({
        orderId: orderId,
        customerName: customerName.trim(),
        department: 'overall', // All orders are created by admin/overall department
        createdBy: req.user._id
        });

        console.log('Order created successfully:', newOrder);

        // Populate the createdBy field
        await newOrder.populate('createdBy', 'email');

        console.log('Order populated successfully:', newOrder);

        res.status(201).json({
        status: 'success',
        data: {
            order: newOrder
        }
        });
    } catch (error) {
        console.error('Create order error:', error);
        console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
        });
        res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
    });

    // Get all orders
    app.get('/api/orders', protect, async (req, res) => {
    try {
        const orders = await Order.find()
        .populate('createdBy', 'email')
        .sort({ createdAt: -1 });

        res.status(200).json({
        status: 'success',
        results: orders.length,
        data: {
            orders
        }
        });
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({
        status: 'error',
        message: 'Internal server error'
        });
    }
    });

    // Get single order
    app.get('/api/orders/:id', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
        .populate('createdBy', 'email');

        if (!order) {
        return res.status(404).json({
            status: 'fail',
            message: 'Order not found'
        });
        }

        res.status(200).json({
        status: 'success',
        data: {
            order
        }
        });
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({
        status: 'error',
        message: 'Internal server error'
        });
    }
    });

    // Update order design status
    app.patch('/api/orders/:id/design', protect, async (req, res) => {
    try {
        const { completed } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
        return res.status(404).json({
            status: 'fail',
            message: 'Order not found'
        });
        }

        // Check if user has permission to update design
        if (req.user.department !== 'design' && req.user.department !== 'overall') {
        return res.status(403).json({
            status: 'fail',
            message: 'Access denied. Design team privileges required.'
        });
        }

        const previousCompleted = order.designCompleted;
        order.designCompleted = completed;
        
        // If design is completed and wasn't previously completed, set completion date
        if (completed && !previousCompleted && !order.designCompletedAt) {
            order.designCompletedAt = new Date();
            console.log(`Design completed for order ${order.orderId} at ${order.designCompletedAt}`);
        }
        
        // Recalculate expected dates to adjust timelines based on actual design completion
        order.recalculateExpectedDates();
        
        await order.save();

        res.status(200).json({
        status: 'success',
        data: {
            order
        }
        });
    } catch (error) {
        console.error('Update design error:', error);
        res.status(500).json({
        status: 'error',
        message: 'Internal server error'
        });
    }
    });

    // Update order production status
    app.patch('/api/orders/:id/production', protect, async (req, res) => {
    try {
        const { percentage } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
        return res.status(404).json({
            status: 'fail',
            message: 'Order not found'
        });
        }

        // Check if user has permission to update production
        if (req.user.department !== 'production' && req.user.department !== 'overall') {
        return res.status(403).json({
            status: 'fail',
            message: 'Access denied. Production team privileges required.'
        });
        }

        const previousPercentage = order.productionPercentage;
        order.productionPercentage = Math.max(0, Math.min(100, percentage));
        
        // If production reaches 100% and wasn't previously completed, set completion date
        if (order.productionPercentage === 100 && previousPercentage < 100 && !order.productionCompletedAt) {
            order.productionCompletedAt = new Date();
            console.log(`Production completed for order ${order.orderId} at ${order.productionCompletedAt}`);
        }
        
        // Recalculate expected dates to adjust timelines based on actual production completion
        order.recalculateExpectedDates();
        
        await order.save();

        res.status(200).json({
        status: 'success',
        data: {
            order
        }
        });
    } catch (error) {
        console.error('Update production error:', error);
        res.status(500).json({
        status: 'error',
        message: 'Internal server error'
        });
    }
    });

    // Update order finishing status
    app.patch('/api/orders/:id/finishing', protect, async (req, res) => {
    try {
        const { completed } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
        return res.status(404).json({
            status: 'fail',
            message: 'Order not found'
        });
        }

        // Check if user has permission to update finishing
        if (req.user.department !== 'finishing' && req.user.department !== 'overall') {
        return res.status(403).json({
            status: 'fail',
            message: 'Access denied. Finishing team privileges required.'
        });
        }

        const previousCompleted = order.finishingCompleted;
        order.finishingCompleted = completed;
        
        // If finishing is completed and wasn't previously completed, set completion date
        if (completed && !previousCompleted && !order.finishingCompletedAt) {
            order.finishingCompletedAt = new Date();
            console.log(`Finishing completed for order ${order.orderId} at ${order.finishingCompletedAt}`);
        }
        
        // Recalculate expected dates to adjust timelines based on actual finishing completion
        order.recalculateExpectedDates();
        
        await order.save();

        res.status(200).json({
        status: 'success',
        data: {
            order
        }
        });
    } catch (error) {
        console.error('Update finishing error:', error);
        res.status(500).json({
        status: 'error',
        message: 'Internal server error'
        });
    }
    });

    // Update order dispatch status
    app.patch('/api/orders/:id/dispatch', protect, async (req, res) => {
    try {
        const { completed } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
        return res.status(404).json({
            status: 'fail',
            message: 'Order not found'
        });
        }

        // Check if user has permission to update dispatch
        if (req.user.department !== 'dispatch' && req.user.department !== 'overall') {
        return res.status(403).json({
            status: 'fail',
            message: 'Access denied. Dispatch team privileges required.'
        });
        }

        const previousCompleted = order.dispatchCompleted;
        order.dispatchCompleted = completed;
        
        // If dispatch is completed and wasn't previously completed, set completion date
        if (completed && !previousCompleted && !order.dispatchCompletedAt) {
            order.dispatchCompletedAt = new Date();
            console.log(`Dispatch completed for order ${order.orderId} at ${order.dispatchCompletedAt}`);
        }
        
        // Recalculate expected dates to adjust timelines based on actual dispatch completion
        order.recalculateExpectedDates();
        
        await order.save();

        res.status(200).json({
        status: 'success',
        data: {
            order
        }
        });
    } catch (error) {
        console.error('Update dispatch error:', error);
        res.status(500).json({
        status: 'error',
        message: 'Internal server error'
        });
    }
    });

    // Move order to next department
    app.patch('/api/orders/:id/move-to-next', protect, async (req, res) => {
    try {
        const { message } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
        return res.status(404).json({
            status: 'fail',
            message: 'Order not found'
        });
        }

        // Check if user has permission to move order
        if (req.user.department !== order.currentDepartment && req.user.department !== 'overall') {
        return res.status(403).json({
            status: 'fail',
            message: 'Access denied. You can only move orders from your current department.'
        });
        }

        // Validate message if provided
        if (message && typeof message !== 'string') {
        return res.status(400).json({
            status: 'fail',
            message: 'Message must be a string'
        });
        }

        // Define department flow
        const departmentFlow = {
            'admin': 'design',
            'design': 'production', 
            'production': 'finishing',
            'finishing': 'dispatch',
            'dispatch': 'dispatched'
        };

        const nextDepartment = departmentFlow[order.currentDepartment];
        
        if (!nextDepartment) {
        return res.status(400).json({
            status: 'fail',
            message: 'Order has already reached the final stage'
        });
        }

        // Store current department for message
        const fromDepartment = order.currentDepartment;
        
        // Update order based on current department
        switch (order.currentDepartment) {
        case 'admin':
            order.progressStage = 'in_design';
            order.currentDepartment = 'design';
            break;
        case 'design':
            if (!order.designCompleted) {
            return res.status(400).json({
                status: 'fail',
                message: 'Design must be completed before moving to production'
            });
            }
            order.progressStage = 'in_production';
            order.currentDepartment = 'production';
            break;
        case 'production':
            if (order.productionPercentage !== 100) {
            return res.status(400).json({
                status: 'fail',
                message: 'Production must be 100% complete before moving to finishing'
            });
            }
            order.progressStage = 'in_finishing';
            order.currentDepartment = 'finishing';
            break;
        case 'finishing':
            if (!order.finishingCompleted) {
            return res.status(400).json({
                status: 'fail',
                message: 'Finishing must be completed before moving to dispatch'
            });
            }
            order.progressStage = 'in_dispatch';
            order.currentDepartment = 'dispatch';
            break;
        case 'dispatch':
            if (!order.dispatchCompleted) {
            return res.status(400).json({
                status: 'fail',
                message: 'Dispatch must be completed before marking as dispatched'
            });
            }
            order.progressStage = 'dispatched';
            order.currentDepartment = 'dispatched';
            break;
        }

        // Add message to departmentMessages array if provided
        if (message && message.trim()) {
            order.departmentMessages.push({
                fromDepartment: fromDepartment,
                toDepartment: order.currentDepartment,
                message: message.trim(),
                sentBy: req.user._id
            });
        }

        await order.save();

        res.status(200).json({
        status: 'success',
        data: {
            order
        }
        });
    } catch (error) {
        console.error('Move to next department error:', error);
        res.status(500).json({
        status: 'error',
        message: 'Internal server error'
        });
    }
    });

    // Delete order (Admin only)
    app.delete('/api/orders/:id', protect, restrictToAdmin, async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);

        if (!order) {
        return res.status(404).json({
            status: 'fail',
            message: 'Order not found'
        });
        }

        res.status(204).json({
        status: 'success',
        message: 'Order deleted successfully'
        });
    } catch (error) {
        console.error('Delete order error:', error);
        res.status(500).json({
        status: 'error',
        message: 'Internal server error'
        });
    }
    });

    // Recalculate expected dates for all orders
    app.patch('/api/orders/recalculate-expected-dates', protect, restrictToAdmin, async (req, res) => {
    try {
        const orders = await Order.find();
        
        for (const order of orders) {
        order.recalculateExpectedDates();
        await order.save();
        }
        
        res.status(200).json({
        status: 'success',
        message: `Expected dates recalculated for ${orders.length} orders`,
        data: {
            updatedOrders: orders.length
        }
        });
    } catch (error) {
        console.error('Recalculate expected dates error:', error);
        res.status(500).json({
        status: 'error',
        message: 'Internal server error'
        });
    }
    });

    // Public order tracking endpoint (no authentication required)
    app.get('/api/track/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        
        const order = await Order.findOne({ orderId })
        .populate('createdBy', 'email')
        .select('-createdBy.password'); // Exclude password from populated user

        if (!order) {
        return res.status(404).json({
            status: 'fail',
            message: 'Order not found. Please check your order ID.'
        });
        }

        // Recalculate expected dates if they don't exist or are incorrect
        if (!order.expectedDates || !order.expectedDates.design) {
        order.recalculateExpectedDates();
        await order.save();
        }

        // Return only public information
        const publicOrderInfo = {
        orderId: order.orderId,
        customerName: order.customerName,
        progressStage: order.progressStage,
        currentDepartment: order.currentDepartment,
        designCompleted: order.designCompleted,
        productionPercentage: order.productionPercentage,
        finishingCompleted: order.finishingCompleted,
        dispatchCompleted: order.dispatchCompleted,
        expectedDates: order.expectedDates,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
        };

        res.status(200).json({
        status: 'success',
        data: {
            order: publicOrderInfo
        }
        });
    } catch (error) {
        console.error('Track order error:', error);
        res.status(500).json({
        status: 'error',
        message: 'Internal server error'
        });
    }
    });

    // Consultation Management Routes

    // Public route to create consultation (no authentication required)
    app.post('/api/consultations', async (req, res) => {
        try {
            console.log('Creating consultation with data:', req.body);
            
            const { 
                phone, 
                name, 
                address, 
                zip_code, 
                closet_type, 
                number_of_spaces, 
                consultation_type, 
                preferred_date, 
                preferred_time 
            } = req.body;

            // Validation
            if (!phone || !name || !address || !zip_code || !closet_type || 
                !number_of_spaces || !consultation_type || !preferred_date || !preferred_time) {
                return res.status(400).json({
                    status: 'fail',
                    message: 'All required fields must be provided'
                });
            }

            // Validate consultation_type
            if (!['phone_only', 'in_person', 'virtual'].includes(consultation_type)) {
                return res.status(400).json({
                    status: 'fail',
                    message: 'Invalid consultation type. Must be phone_only, in_person, or virtual'
                });
            }

            // Create new consultation
            const newConsultation = await Consultation.create({
                phone,
                name,
                address,
                zip_code,
                closet_type,
                number_of_spaces: parseInt(number_of_spaces),
                consultation_type,
                preferred_date,
                preferred_time,
                status: 'pending',
                confirmation_status: 'pending',
                phone_source: 'provided_by_customer'
            });

            console.log('Consultation created successfully:', newConsultation);

            res.status(201).json({
                status: 'success',
                message: 'Consultation request submitted successfully',
                data: {
                    consultation: newConsultation
                }
            });
        } catch (error) {
            console.error('Create consultation error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to submit consultation request',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    });

    // Admin-only consultation routes
    
    // Test consultation database connection (Admin only)
    app.get('/api/consultations/test-connection', protect, restrictToAdmin, async (req, res) => {
        try {
            console.log('Testing consultation database connection...');
            
            // Test consultation model operations
            const count = await Consultation.countDocuments();
            console.log('Consultation count:', count);
            
            // Get a sample document
            const sampleDoc = await Consultation.findOne({});
            console.log('Sample document:', sampleDoc);
            
            res.status(200).json({
                status: 'success',
                message: 'Consultation database connection successful',
                data: {
                    consultationCount: count,
                    sampleDocument: sampleDoc
                }
            });
        } catch (error) {
            console.error('Test consultation connection error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Failed to test consultation connection',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    });

    // Admin-only: Send SMS manually via Twilio
    // Expects body: { to: "+<country><number>", message?: string }
    // Country code must be included manually in the `to` number (E.164 format)
    app.post('/api/admin/send-sms', protect, restrictToAdmin, async (req, res) => {
        try {
            if (!twilioClient) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Twilio is not configured on the server'
                });
            }

            const { to, message } = req.body;

            if (!to || typeof to !== 'string') {
                return res.status(400).json({
                    status: 'fail',
                    message: 'Field `to` is required and must be a string'
                });
            }

            // Enforce manual country code entry
            if (!to.startsWith('+')) {
                return res.status(400).json({
                    status: 'fail',
                    message: 'Include country code manually. Use E.164 format like +911234567890'
                });
            }

            if (!TWILIO_MESSAGING_SERVICE_SID && (!TWILIO_FROM_NUMBER || !TWILIO_FROM_NUMBER.startsWith('+'))) {
                return res.status(500).json({
                    status: 'error',
                    message: 'Server missing TWILIO_MESSAGING_SERVICE_SID or TWILIO_FROM_NUMBER in E.164 format'
                });
            }

            const smsBody = message && typeof message === 'string' && message.trim().length > 0
                ? message.trim()
                : 'Thank you for calling us. Visit https://www.afterlife.org.in';

            const createParams = {
                to: to.trim(),
                body: smsBody
            };
            if (TWILIO_MESSAGING_SERVICE_SID) {
                createParams.messagingServiceSid = TWILIO_MESSAGING_SERVICE_SID;
            } else {
                createParams.from = TWILIO_FROM_NUMBER;
            }

            const result = await twilioClient.messages.create(createParams);

            return res.status(200).json({
                status: 'success',
                data: {
                    sid: result.sid,
                    to: result.to,
                    status: result.status
                }
            });
        } catch (error) {
            console.error('Send SMS error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Failed to send SMS',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    });

    // Get all consultations
    app.get('/api/consultations', protect, restrictToAdmin, async (req, res) => {
        try {
            console.log('Fetching consultations...');
            
            const consultations = await Consultation.find({}).sort({ createdAt: -1 });
            console.log('Found consultations:', consultations.length);
            
            res.status(200).json({
                status: 'success',
                results: consultations.length,
                data: {
                    consultations
                }
            });
        } catch (error) {
            console.error('Get consultations error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    });

    // Get single consultation
    app.get('/api/consultations/:id', protect, restrictToAdmin, async (req, res) => {
        try {
            const consultation = await Consultation.findById(req.params.id);

            if (!consultation) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'Consultation not found'
                });
            }

            res.status(200).json({
                status: 'success',
                data: {
                    consultation
                }
            });
        } catch (error) {
            console.error('Get consultation error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    });

    // Update consultation status
    app.patch('/api/consultations/:id/status', protect, restrictToAdmin, async (req, res) => {
        try {
            const { status, notes } = req.body;
            
            if (!status || !['pending', 'scheduled', 'completed', 'cancelled'].includes(status)) {
                return res.status(400).json({
                    status: 'fail',
                    message: 'Valid status is required (pending, scheduled, completed, cancelled)'
                });
            }

            const updateData = { status };
            if (notes !== undefined) {
                updateData.notes = notes;
            }

            const consultation = await Consultation.findByIdAndUpdate(
                req.params.id,
                updateData,
                { new: true, runValidators: true }
            );

            if (!consultation) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'Consultation not found'
                });
            }

            res.status(200).json({
                status: 'success',
                data: {
                    consultation
                }
            });
        } catch (error) {
            console.error('Update consultation status error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    });

    // Update consultation confirmation status
    app.patch('/api/consultations/:id/confirmation', protect, restrictToAdmin, async (req, res) => {
        try {
            const { confirmation_status } = req.body;
            
            if (!confirmation_status || !['pending', 'confirmed', 'cancelled'].includes(confirmation_status)) {
                return res.status(400).json({
                    status: 'fail',
                    message: 'Valid confirmation status is required (pending, confirmed, cancelled)'
                });
            }

            const consultation = await Consultation.findByIdAndUpdate(
                req.params.id,
                { confirmation_status },
                { new: true, runValidators: true }
            );

            if (!consultation) {
                return res.status(404).json({
                    status: 'fail',
                    message: 'Consultation not found'
                });
            }

            res.status(200).json({
                status: 'success',
                data: {
                    consultation
                }
            });
        } catch (error) {
            console.error('Update consultation confirmation error:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    });

    // Dashboard Statistics Routes (Admin only)
    app.get('/api/dashboard/statistics', protect, restrictToAdmin, async (req, res) => {
    try {
        // Get total orders count
        const totalOrders = await Order.countDocuments();
        
        // Get consultations count from main database
        let totalConsultations = 0;
        let consultationsByStatus = [];
        let consultationsByType = [];
        let recentConsultations = 0;
        let weeklyConsultations = 0;
        let todayConsultations = 0;
        
        try {
            totalConsultations = await Consultation.countDocuments();
            
            // Get consultations by status
            consultationsByStatus = await Consultation.aggregate([
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 }
                    }
                }
            ]);
            
            // Get consultations by type
            consultationsByType = await Consultation.aggregate([
                {
                    $group: {
                        _id: '$consultation_type',
                        count: { $sum: 1 }
                    }
                }
            ]);
            
            // Get consultations created in last 30 days
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            
            recentConsultations = await Consultation.countDocuments({
                createdAt: { $gte: thirtyDaysAgo }
            });
            
            // Get consultations created in last 7 days
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            
            weeklyConsultations = await Consultation.countDocuments({
                createdAt: { $gte: sevenDaysAgo }
            });
            
            // Get consultations created today
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            todayConsultations = await Consultation.countDocuments({
                createdAt: { 
                    $gte: today, 
                    $lt: tomorrow 
                }
            });
        } catch (consultationError) {
            console.error('Error fetching consultation statistics:', consultationError);
            // Continue with orders statistics even if consultations fail
        }
        
        // Get orders by status
        const ordersByStatus = await Order.aggregate([
            {
                $group: {
                    _id: '$progressStage',
                    count: { $sum: 1 }
                }
            }
        ]);
        
        // Get orders by department
        const ordersByDepartment = await Order.aggregate([
            {
                $group: {
                    _id: '$currentDepartment',
                    count: { $sum: 1 }
                }
            }
        ]);
        
        // Get orders created in last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const recentOrders = await Order.countDocuments({
            createdAt: { $gte: thirtyDaysAgo }
        });
        
        // Get orders created in last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const weeklyOrders = await Order.countDocuments({
            createdAt: { $gte: sevenDaysAgo }
        });
        
        // Get orders created today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const todayOrders = await Order.countDocuments({
            createdAt: { $gte: today, $lt: tomorrow }
        });
        
        // Get average completion time (in days)
        const completedOrders = await Order.find({
            progressStage: 'dispatched'
        }).select('createdAt updatedAt');
        
        let avgCompletionTime = 0;
        if (completedOrders.length > 0) {
            const totalTime = completedOrders.reduce((sum, order) => {
                const timeDiff = order.updatedAt - order.createdAt;
                return sum + (timeDiff / (1000 * 60 * 60 * 24)); // Convert to days
            }, 0);
            avgCompletionTime = totalTime / completedOrders.length;
        }
        
        // Get orders by month for the last 6 months
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        
        const ordersByMonth = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1 }
            }
        ]);
        
        // Get production efficiency (average production percentage)
        const productionStats = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    avgProduction: { $avg: '$productionPercentage' },
                    totalOrders: { $sum: 1 }
                }
            }
        ]);
        
        res.status(200).json({
            status: 'success',
            data: {
                overview: {
                    totalOrders,
                    recentOrders,
                    weeklyOrders,
                    todayOrders,
                    avgCompletionTime: Math.round(avgCompletionTime * 10) / 10,
                    totalConsultations,
                    recentConsultations,
                    weeklyConsultations,
                    todayConsultations
                },
                ordersByStatus,
                ordersByDepartment,
                ordersByMonth,
                productionStats: productionStats[0] || { avgProduction: 0, totalOrders: 0 },
                consultationsByStatus,
                consultationsByType
            }
        });
    } catch (error) {
        console.error('Dashboard statistics error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
    });

    // Health check
    app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
    });

    // Handle undefined routes
    app.all('*', (req, res) => {
    res.status(404).json({
        status: 'fail',
        message: `Route ${req.originalUrl} not found`
    });
    });

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    });