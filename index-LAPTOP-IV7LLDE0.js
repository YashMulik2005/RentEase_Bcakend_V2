const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const AuthRoutes = require("./route/AuthRoutes");
const BookingRoutes = require("./route/bookingRoutes");
const userRoutes = require("./route/getuserRoutes");
const paymentRoutes = require("./route/paymentRoutes");
const reviewRoutes = require("./route/reviewRoutes");
const roomRoutes = require("./route/roomRoutes");

const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["POST", "GET"],
    credentials: true,
    optionSuccessStatus: 200,
  })
);
app.use(express.json());

mongoose.set("strictQuery", false);
var db =
  "mongodb+srv://yashmulik95:W9KhVh3ZkmSNGnv0@cluster0.6hz37.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connect");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/api/auth", AuthRoutes);
app.use("/api/user", userRoutes);
app.use("/api/booking", BookingRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/room", roomRoutes);

app.listen(3000, () => {
  console.log("server started");
  console.log(" n n t");
});
