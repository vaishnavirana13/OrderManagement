const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pool = require('./db'); // Assuming you have a file db.js to manage your DB pool.
const moment = require('moment-timezone'); // Add moment-timezone for date handling

const app = express();
const port = 4000;

app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' })); // Adjust the frontend URL if needed

// Set the timezone for PostgreSQL session to IST (Asia/Kolkata)
pool.query('SET timezone = "Asia/Kolkata"'); // Ensure all timestamps are in IST for this session

// Test the server and database connection
app.get('/', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).send('Database is connected and server is running!');
  } catch (err) {
    res.status(500).json({ error: 'Database connection failed', details: err.message });
  }
});

// Get all Orders with linked products
app.get('/api/orders', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        o.Id AS orderId, 
        o.orderDescription, 
        o.createdAt, 
        p.Id AS productId, 
        p.productName, 
        p.productDescription, 
        opm.quantity
      FROM 
        ORDERS o
      LEFT JOIN 
        OrderProductMap opm ON o.Id = opm.orderId
      LEFT JOIN 
        PRODUCTS p ON opm.productId = p.Id
    `);

    // Format the createdAt timestamp to IST before sending response
    const formattedOrders = result.rows.map(order => {
      return {
        ...order,
        createdAt: moment(order.createdAt).tz("Asia/Kolkata").format('YYYY-MM-DD HH:mm:ss')
      };
    });

    res.status(200).json(formattedOrders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: 'Failed to fetch orders', details: err.message });
  }
});

// Get all Products
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.Id AS productId, 
        p.productName, 
        p.productDescription 
      FROM 
        PRODUCTS p
    `);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: 'Failed to fetch products', details: err.message });
  }
});

// Create a new Order and link it to a Product
app.post('/api/orders', async (req, res) => {
  const { orderDescription, createdAt, productId, quantity } = req.body;

  // Validate input
  if (!productId || quantity <= 0) {
    return res.status(400).json({ error: 'Invalid product ID or quantity.' });
  }

  try {
    // Step 1: Insert the order into the ORDERS table
    const orderResult = await pool.query(
      'INSERT INTO ORDERS (orderDescription, createdAt) VALUES ($1, $2) RETURNING Id',
      [orderDescription, createdAt]
    );
    const orderId = orderResult.rows[0].id;

    // Step 2: Link the order with the product in the OrderProductMap table
    await pool.query(
      'INSERT INTO OrderProductMap (orderId, productId, quantity) VALUES ($1, $2, $3)',
      [orderId, productId, quantity]
    );

    res.status(201).json({
      message: 'Order created and product linked successfully',
      orderId,
      orderDescription,
      productId,
      quantity,
    });
  } catch (err) {
    console.error('Error adding order:', err);
    res.status(500).json({ error: 'Error adding order', details: err.message });
  }
});

// Update an Order and modify only the product quantity (not description)
app.put('/api/orders/:id', async (req, res) => {
  const { id } = req.params;
  const { createdAt, productId, quantity } = req.body;

  // Validate input
  if (quantity <= 0 || !productId) {
    return res.status(400).json({ error: 'Invalid product ID or quantity.' });
  }

  try {
    // Step 1: Update the order (description remains unchanged, only date is updated)
    await pool.query(
      'UPDATE ORDERS SET createdAt = $1 WHERE Id = $2',
      [createdAt, id]
    );

    // Step 2: Update the product quantity in the OrderProductMap table
    const existingMapping = await pool.query(
      'SELECT * FROM OrderProductMap WHERE orderId = $1 AND productId = $2',
      [id, productId]
    );

    if (existingMapping.rows.length > 0) {
      // Update the existing product quantity
      await pool.query(
        'UPDATE OrderProductMap SET quantity = $1 WHERE orderId = $2 AND productId = $3',
        [quantity, id, productId]
      );
    } else {
      // Create a new mapping if none exists for this product
      await pool.query(
        'INSERT INTO OrderProductMap (orderId, productId, quantity) VALUES ($1, $2, $3)',
        [id, productId, quantity]
      );
    }

    res.status(200).json({ message: 'Order updated successfully' });
  } catch (err) {
    console.error("Error updating order:", err);
    res.status(500).json({ error: 'Error updating order', details: err.message });
  }
});

// Delete an Order
app.delete('/api/orders/:id', async (req, res) => {
  const { id } = req.params;

  // Validate if id is a valid integer
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ error: 'Invalid order ID.' });
  }

  try {
    // First delete the product mapping from OrderProductMap
    await pool.query('DELETE FROM OrderProductMap WHERE orderId = $1', [parseInt(id)]);

    // Then delete the order from the ORDERS table
    const result = await pool.query('DELETE FROM ORDERS WHERE Id = $1', [parseInt(id)]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    res.json({ message: 'Order deleted successfully.' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'An error occurred while deleting the order.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
