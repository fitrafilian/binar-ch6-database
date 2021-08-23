// Core module
const express = require("express");
const app = express();

// Third-party module
const expressLayouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");

app.use(cors());

// To support URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// To parse cookies from the HTTP Request
app.use(cookieParser());

// To make public folder
app.use(express.static("public"));

// EJS
app.set("view engine", "ejs");
app.use(expressLayouts);

// Database
require("./config/db");

// Router
const pageRouter = require("./routes/page.router");
app.use("/", pageRouter);

const usersRouter = require("./routes/users.router");
app.use("/user", usersRouter);

const dashboardRouter = require("./routes/dashboard.router");
app.use("/dashboard", dashboardRouter);

// To handle user error
app.get("*", (req, res) => {
  res.render("404", {
    title: "404 not found",
    layout: "layouts/main",
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Listening from port ${PORT}`);
});
