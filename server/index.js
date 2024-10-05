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



const AddProductSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  desc: { type: String, required: true },
  highlights: { type: String, required: true },
  detail: { type: String, required: true },
  image: {
    data: Buffer,
    contentType: String
  },
  addedAt: { type: Date, default: Date.now }
});


const AddToBagSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
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
  email: { type: String, required: true },
  fullName: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  totalAmount: { type: String, required: true },
  paymentMethod: { type: String, enum: ['COD', 'Credit Card', 'PayPal'], default: 'COD' },
  deliveryInstructions: { type: String ,required:true},
  expectedDeliveryDate: { type: Date, required: true },
  price: [{ type: Number, required: true }],  // Array of prices
  name: [{ type: String, required: true }],  // Array of names
  quantity: [{ type: Number, required: true }],  // Array of quantities
  image: [
    {
      data: Buffer,
      contentType: String
    }
  ],  // Array of images
}, {
  timestamps: true
});


const User = mongoose.model('User', UserSchema, 'Users');
const AddProduct = mongoose.model('AddProduct', AddProductSchema,'AddProduct');
const AddToBag = mongoose.model('AddToBag', AddToBagSchema, 'AddToBag');
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

// POST route to upload and save product
app.post('/admin/addproduct', upload.single('image'), async (req, res) => {
  // Check for missing fields or file
  if (!req.file || !req.body.id || !req.body.name || !req.body.price || !req.body.desc || !req.body.detail || !req.body.highlights) {
    return res.status(400).send('Missing fields or image file.');
  }

  // Create a new product object
  const addProduct = new AddProduct({
    id: req.body.id,
    name: req.body.name,      
    price: req.body.price,
    desc: req.body.desc,
    detail: req.body.detail,
    image: {
      data: req.file.buffer,
      contentType: req.file.mimetype
    },
    highlights: req.body.highlights,
  });

  try {
    // Save the product to the database
    await addProduct.save();
    res.status(200).send('Product uploaded and saved successfully.');
  } catch (error) {
    // Send error response in case of failure
    res.status(500).send('Error uploading product.');
  }
});

