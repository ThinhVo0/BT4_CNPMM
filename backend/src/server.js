const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { configViewEngine } = require('./config/viewEngine.js');
const { connectToDatabase } = require('./config/database.js');
const { checkConnection, createProductIndex } = require('./config/elasticsearch.js');
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
  try {
    // Kết nối MongoDB
    await connectToDatabase();
    
    // Kết nối và khởi tạo Elasticsearch
    const elasticsearchConnected = await checkConnection();
    if (elasticsearchConnected) {
      await createProductIndex();
    } else {
      console.warn('⚠️  Elasticsearch not available, search functionality will be limited');
    }
    
    app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
      console.log(`📊 MongoDB: Connected`);
      console.log(`🔍 Elasticsearch: ${elasticsearchConnected ? 'Connected' : 'Not Available'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
})();