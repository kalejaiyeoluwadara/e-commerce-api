require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieparser = require("cookie-parser");
const fileUpload = require("express-fileupload");
// database
const connectDB = require("./db/connect");
const notFoundMiddleWare = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoute");
const productRouter = require("./routes/productRoute");

app.use(morgan("tiny"));
app.use(express.json());
app.use(cookieparser(process.env.JWT_SECRET));

app.use(express.static("./public"));
app.use(fileUpload());
// home url
app.get("/", (req, res) => {
  res.send("<h1>e-commmerce api</h1>");
});
app.get("/api/v1", (req, res) => {
  console.log(req.signedCookies);
  res.send("<h1>e-commmerce api</h1>");
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use(notFoundMiddleWare);
app.use(errorHandlerMiddleware);
const PORT = process.env.PORT || 5000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, console.log(`Server is listenin on PORT ${PORT}...`));
  } catch (error) {
    console.log(error);
  }
};
start();
