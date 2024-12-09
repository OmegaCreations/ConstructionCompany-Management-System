import { Client } from "pg";

// database client
const client = new Client({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
});

// finding user with given email address
export const findUserByEmail = async (email: string) => {
  const query = "SELECT * FROM pracownik WHERE email = $1";
  const result = await client.query(query, [email]);
  return result.rows[0];
};
