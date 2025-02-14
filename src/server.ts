import { Server } from 'http';
import app from './app/app';
import config from './app/config';
import { connectDB } from './app/config/db';

let server: Server | null = null;

// Gracefully shuts down the server and exits the process.

const shutdown = (): void => {
  console.log('⚠️ Initiating shutdown...');

  if (server) {
    server.close(() => {
      console.log('👋 Server closed successfully.');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

// Handles unexpected errors in the application.
const handleUnexpectedError = (error: unknown, origin: string): void => {
  console.error(`🚨 ${origin} detected ❌:`, error);
  shutdown();
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason) =>
  handleUnexpectedError(reason, 'Unhandled Rejection'),
);

// Handle uncaught exceptions
process.on('uncaughtException', (error) =>
  handleUnexpectedError(error, 'Uncaught Exception'),
);

// Starts the server and initializes the database.

const startServer = async (): Promise<void> => {
  try {
    await connectDB();

    server = app.listen(config.port, () => {
      console.log(`🚀 Server is running on port ${config.port} 🏃🏽‍♂️➡️`);
    });
  } catch (error) {
    console.error('❌ Failed to start the server:', error);
    shutdown();
  }
};

// Start the server
startServer();
