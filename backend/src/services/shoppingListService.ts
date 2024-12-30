import * as shoppingListModel from "../models/shoppingListModel";
import { Zakupy } from "../utils/types";

// ================================
//        GET REQUESTS
// ================================

// Gets shopping list for specific date (month)
export const getShoppingList = async (data: string) => {
  return (await shoppingListModel.findByDate(data)) as Zakupy[];
};
