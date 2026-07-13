import type { Request, Response, NextFunction } from "express";

export const keepServerAlive = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    return res.status(200).json({
      message: "Server is up and running.",
    });
  } catch (error) {
    next(error);
  }
};
