import { Router, Request, Response } from "express";
import { client } from "../config/db";
const fs = require("fs");
const path = require("path");

const router = Router();

const performDatabaseReset: any = async (req: Request, res: Response) => {
  try {
    // read sql queries from file
    const sql = fs.readFileSync(
      path.resolve("../database/InsertQueries.sql"),
      "utf8"
    );

    // Podział na bloki według pustych linii między sekcjami
    const queries = sql.split(/\n\s*\n/);

    for (let i = 0; i < queries.length; i++) {
      const query = queries[i].trim();

      if (query.startsWith("--")) {
        console.log(`Pominięto blok komentarza: \n${query}\n`);
        continue;
      }

      console.log(`Wykonuję zapytanie ${i + 1}:\n${query}\n`);
      await client.query(query);
    }

    return res
      .status(200)
      .json({ message: "Pomyślnie zresetowano bazę danych" });
  } catch (err) {
    return res.status(500).json({
      error: err instanceof Error ? err.message : "Error during db reset.",
    });
  }
};

// definitions of all routes
router.get("/reset", performDatabaseReset);

export default router;
