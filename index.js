const express = require("express");
const bodyParser = require("body-parser");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const session = require("express-session");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("MongoDB Atlas connection error:", err));


const userSchema = new mongoose.Schema({
  name: String,
  username: String, 
  password: String,
});

const User = mongoose.model("User", userSchema);

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true }, 
  })
);


app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layout");


app.get("/", (req, res) => res.render("home"));


app.post("/register", async (req, res) => {
  const { name, username, password } = req.body;


  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(username)) {
    return res.render("register", { message: "Invalid email format." });
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
  if (!passwordRegex.test(password)) {
    return res.render("register", {
      message:
        "Password must be at least 6 characters, include uppercase, lowercase & a number.",
    });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.render("register", { message: "Email already registered." });
    }

  
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, username, password: hashedPassword });
    await newUser.save();

    res.redirect("/login"); // redirect to login after successful registration
  } catch (err) {
    console.error("Error saving user:", err);
    res.render("register", { message: "Error saving user. Try again." });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;


  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(username)) {
    return res.render("login", { message: "Invalid email format." });
  }

  try {
    const foundUser = await User.findOne({ username });
    if (!foundUser) {
      return res.render("login", {
        message: "User not found. Please register first.",
      });
    }

    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) {
      return res.render("login", { message: "Wrong password. Try again." });
    }

    
    const token = jwt.sign(
      { id: foundUser._id, username: foundUser.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

   
    req.session.token = token;
    res.redirect("/secrets");
  } catch (err) {
    console.error("Login error:", err);
    res.render("login", { message: "Error logging in. Try again." });
  }
});

app.get("/secrets", (req, res) => {
  const token = req.session.token;
  if (!token) return res.redirect("/login");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    User.findById(decoded.id).then((user) => {
      if (!user) return res.redirect("/login");
      res.render("secrets", { user });
    });
  } catch (err) {
    return res.redirect("/login");
  }
});


app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/login"));
});


app.get("/login", (req, res) => res.render("login"));
app.get("/register", (req, res) => res.render("register"));

// Start server
app.listen(5000, () => console.log("Server started on port 5000"));
