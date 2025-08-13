const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: './config.env' });

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// Test routes
app.get('/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'Test server is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/test', (req, res) => {
  res.json({
    status: 'success',
    message: 'API is working',
    data: {
      test: true,
      timestamp: new Date().toISOString()
    }
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API test: http://localhost:${PORT}/api/test`);
});

