import { Request, Response } from "express";
import { loginUser, updatePassword } from "../services/authService";

// controller for logging in user
export const userLogin: any = async (req: Request, res: Response) => {
  const { email, haslo } = req.body;

  // checks if any data is passed
  if (!email || !haslo) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // tries to log in with credentials
  try {
    const { token, role } = await loginUser(email, haslo);
    res.json({ token, role });
  } catch (err) {
    res
      .status(401)
      .json({ error: err instanceof Error ? err.message : "Unauthorized" });
  }
};

// changes user's password
export const changeUserPassword: any = async (req: any, res: Response) => {
  const userId = req.user.pracownik_id; // get user id
  const { currentPassword, newPassword } = req.body;

  // check if data is passed properly
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Please provide all the data." });
  }

  try {
    await updatePassword(userId, currentPassword, newPassword);
    res.status(200).json({ message: "Password has been changed." });
  } catch (err) {
    res.status(500).json({
      error:
        err instanceof Error ? err.message : "Error during changing password",
    });
  }
};
