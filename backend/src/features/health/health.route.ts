import { Router } from "express";

import { makeServerAlive } from "./health.controller";

const healthRouter = Router();

// GET /api/v1/health/make-server-alive

healthRouter.get("/make-server-alive", makeServerAlive);

export default healthRouter;
