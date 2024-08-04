const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = "mongodb://127.0.0.1:27017/Plant";

// MongoDB connection setup
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const UserCartSchema = new mongoose.Schema({
  id: { type: String, required: true },
  imageSrc: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  addedAt: { type: Date, default: Date.now } // Add timestamp for sorting
});

const User = mongoose.model("User", UserSchema, "Users");
const UserCart = mongoose.model("UserCart", UserCartSchema, "UserCart");


app.use(express.json());
app.use(cors());

// Route to handle signup
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ email, password });
    await newUser.save();

    return res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to handle signin
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

    return res.status(200).json({ message: "Signin successful" });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST endpoint to add items to the cart
app.post("/cart", async (req, res) => {
  const { id, imageSrc, name, price, quantity } = req.body;

  // Validate request data
  if (!id || !imageSrc || !name || !price || !quantity) {
    return res.status(400).json({ message: "Invalid request data" });
  }

  try {
    // Check if the item already exists in the cart
    const existingCartItem = await UserCart.findOne({ id });

    if (existingCartItem) {
      // Update the quantity of the existing item
      existingCartItem.quantity += quantity;
      await existingCartItem.save();
    } else {
      // Create a new cart item
      const newCartItem = new UserCart({ id, imageSrc, name, price, quantity });
      await newCartItem.save();
    }

    // Respond with success
    return res.status(201).json({ message: "Add-to-Cart successful" });
  } catch (error) {
    // Log the error for debugging
    console.error("Add-to-Cart error:", error);

    // Respond with a generic error message
    return res.status(500).json({ message: "Internal server error" });
  }
});



// GET route to retrieve items from the cart
app.get('/cart', async (req, res) => {
  try {
    // Fetch all cart items from the database and sort by 'addedAt' timestamp
    const cartItems = await UserCart.find().sort({ addedAt: -1 });
    return res.status(200).json(cartItems);
  } catch (error) {
    console.error("Get-Cart error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.delete('/cart/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await UserCart.deleteOne({ id: parseInt(id) });
    return res.status(200).json({ message: 'Item removed successfully' });
  } catch (error) {
    console.error('Remove item error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
