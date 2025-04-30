import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export  const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.body.token;
  if (!token) {
    res.status(401).json({
      msg: "Token is not avilable or expired",
    });
    return;
  }
  const isValidToken = jwt.verify(token, "deepa@123");
  if (!isValidToken) {
    res.status(401).json({
      msg: "Provided token is invalid",
    });
    return;
  }
  const userId = jwt.decode(token);
  console.log(userId);
  next();

};
