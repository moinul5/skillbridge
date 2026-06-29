import app, { initApp } from './app';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await initApp();
    app.listen(PORT, () => {
      console.log('======================================================');
      console.log(`🌐 Server is running on port ${PORT}`);
      console.log(`⚙️  Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
      console.log('======================================================');
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
    process.exit(1);
  }
};

startServer();
