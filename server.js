//const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const morgan = require("morgan");
const exphbs = require("express-handlebars"); //Views .hbs
const Article = require("./models/article");
const methodOverride = require("method-override");

// Load config
dotenv.config({ path: "./config/config.env" });

// Database Connection
connectDB();

const app = express();

// Logs on console
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride("_method"));

// Handlebars Helpers
const { formatDate } = require("./helpers/hbs");

// View Engine Setup
app.engine(
  "hbs",
  exphbs({
    helpers: { formatDate },
    defaultLayout: "main",
    extname: ".hbs",
  })
);
//app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.get("/", async (req, res) => {
  const articles = await Article.find().sort({ createdAt: "desc" }).lean();
  res.render("articles/index", { articles });
});

// Routes
app.use("/articles", require("./routes/articles"));

const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(`Server running ${process.env.NODE_ENV} mode on port ${PORT}`)
);
