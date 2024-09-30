const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config(); // Ensure dotenv is configured correctly
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB using Mongoose
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@agripeace-server.sqb4jsm.mongodb.net/agripeace?retryWrites=true&w=majority`,
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
  "/api/costCalculator",
  require("./routes/CostCalculator/CostCalculatorRoutes")
);
app.use("/Plant", require("./routes/PlantManagement/PlantRoute"));
app.use("/Fertilizer", require("./routes/FertilizerManagement/FertilizerRoute.js"));
app.use("/api/diseases", require("./routes/DiseaseManagement/DiseaseRoutes"));
app.use("/Location", require("./routes/LocationManagement/LocationRoute.js"));
app.use("/api/crops", require("./routes/LocationManagement/CropRoute"));

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
    const result = await User.create(newUser);
    res.send(result);
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

// Start server
app.listen(port, () => {
  console.log(`AgriPeace Server listening on port ${port}`);
});
