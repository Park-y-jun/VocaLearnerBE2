import { RequestHandler, Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { BadRequest, Unauthorized, Forbidden, NotFound } from "../utils/errors/error";

interface UserPayload {
  key: string;
}

export const verifyToken: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      next(new Unauthorized("invalid_authorization"));
    }
    const [bearer, token] = authorization!.split(" ");
    const bearerSet = new Set(["Bearer", "bearer", "BEARER"]);

    if (!bearerSet.has(bearer)) {
      next(new Unauthorized("invalid_bearer"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    if (typeof decoded === "string") {
      next(new Unauthorized("Invalid token format"));
    } else {
      (req as any).user = decoded as UserPayload;
    }

    next();
  } catch (err) {
    if (err instanceof Error && err.name === "TokenExpiredError") {
      next(new Unauthorized("Token Expired"));
    } else {
      next(new Unauthorized("invalid_credentials"));
    }
  }
};

