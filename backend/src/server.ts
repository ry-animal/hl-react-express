import app from './app';
import { dbPromise } from './db';

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    await dbPromise;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

export default startServer;
