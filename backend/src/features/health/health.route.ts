import { Router } from "express";

import { keepServerAlive } from "./health.controller";

const healthRouter = Router();

// GET /api/v1/health/keep-server-alive

healthRouter.get("/keep-server-alive", keepServerAlive);

export default healthRouter;
