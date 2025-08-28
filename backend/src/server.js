import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { configViewEngine } from './config/viewEngine.js';
import { connectToDatabase } from './config/database.js';
import apiRoutes from './routes/api.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

configViewEngine(app);
app.use('/v1/api', apiRoutes);

(async () => {
  await connectToDatabase();
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
})();