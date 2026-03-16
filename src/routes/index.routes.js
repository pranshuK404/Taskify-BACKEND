import { Router } from "express"
const router = Router()

// -----------Importing Routes----------------
import healthRoutes from "./healthcheck.routes.js"
  

// -----------Mounting Routes----------------
router.use("/health", healthRoutes)

export default router
