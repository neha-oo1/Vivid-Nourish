const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const commentRoute = require("./routes/comments");

// database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Database connected successfully!!");
  } catch (err) {
    console.log(err);
  }
};

// middlewares
dotenv.config();
app.use(express.json());
app.use(cookieParser());
// app.use(cors({ origin: "http://localhost:5173", credential: true }));
const corsOption = {
  origin: ["http://localhost:5173"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};
app.use(cors(corsOption));
app.use("/images", express.static(path.join(__dirname, "/images")));

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/comments", commentRoute);

// image upload
const storage = multer.diskStorage({
  destination: (req, file, fn) => {
    fn(null, "images");
  },
  filename: (req, file, fn) => {
    fn(null, req.body.img);
    // fn(null, "img1.jpg");
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("Image has been uploaded successfully!");
});

app.listen(process.env.PORT, () => {
  connectDB();
  console.log(`app is running on port ${process.env.PORT}`);
});
