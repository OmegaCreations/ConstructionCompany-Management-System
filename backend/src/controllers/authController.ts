import { Request, Response } from "express";
import * as authService from "../services/authService";

// controller for logging in user
export const userLogin: any = async (req: Request, res: Response) => {
  const { email, haslo } = req.body;

  // checks if any data is passed
  if (!email || !haslo) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // tries to log in with credentials
  try {
    const { token, refreshToken, role, pracownik_id } =
      await authService.loginUser(email, haslo);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // You cant access it from JS code
      secure: false, // HTTPS only / i dont have secure connection
      sameSite: "strict", // doesnt send cookie to other domains
      maxAge: 7 * 24 * 60 * 60 * 1000, // TTL 7days
    });

    res.json({ token, role, user_id: pracownik_id });
  } catch (err) {
    res
      .status(401)
      .json({ error: err instanceof Error ? err.message : "Unauthorized" });
  }
};

// refreshes access token
export const refreshToken: any = async (req: any, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ error: "No refresh token provided" });
  }

  try {
    const token = authService.refreshToken(refreshToken);

    res.status(200).json(token);
  } catch (err) {
    res.status(403).json({ error: "Invalid or expired refresh token" });
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
    await authService.updatePassword(userId, currentPassword, newPassword);
    res.status(200).json({ message: "Password has been changed." });
  } catch (err) {
    res.status(500).json({
      error:
        err instanceof Error ? err.message : "Error during changing password",
    });
  }
};
