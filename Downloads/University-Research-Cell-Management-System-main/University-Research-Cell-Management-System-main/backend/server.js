import express from 'express';
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 8000;

//! Middleware
app.use(express.json()); // api to json
app.use(express.urlencoded({ extended: false })); //html form response to json

app.get('/', (req, res) => {
  return res.json({ message: 'Welcome to the University Research Cell Management System API' });
});
//! Import routes
import ApiRoutes from './routes/api.js';
app.use("/api", ApiRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});