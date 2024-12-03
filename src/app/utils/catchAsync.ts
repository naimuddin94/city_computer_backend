import { NextFunction, Request, RequestHandler, Response } from "express";
import { JwtPayload } from "jsonwebtoken";

const catchAsync =
  (requestHandler: RequestHandler) =>
  (req: Request & { user?: JwtPayload }, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };

export default catchAsync;
