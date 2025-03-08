import startServer from './server';

startServer().catch(error => {
  console.error('Uncaught error:', error);
  process.exit(1);
}); 