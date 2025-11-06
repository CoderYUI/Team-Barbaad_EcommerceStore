import express from 'express';
import Order from '../models/Order.js';

const router = express.Router();

// Track orders by phone - Must be BEFORE the :id route
router.get('/search', async (req, res) => {
  try {
    const { phone } = req.query;
    
    console.log('Searching for orders with phone:', phone);
    
    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    const orders = await Order.find({
      'orderDetails.phone': phone
    }).sort({ date: -1 });

    console.log('Found orders:', orders);

    if (!orders || orders.length === 0) {
      return res.status(404).json({ 
        message: 'No orders found with this phone number' 
      });
    }

    res.json(orders);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create order
router.post('/', async (req, res) => {
  try {
    const order = new Order(req.body);
    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get order by ID - Must be AFTER other specific routes
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
