import app from "./app";
import { connectToDatabase } from "./config/db";

const PORT = 8080;

// starts server and connects to database
const startServer = async () => {
  try {
    // connect to db
    await connectToDatabase();

    // start server listener on given port
    app.listen(PORT, () => {
      console.log(`✅ Server runs on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ There was an error during running server: ", error);
  }
};

// start application
startServer();
