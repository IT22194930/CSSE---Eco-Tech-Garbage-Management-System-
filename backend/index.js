const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config(); // Ensure dotenv is configured correctly
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const port = process.env.PORT || 3000;
const QRCode = require('qrcode');
const { feeCalculationScheduler } = require("./schedulers/feeCalculationScheduler")
// Middleware
app.use(cors({ methods: ['GET', 'POST', 'PUT', 'DELETE'], // explicitly allow POST requests
  allowedHeaders: ['Content-Type', 'Authorization']}
));
app.use(express.json());

// Connect to MongoDB using Mongoose
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.aetnw.mongodb.net/ecotech?retryWrites=true&w=majority&appName=Cluster0`,
    {
      connectTimeoutMS: 30000, // Adjust timeout as needed
    }
  )
  .then(() => {
    console.log("Successfully connected to MongoDB!");
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });

// User Model
const User = require("./models/User/User"); // Make sure to define User model correctly

// Middleware to verify JWT
const verifyJWT = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res
      .status(401)
      .send({ error: true, message: "Unauthorized access" });
  }
  const token = authorization.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(403)
        .send({ error: true, message: "Forbidden user or token has expired" });
    }
    req.decoded = decoded;
    next();
  });
};

// Middleware to verify admin
const verifyAdmin = async (req, res, next) => {
  const email = req.decoded.email;
  const user = await User.findOne({ email });
  if (user && user.role === "admin") {
    next();
  } else {
    return res
      .status(401)
      .send({ error: true, message: "Unauthorized access" });
  }
};

// Routes
app.use(
  "/api/garbageRequests",
  require("./routes/GarbageRequests/GarbageRequestsRoutes.js")
);

app.use(
  "/api/garbageTypes", require("./routes/GarbageTypes/garbageTypesRoutes.js")
)
app.use(
  "/api/payments", require("./routes/Payment/paymentRoutes.js")
)
app.post("/api/set-token", (req, res) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.ACCESS_SECRET, {
    expiresIn: "24h",
  });
  res.send({ token });
});

// User Routes
app.post("/new-user", async (req, res) => {
  try {
    const newUser = req.body;
    const result = await User.create(newUser); // Create the new user

    const userId = result._id.toString(); // Get the newly created user's ID

    // Generate a URL to get the user's details, e.g., http://yourdomain.com/users/:id
    const userDetailsUrl = `${process.env.BASE_URL}users/${userId}`;

    // Generate the QR code that stores this URL
    const qrCodeData = await QRCode.toDataURL(userDetailsUrl);

    // Save the QR code URL in the user document if you want to store it in the database
    result.qrCodeUrl = qrCodeData;
    await result.save();

    res.send(result); // Return the user object, now including the QR code URL
  } catch (error) {
    res.status(500).send({ error: true, message: error.message });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send({ error: true, message: error.message });
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ error: true, message: "User not found" });
    }
  } catch (error) {
    res.status(500).send({ error: true, message: error.message });
  }
});

app.delete("/delete-user/:id", verifyJWT, verifyAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const result = await User.findByIdAndDelete(id);
    if (result) {
      res.send(result);
    } else {
      res.status(404).send({ error: true, message: "User not found" });
    }
  } catch (error) {
    res.status(500).send({ error: true, message: error.message });
  }
});

app.put("/update-user/:id", verifyJWT, async (req, res) => {
  try {
    const id = req.params.id;
    const updatedUser = req.body;
    const result = await User.findByIdAndUpdate(id, updatedUser, {
      new: true,
      upsert: true,
    });
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: true, message: error.message });
  }
});

app.get("/user/:email", verifyJWT, async (req, res) => {
  try {
    const email = req.params.email;
    const user = await User.findOne({ email });
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ error: true, message: "User not found" });
    }
  } catch (error) {
    res.status(500).send({ error: true, message: error.message });
  }
});

app.get("/admin-stats", verifyJWT, verifyAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    res.send({ totalUsers });
  } catch (error) {
    res.status(500).send({ error: true, message: error.message });
  }
});

// Root endpoint
app.get("/", (req, res) => {
  res.send("Hello Developers!");
});

//Schedule monthly fee calculation
feeCalculationScheduler();

// Start server
app.listen(port, () => {
  console.log(`EcoTech Server listening on port ${port}`);
});
