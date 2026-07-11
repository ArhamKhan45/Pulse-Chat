import type { ErrorRequestHandler } from "express";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error("Error:", err);

  let statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || "Internal Server Error";

  // =========================
  // Mongoose
  // =========================

  // Invalid ObjectId
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource id.";
  }

  // Validation Error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values((err as any).errors)
      .map((e: any) => e.message)
      .join(", ");
  }

  // Duplicate Key. MongoServerError: E11000 duplicate key error collection: users
  // index: clerkId_1 dup key: { clerkId: "user_123" }

  if ((err as any).code === 11000) {
    statusCode = 409;

    const field = Object.keys((err as any).keyValue ?? {})[0];

    message = field ? `${field} already exists.` : "Duplicate resource.";
  }

  // =========================
  // Clerk
  // =========================

  if (err.name === "ClerkAPIResponseError") {
    statusCode = 401;
    message = "Authentication failed.";
  }

  // =========================
  // JWT
  // =========================

  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token.";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired.";
  }

  // =========================
  // Syntax Error (Bad JSON)
  // =========================

  if (err instanceof SyntaxError) {
    statusCode = 400;
    message = "Invalid JSON payload.";
  }

  // =========================
  // Unknown Errors
  // =========================

  if (!err.message) {
    message = "Something went wrong.";
  }

  res.status(statusCode).json({
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
      error: err,
    }),
  });
};

// if status code is 200 and we still hit the error handler that means it's an internal error
// so we set the status code as 500
