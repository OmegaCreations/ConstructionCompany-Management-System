import { Request, Response } from "express";
import * as shoppingListService from "../services/shoppingListService";
import { Zakupy } from "../utils/types";

// ================================
//        GET REQUESTS
// ================================

// Returns shopping list for specific date (month)
export const getShoppingList: any = async (req: Request, res: Response) => {
  const { year, month, day } = req.params;

  if (!year || !month || !day) {
    return res.status(400).json({ error: "Invalid credentials." });
  }

  const data = `${month}-${day}-${year}`;

  try {
    const shoppingListData: Zakupy[] =
      await shoppingListService.getShoppingList(data);
    return res.status(200).json(shoppingListData);
  } catch (err) {
    res.status(500).json({
      error:
        err instanceof Error
          ? err.message
          : "Error during fetching shopping list data.",
    });
  }
};
