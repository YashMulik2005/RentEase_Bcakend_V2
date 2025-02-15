const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const AuthRoutes = require("./route/AuthRoutes");

const app = express();
app.use(
  cors({
    origin: "*",
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

app.listen(3000, () => {
  console.log("server started");
  console.log(process.env.jwt_key);
});
