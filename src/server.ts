import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tedlist';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error: Error) => console.error('MongoDB connection error:', error));

// Lazy load routes
const setupRoutes = async () => {
  try {
    // Dynamically import routes
    const [{ default: authRoutes }, { default: itemRoutes }] = await Promise.all([
      import('./routes/auth'),
      import('./routes/items')
    ]);

    // Apply routes
    app.use('/api/auth', authRoutes);
    app.use('/api/items', itemRoutes);

    console.log('Routes loaded successfully');
  } catch (error) {
    console.error('Error loading routes:', error);
  }
};

// Basic error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Initialize routes and start server
const startServer = async () => {
  await setupRoutes();
  
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
}); 