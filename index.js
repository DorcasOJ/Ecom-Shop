require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const { connectToDB } = require("./database/db");
const { errorhandler } = require("./middleware/errorHandler");
const authRoutes = require("./routes/Auth");
const userRoutes = require("./routes/User");
const productRoutes = require("./routes/Product");
const OrderRoutes = require("./routes/Order");
const categoryRoutes = require("./routes/Category");
const brandRoutes = require("./routes/Brand");
const addressRoutes = require("./routes/Address");
const wishlistRoutes = require("./routes/Wishlist");
const reviewRoutes = require("./routes/Review");
const cartRoutes = require("./routes/Cart");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const server = express();

const PORT = process.env.PORT || 4000;
// connect database
connectToDB();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());
server.use(morgan("tiny"));

// change to single origin later
const allowedOrigins = [process.env.ORIGIN, process.env.ORIGIN2];

// middlewares
server.use(
  cors({
    origin: function (origin, callback) {
      // allow req with no origin like mobile apps or curls
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    exposedHeaders: ["X-Total-Count"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

server.use(
  session({
    name: "sid",
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
      maxAge: process.env.COOKIE_EXPIRATION_DAYS * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "Lax",
      secure: false,
    },
  })
);

server.get("/", (req, res) => {
  res.status(200).json({ message: "backend running" });
});

// routeMiddlewares
server.use("/auth", authRoutes);
server.use("/users", userRoutes);
server.use("/cart", cartRoutes);
server.use("/address", addressRoutes);
server.use("/review", reviewRoutes);
server.use("/wishlist", wishlistRoutes);
server.use("/", productRoutes);
server.use("/", categoryRoutes);
server.use("/", brandRoutes);
server.use("/", OrderRoutes);

server.use(errorhandler);

server.listen(4000, () => {
  console.log(`server [STARTED] ~ running on port ${PORT}`);
});
