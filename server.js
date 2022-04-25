const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require('./config/db');
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

//* instantiate express
const app = express();

//* Swagger set up
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Library API",
      version: "1.0.0",
      description: "A simple Express OnlineJobfair API",
    },
    servers: [{
      url: 'http://localhost:5000/api/v1'
    }],
  },
  apis: ["./routes/*.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use(express.json());

//* Sanitize data
app.use(mongoSanitize());

//* Set security headers
app.use(helmet());

//* Prevent XSS attacks
app.use(xss());

//* Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

//* Prevent http param pollution
app.use(hpp());

//* Enable CORS
app.use(cors());

//* Routes file
const companies = require("./routes/company");
const interview_session = require("./routes/interview_session");
const auth = require("./routes/auth");

//* Load env vars
dotenv.config({
  path: "./config/config.env"
});

//* connect to mongoDB
connectDB();


app.use("/api/v1/companies", companies);
app.use("/api/v1/auth", auth);
app.use("/api/v1/interview_session", interview_session);

//* Cookie parser
app.use(cookieParser());


app.get("/", (req, res) => {
  //   res.send("<h1>Hello from express</h1>");
  //   res.send({ name: "Brad" });
  //   res.json({ name: "Brad" });
  //   res.sendStatus(400);
  //   res.status(400).json({ success: false });
  res.status(200).json({
    success: true,
    data: {
      id: 1
    }
  });
});

console.log(process.env.PORT)
const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log("Server running in ", process.env.PORT, " mode on port ", PORT)
);
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});