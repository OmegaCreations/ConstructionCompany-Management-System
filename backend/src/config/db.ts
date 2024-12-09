import dotenv from "dotenv";
import { Client } from "pg";

dotenv.config();

// Postgres client that we will use to connect to db
export const client = new Client({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  ssl: {
    // important - this database have no ssl certificate to authorize - we use free version of it
    rejectUnauthorized: false,
  },
});

// Connect to database
export const connectToDatabase = async () => {
  try {
    await client.connect(); // waits for the connection
    const schema = await client.query(`SELECT current_schema();`);
    console.log(
      "✅ Connected to database. With schema " + schema.rows[0].current_schema
    );
  } catch (err) {
    console.error("❌ Error connecting to PostgreSQL database: ", err);
  }
};

// Optional: Close the database connection (useful in cleanup/exit process)
export const disconnectFromDatabase = async () => {
  try {
    await client.end();
    console.log("✅ Disconnected from database.");
  } catch (err) {
    console.error("❌ Error disconnecting from PostgreSQL database: ", err);
  }
};
