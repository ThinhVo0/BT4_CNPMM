const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { configViewEngine } = require('./config/viewEngine.js');
const { connectToDatabase } = require('./config/database.js');
const apiRoutes = require('./routes/api.js');

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

configViewEngine(app);
app.use('/api', apiRoutes);

(async () => {
  await connectToDatabase();
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
})();