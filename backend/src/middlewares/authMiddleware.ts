import { Response, NextFunction } from "express";
import { verifyToken } from "../services/authService";
import { CompanyRoles, getRoleByPositionId } from "../utils/appTypes";

// middleware for checking JWT
// only used for protected routes
export const authenticateUserJWT: any = (
  req: any, // express doesnt have implementation of user field (pretty unlucky for a small project / TODO: might implement namespaces later)
  res: Response,
  next: NextFunction
) => {
  // http authorization header
  // we want auth header like: "Bearer <token_here>"
  const authHeader = req.headers.authorization;

  // we pass jwt through bearer token!
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" }); // unauthorized access
  }

  // jwt token
  const token = authHeader.split(" ")[1];

  // verify token sent by user
  try {
    const user = verifyToken(token);
    req.user = user; // append user's data to request body (next middlewares or controllers need user's data)
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" }); // unauthorized access
  }
};

// check if user has authorized role for specific route
// !!check CompanyRoles at appTypes.ts for very important auth logic!
export const checkAuthorizedRole: any = (requiredRole: CompanyRoles) => {
  return (req: any, res: Response, next: NextFunction) => {
    const user = req.user; // user should be added before in authenticateUserJWT middleware

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // get user role
    const userRole = getRoleByPositionId(user.stanowisko_id);

    if (userRole !== requiredRole) {
      return res.status(403).json({ error: "Forbidden: Insufficient role" });
    }

    next();
  };
};
