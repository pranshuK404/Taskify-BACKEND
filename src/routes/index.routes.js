import { Router } from "express"
const router = Router()

// -----------Importing Routes----------------
import healthRoutes from "./healthcheck.routes.js"
import authRoutes from "./auth.routes.js"
import projectRoutes from "./project.routes.js"

// -----------Mounting Routes----------------
router.use("/health", healthRoutes)
router.use("/auth", authRoutes) //--auth routes
router.use("/projects", projectRoutes) //--project routes
export default router