// Route to fetch all products
app.get('/getproduct', async (req, res) => {
  try {
    const products = await AddProduct.find({}).sort({ addedAt: -1 });
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


app.get('/getproductdetail/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await AddProduct.findOne({ id: productId });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // If you want to send the image as a base64 string, include this in the response:
    const productResponse = {
      id: product.id,
      name: product.name,
      desc: product.desc,
      price: product.price,
      image: `data:${product.image.contentType};base64,${product.image.data.toString('base64')}`,
      highlights: product.highlights, 
      detail: product.detail,       
    };
    res.json(productResponse);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});




app.post('/admin/addtobag', upload.single('image'), async (req, res) => {
  console.log('Request body:', req.body);
  console.log('Uploaded image file:', req.file);

  const { email,id, name, price, quantity } = req.body;
  const image = req.file;

  if (!email || !id || !name || !price || !image || !quantity) {
    return res.status(400).json({ message: 'Invalid request data ' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const existingCartItem = await AddToBag.findOne({ user: user._id, id });
    if (existingCartItem) {
      return res.status(200).json({
        message: 'Item already in cart',
        currentQuantity: existingCartItem.quantity
      });
    }
      else
      {
    const newProduct = new AddToBag({
      user: user._id,
      id,
      name,
      price,
      quantity,
      image: {
        data: image.buffer,
        contentType: image.mimetype
      }
    })
    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully' });
  };
  } 
  catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



// Route for fetching all products in the user's bag based on their email
// Route for fetching all products in the user's bag based on their email
app.get('/admin/addtobag', async (req, res) => {
  const { email } = req.query; // Get email from query parameters

  console.log('Email received from query:', email); // Log to confirm email is received

  if (!email) {
    return res.status(400).json({ message: 'Email is required' }); // Return error if email is not provided
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" }); // Return error if user is not found
    }

    // Fetch all products from the AddToBag for the found user
    const products = await AddToBag.find({ user: user._id }).sort({ createdAt: -1 }); // Adjust 'createdAt' as needed

    // Check if there are no products found
    if (!products.length) {
      return res.status(404).json({ message: 'No products found' });
    }

    // Map through the products to build the response array
    const productResponse = products.map(product => {
      // Check if image exists before attempting to access its properties
      const imageBase64 = product.image 
        ? `data:${product.image.contentType};base64,${product.image.data.toString('base64')}` 
        : null; // or handle as needed (e.g., use a placeholder image)

      return {
        id: product.id, // Use product._id instead of product.id if using Mongoose
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        image: imageBase64 // Safely assigned
      };
    });

    res.json(productResponse); // Return the response with products
  } catch (error) {
    // Improved error handling for debugging
    console.error('Error fetching products:', error.message || error);
    res.status(500).json({ message: 'Internal server error', error: error.message || 'Unknown error' });
  }
});

app.put('/admin/updatequantity/:id', async (req, res) => {
  // Log the incoming request data for debugging
  console.log('Request body:', req.body);
  console.log('Request query:', req.params);

  // Extract data from the request body and query parameters
  const { email, quantity } = req.body;
  const { id } = req.params;

  // Validate the request data
  if (!email || quantity === undefined) {
    return res.status(400).json({ message: 'Invalid request data. Please provide email and quantity.' });
  }

  // Convert quantity to integer
  const quantityInt = parseInt(quantity, 10);
  if (quantityInt <= 0 || !Number.isInteger(quantityInt)) {
    return res.status(400).json({ message: 'Invalid quantity. It must be a positive integer.' });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the cart item by user ID and product ID
    const cartItem = await AddToBag.findOne({ user: user._id, id });
    if (cartItem) {
      // Update the quantity
      cartItem.quantity = quantityInt; // Use the integer value
      await cartItem.save();
      return res.status(200).json({ message: 'Cart item updated successfully' });
    } else {
      return res.status(404).json({ message: 'Cart item not found' });
    }
  } catch (error) {
    console.error('Update Cart Item error:', error); // Log the error for debugging
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Delete a cart item
app.delete('/admin/deletecartitem/:id', async (req, res) => {
  const  {email}  = req.body;
  let {id}  = req.params;
  console.log(email);
  console.log(id);

  if (!email) {
    return res.status(400).json({ message: 'Invalid request data. Please provide email.' });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found:', user);

    // Log query details for debugging
    const query = { user: user._id, id: id };
    console.log('Query:', query);

    // Find the cart item by user ID and product ID
    const cartItem = await AddToBag.findOne(query);

    if (!cartItem) {
      console.log('Cart item not found with user:', user._id, 'and product id:', id); // Log details
      return res.status(404).json({ message: 'Cart item not found' });
    }

    console.log('Cart item found:', cartItem);

    // Delete the cart item
    await cartItem.deleteOne();
    return res.status(200).json({ message: 'Cart item deleted successfully' });
  } catch (error) {
    console.error('Delete Cart Item error:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
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

app.post('/checkout', upload.array('image'), async (req, res) => {
  // Destructure the body
  const {
    email,
    fullName,
    addressLine1,
    addressLine2,
    city,
    state,
    postalCode,
    country,
    phoneNumber,
    paymentMethod = 'COD', // Default to 'COD' if not provided
    deliveryInstructions,
    expectedDeliveryDate,
    totalAmount,
    price,  // Expecting an array of prices
    name,   // Expecting an array of names
    quantity  // Expecting an array of quantities
  } = req.body;

  const images = req.files; // Multiple files (array)

  // Log incoming body and files
  console.log("Received body:", req.body);
  console.log("Received files:", req.files);

  // Validate required fields
  if (!email || !deliveryInstructions || !fullName || !addressLine1 || !addressLine2 || !city || !state || !postalCode || !country || !phoneNumber || !expectedDeliveryDate || !price || !name || !quantity || !images || images.length === 0) {
    return res.status(400).json({ message: 'All required fields must be provided' });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prepare image array (since image is now an array)
    const imageArray = images.map(image => ({
      data: image.buffer,
      contentType: image.mimetype
    }));

    // Ensure price, name, and quantity are arrays
    const priceArray = Array.isArray(price) ? price : [price];
    const nameArray = Array.isArray(name) ? name : [name];
    const quantityArray = Array.isArray(quantity) ? quantity : [quantity];

    // Create checkout data
    const checkoutData = new CheckOut({
      user: user._id,  // Set user as `_id` of the found user
      email,
      fullName,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      phoneNumber,
      totalAmount,
      paymentMethod, // COD or whatever method is passed
      deliveryInstructions,
      expectedDeliveryDate: new Date(expectedDeliveryDate), // Ensure it's a Date object
      price: priceArray,
      name: nameArray,
      quantity: quantityArray,
      image: imageArray // Set image as an array of objects
    });

    console.log("Saving checkout data:", checkoutData);

    // Save the checkout data
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
      .sort({ createdAt: -1 }); // Sort checkouts by createdAt field

    // Map through the checkouts to build the response array
    const productResponse = checkouts.map(checkout => {
      // Check if image exists before attempting to access its properties
      const imageBase64 = checkout.image.length > 0 // Check if images array is not empty
        ? checkout.image.map(img => 
            `data:${img.contentType};base64,${img.data.toString('base64')}`
          ) 
        : null; // Handle no images (set to null or a placeholder)

      return {
        id: checkout._id,
        fullName: checkout.fullName, // Use checkout._id instead of checkout.id if using Mongoose
        productName: checkout.name, // Assumes name is an array
        price: checkout.price, // Assumes price is an array
        quantity: checkout.quantity, // Assumes quantity is an array
        image: imageBase64, 
        phoneNumber: checkout.phoneNumber,
        email:checkout.email,
        paymentMethod : checkout.paymentMethod,
        totalAmount:checkout.totalAmount,
        addressLine1:checkout.addressLine1,
        addressLine2:checkout.addressLine2,
        city:checkout.city,
        state:checkout.state,
        postalCode:checkout.postalCode,
        country:checkout.country,
        expectedDeliveryDate:checkout.expectedDeliveryDate,
        deliveryInstructions:checkout.deliveryInstructions
      };
    });

    res.status(200).json(productResponse); // Send back the processed response

  } catch (error) {
    console.error('Error fetching checkouts:', error); // Log the error for debugging
    res.status(500).json({ message: 'Error fetching checkouts', error: error.message }); // Return a proper error message
  }
});

app.get('/myorders', async (req, res) => {
  const { email } = req.query; // Get email from query parameters

  console.log('Email received from query:', email); // Log to confirm email is received

  if (!email) {
    return res.status(400).json({ message: 'Email is required' }); // Return error if email is not provided
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' }); // Return error if user is not found
    }

    // Fetch all products from the CheckOut model for the found user
    const products = await CheckOut.find({ user: user._id }).sort({ createdAt: -1 }); // Adjust 'createdAt' as needed

    // Check if no products are found
    if (!products || products.length === 0) {
      return res.status(404).json({ message: 'No products found' });
    }

    // Map through the products to build the response array
    const productResponse = products.map(product => {
      // Prepare the image array for each product
      const images = product.image.map(image => {
        if (image.data && image.contentType) {
          return `data:${image.contentType};base64,${image.data.toString('base64')}`;
        }
        return null; // Return null if no image
      });

      return {
        id: product._id, // Use product._id instead of product.id
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        image: images, // Send images as an array
        addressLine1:product.addressLine1,
        addressLine2:product.addressLine2,
        state:product.state,
        city:product.city,
        postalCode:product.postalCode,
        email:product.email,
        paymentMethod:product.paymentMethod,
        phoneNumber:product.phoneNumber,
        totalAmount:product.totalAmount,
        deliveryInstructions:product.deliveryInstructions,
        expectedDeliveryDate:product.expectedDeliveryDate
      };
    });

    res.json(productResponse); // Return the response with products
  } catch (error) {
    // Improved error handling for debugging
    console.error('Error fetching products:', error.message || error);
    res.status(500).json({ message: 'Internal server error', error: error.message || 'Unknown error' });
  }
});


app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
