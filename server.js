/* Server configuration */

require('dotenv').config();
const app = require('./src/app');
const http = require('http');

// Start MinIO
const { initializeMinio } = require('./src/minio');
initializeMinio().catch((error) => {
  console.error('Error initializing MinIO:', error);
  process.exit(1);
});

const BACKEND_PORT = process.env.BACKEND_PORT || 3000;

const server = http.createServer(app);

server.listen(BACKEND_PORT, "0.0.0.0", () => {
    console.log(`Server is running on http://localhost:${BACKEND_PORT}`);
})

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('Received SIGINT. Shutting down gracefully...');
    server.close(() => {
      console.log('Server closed.');
      process.exit(0);
    });
  });

// Container shutdown
process.on('SIGTERM', () => {
    console.log('Received SIGTERM. Shutting down gracefully...');
    server.close(() => {
      console.log('Server closed.');
      process.exit(0);
    });
  });

// Handle errors and unhadled promise rejections
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
  });
  
process.on('unhandledRejection', (reason, promise) => {
console.error('Unhandled Rejection at:', promise, 'reason:', reason);
process.exit(1);
});
