const mongoSanitize = require("express-mongo-sanitize");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const hpp = require("hpp");

//* instantiate express
const app = express();

//* Routes file
// const interview_session = require("./routes/interview_session");
const companies = require("./routes/companies");
const auth = require("./routes/auth");

//* Load env vars
dotenv.config({
  path: "./config/config.env",
});

//* connect to mongoDB
connectDB();

//* Cookie parser
app.use(cookieParser());

app.use(express.json());

//* Sanitize data
app.use(mongoSanitize());

//* Set security headers
app.use(helmet());

//* Prevent XSS attacks
app.use(xss());

//* Prevent http param pollution
app.use(hpp());

//* Enable CORS
app.use(cors());

app.use("/api/v1/auth", auth);
app.use("/api/v1/companies", companies);
// app.use("/api/v1/sessions", interview_session);

const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log("Server running in ", process.env.PORT, " mode on port ", PORT)
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
