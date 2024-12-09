import { Request, Response } from "express";
import { loginUser } from "../services/authService";

// controller for logging in user
export const userLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // checks if any data is passed
  if (!email || !password) {
    res.status(401).json({ error: "Invalid credentials" });
  }

  // tries to log in with credentials
  try {
    const { token } = await loginUser(email, password);
    res.json({ token });
  } catch (err) {
    res
      .status(401)
      .json({ error: err instanceof Error ? err.message : "Unauthorized" });
  }
};
