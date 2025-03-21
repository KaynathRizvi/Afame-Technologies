require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
app.use(cors());
app.use(express.json());

//LocalHost Database Connection
/*const sequelize = new Sequelize(
  'sql12764660', 
  'root', 
  '', 
  {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);
*/

// Main Database Connect(Hosting)
const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PASS, 
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const Product = require('./models/Product')(sequelize);
const User = require('./models/User')(sequelize);
const Favorites = require('./models/Favorites')(sequelize, DataTypes);
const Cart = require('./models/Cart')(sequelize, DataTypes);


//Testing DB Connection
sequelize.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.error('Database connection error:', err));

//Signup API
app.post('/api/signup', async (req, res) => {
  try {
    const { user_name, user_email, user_contact, user_pass } = req.body;

    const existingUser = await User.findOne({ where: { user_email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const Password = user_pass;

    await User.create({
      user_name,
      user_email,
      user_contact,
      user_pass: Password
    });

    res.status(201).json({ message: 'Signup successful' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

//Login API
app.post('/api/login', async (req, res) => {
  try {
    const { user_email, user_pass} = req.body;

    const user = await User.findOne({ where: { user_email } });
    if (!user || user.user_pass !== user_pass) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ user_id: user.user_id, user_name: user.user_name }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    res.json({ message: 'Login successful', 
      token, 
      user_name: user.user_name, 
      user_id: user.user_id });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

//Logout API
app.post('/api/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

//Fetching Products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

//Categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Product.findAll({
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('product_category')), 'product_category']
      ],
      raw: true,
    });
    const categoryList = categories.map(cat => cat.product_category);
    res.json(categoryList);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

//Favorites API 
//Adding Favorite Product
app.post('/api/favorites', async (req, res) => {
  try {
    const { user_id, product_id } = req.body;

    const existingFavorite = await Favorites.findOne({ where: { user_id, product_id } });
    if (existingFavorite) {
      return res.status(400).json({ error: 'Product already favorited' });
    }
    const favorite = await Favorites.create({ user_id, product_id });
    res.status(201).json({ message: 'Favorite added', favorite });
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ error: 'Failed to add favorite' });
  }
});

//Fetching Favorites Product
app.get('/api/favorites', async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const favorites = await Favorites.findAll({ 
      where: { user_id },
      include: [
        {
          model: Product,
          required: true,
          attributes: ['product_id', 'product_title', 'product_image', 'product_price']
        }
      ]
    });

    console.log("Favorites Response:", JSON.stringify(favorites, null, 2));

    res.json(favorites.map(fav => fav.Product));

  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

//Removing Favorite Product
app.delete('/api/favorites/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const deleted = await Favorites.destroy({ where: { product_id: productId } });

    if (deleted) {
      res.json({ message: 'Favorite removed' });
    } else {
      res.status(404).json({ error: 'Favorite not found' });
    }
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
});



//Cart API
//Adding products to Cart
app.post('/api/cart', async (req, res) => {
  try {
    const { user_id, product_id, quantity } = req.body;

    const existingCartItem = await Cart.findOne({ where: { user_id, product_id } });
    if (existingCartItem) {
      return res.status(400).json({ error: 'Product already present in Cart' });
    }
      const cartItem = await Cart.create({ user_id, product_id, quantity });
      res.status(201).json({ message: 'Item added to cart', cartItem });
    
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Failed to add products to cart' });
  }
});

//Fetching Cart Items
app.get('/api/cart', async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    const cartItems = await Cart.findAll({ 
      where: { user_id },
      include: [
        {
          model: Product,
          required: true,
          attributes: ['product_id', 'product_title', 'product_image', 'product_price'] // Fetch only necessary fields
        }
      ]
    });

    console.log("Cart Response:", JSON.stringify(cartItems, null, 2));

    res.json(cartItems.map(carts => carts.Product));

  } catch (error) {
    console.error('Error fetching Cart Items:', error);
    res.status(500).json({ error: 'Failed to fetch Cart Items' });
  }
});

//Removing From Cart
app.delete('/api/cart/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const deleted = await Cart.destroy({ where: { product_id: productId } });

    if (deleted) {
      res.json({ message: 'Item removed from cart' });
    } else {
      res.status(404).json({ error: 'Cart item not found' });
    }
  } catch (error) {
    console.error('Error removing cart item:', error);
    res.status(500).json({ error: 'Failed to remove cart item' });
  }
});


Favorites.belongsTo(Product, { foreignKey: "product_id" }); //One favorite can have only one product
Product.hasMany(Favorites, { foreignKey: "product_id" }); // One product can have many favorites

module.exports = { Favorites, Product }; //Exporting our Models

Cart.belongsTo(Product, { foreignKey: "product_id" }); // One cart item can have only one product
Product.hasMany(Cart, { foreignKey: "product_id" }); // One product can be in many carts

module.exports = { Favorites, Cart }; //Exporting our Models

const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
