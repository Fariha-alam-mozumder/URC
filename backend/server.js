import express from 'express';
import "dotenv/config";
import fileUpload from 'express-fileupload';
import helmet from "helmet";
import cors from "cors";
import {limiter} from "./config/ratelimiter.js";
import './jobs/SendEmailJob.js';



const app = express();
const PORT = process.env.PORT || 8000;



//* Middleware

//! CORS should be one of the first middleware (before cache and routes)
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  credentials: true,   //Only requests coming from https://news.com are allowed to access your backend API
  optionsSuccessStatus: 200
})); 
//app.use(cors()); // Allows or restricts access to your backend from different origins (frontends/apps)


// ! Basic Express middleware
app.use(express.json()); // api to json
app.use(express.urlencoded({ extended: false })); // html form response to json
app.use(fileUpload()); // Giving authority of getting uploaded files by user

//! Security middleware
app.use(helmet()); // Secures the app by setting safe HTTP headers

// ! Rate limiting
app.use(limiter); // Apply the rate limiting middleware to all requests.

// ! Static files
// Give permission to express js so that it can show images by url
// means ww will tell express js that if someone want to "GET" static files from u than you can give it
app.use(express.static("public")); // public directory te ja data ache ta publicly serve krte parbo

// To serve a default profile picture from your local public/images directory (instead of using an external URL)
// You're using Express, so serve the /public folder like this
app.use("/images", express.static("public/images"));


// ! Cache middleware (after CORS and basic setup)


app.get('/', (req, res) => {
  return res.json({ message: 'Welcome to the University Research Cell Management System API' });
});


//! Import routes
import ApiRoutes from './routes/api.js';
app.use("/api", ApiRoutes);

//! jobs import
import "./jobs/index.js";


// //! logger 
// import logger from './config/logger.js';
// logger.info ("Hey I am just testing...") //will save this in combine.log
// logger.error ("Hey I am just testing Error Log...") //will save this in error.log

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});





