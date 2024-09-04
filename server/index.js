const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require('multer');
const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = "mongodb://127.0.0.1:27017/Plant";

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// MongoDB connection setup
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Schemas and Models
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }, // Add role field
});


const addProductSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: {
    data: Buffer,
    contentType: String
  }
} ,{
  timestamps: true
});

const UserCartNewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  id: { type: String, required: true },
  imageSrc: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  addedAt: { type: Date, default: Date.now }
});

const CheckOutSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  paymentMethod: { type: String, enum: ['COD', 'Credit Card', 'PayPal'], default: 'COD' },
  deliveryInstructions: { type: String },
  expectedDeliveryDate: { type: Date, required: true },
  price: { type: Number, required: true }
}, {
  timestamps: true
});

const User = mongoose.model('User', UserSchema, 'Users');
const AddProduct = mongoose.model('AddProduct', addProductSchema,'AddProduct');
const UserCart = mongoose.model('UserCartNew', UserCartNewSchema, 'UserCartNew');
const CheckOut = mongoose.model('CheckOut', CheckOutSchema, 'CheckOut');

// Middleware
app.use(cors());
app.use(express.json());

app.post("/signup", async (req, res) => {
  const { email, password, role } = req.body; // Include role in the destructuring

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user with the provided role
    const newUser = new User({ email, password, role });
    await newUser.save();

    return res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }
    return res.json({ role: user.role }); 
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Endpoint to upload an image and create a product
app.post('/admin/addproduct', upload.single('image'), async (req, res) => {
  if (!req.file || !req.body.id || !req.body.name || !req.body.price) {
    return res.status(400).send('Missing fields or file.');
  }

  const addProduct = new AddProduct({
    id: req.body.id,
    name: req.body.name,
    price: req.body.price,
    image: {
      data: req.file.buffer,
      contentType: req.file.mimetype
    }
  });

  try {
    await addProduct.save();
    res.status(200).send('Product uploaded and saved.');
  } catch (error) {
    res.status(500).send('Error uploading product.');
  }
});

// Route to fetch all products
app.get('/admin/getproduct', async (req, res) => {
  try {
    const products = await AddProduct.find({}).sort({ createdAt: -1 });
    // Convert image data to base64 string
    const productsWithImages = products.map(product => ({
      ...product.toObject(),
      image: {
        data: product.image.data.toString('base64'),
        contentType: product.image.contentType
      }
    }));
    res.status(200).json(productsWithImages);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

app.post('/cart', async (req, res) => {
  const { email, id, imageSrc, name, price, quantity } = req.body;
  if (!email || !id || !imageSrc || !name || !price || !quantity) {
    return res.status(400).json({ message: 'Invalid request data' });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const existingCartItem = await UserCart.findOne({ user: user._id, id });
    if (existingCartItem) {
      return res.status(200).json({
        message: 'Item already in cart',
        currentQuantity: existingCartItem.quantity
      });
    } else {
      const newCartItem = new UserCart({
        user: user._id,
        id,
        imageSrc,
        name,
        price,
        quantity
      });
      await newCartItem.save();
      return res.status(201).json({ message: 'Item added to cart successfully' });
    }
  } catch (error) {
    console.error('Add-to-Cart error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.put('/cart/:id', async (req, res) => {
  const { email, quantity } = req.body;
  const { id } = req.params;
  if (!email || quantity === undefined) {
    return res.status(400).json({ message: 'Invalid request data' });
  }
  if (quantity <= 0 || !Number.isInteger(quantity)) {
    return res.status(400).json({ message: 'Invalid quantity. It must be a positive integer.' });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const cartItem = await UserCart.findOne({ user: user._id, id });
    if (cartItem) {
      cartItem.quantity = quantity;
      await cartItem.save();
      return res.status(200).json({ message: 'Cart item updated successfully' });
    } else {
      return res.status(404).json({ message: 'Cart item not found' });
    }
  } catch (error) {
    console.error('Update Cart Item error:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

app.get('/cart', async (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const cartItems = await UserCart.find ({ user: user._id }).sort({ addedAt: -1 });
    return res.status(200).json(cartItems);
  } catch (error) {
    console.error("Get-Cart error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.delete('/cart/:id', async (req, res) => {
  const { email } = req.body;
  const { id } = req.params;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await UserCart.deleteOne({ user: user._id, id });
    return res.status(200).json({ message: 'Item removed successfully' });
  } catch (error) {
    console.error('Remove item error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/checkout', async (req, res) => {
  const { 
    email,  // Change `user` to `email`
    fullName, 
    addressLine1, 
    addressLine2, 
    city, 
    state, 
    postalCode, 
    country, 
    phoneNumber, 
    paymentMethod, 
    deliveryInstructions, 
    expectedDeliveryDate, 
    price 
  } = req.body;

  if (!email || !fullName || !addressLine1 || !city || !state || !postalCode || !country || !phoneNumber || !expectedDeliveryDate || price === undefined) {
    return res.status(400).json({ message: 'All required fields must be provided' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const checkoutData = new CheckOut({
      user: user._id,  // Set user as `_id` of the found user
      fullName,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      phoneNumber,
      paymentMethod: paymentMethod || 'COD', // Default to 'COD' if not provided
      deliveryInstructions,
      expectedDeliveryDate: new Date(expectedDeliveryDate), // Ensure it's a Date object
      price
    });
    
    await checkoutData.save();
    res.status(201).json({ message: 'Checkout information saved successfully' });
  } catch (error) {
    console.error('Error saving checkout information:', error);
    res.status(500).json({ message: 'Error saving checkout information', error: error.message });
  }
});

app.get('/admin', async (req, res) => {
  try {
    const checkouts = await CheckOut.find()
      .populate('user') // Ensure `user` is the correct reference in your schema
      .sort({ createdAt: -1 }); // Adjust to the correct field if necessary (use `createdAt` if `addedAt` does not exist)
    
    res.status(200).json(checkouts);
  } catch (error) {
    console.error('Error fetching checkouts:', error); // Log the error for debugging
    res.status(500).json({ message: 'Error fetching checkouts', error });
  }
});


app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
