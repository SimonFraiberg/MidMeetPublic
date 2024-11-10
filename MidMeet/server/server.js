const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const meet = require("./routes/meet");
const user = require("./routes/user");
const token = require("./routes/token");
const cookieParser = require("cookie-parser");
const path = require("path");

require("custom-env").env(process.env.NODE_ENV, "./config");

mongoose.connect(process.env.CONNECTION_STRING);

const app = express();

// Middleware setup
app.use(express.static("./public"));
app.use(
  cors({
    origin: "http://localhost:12345", // Specify the allowed origin
    credentials: true, // Allow credentials (cookies)
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use("/api/Meets", meet);
app.use("/api/Users", user);
app.use("/api/Tokens", token);

app.use(cookieParser());
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html")); // Serves the React app for all other routes
});
// Create HTTP server
const http = require("http");
const server = http.createServer(app);

// Start the server
const PORT = process.env.PORT || 12345;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
