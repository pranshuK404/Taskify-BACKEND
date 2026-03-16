import { Router } from "express"
import { ApiResponse } from "../utils/apiResponse.js"

const router = Router()

router.get("/", (req, res) => {
  res
    .status(200)
    .json(new ApiResponse(200, null, "Taskify API is running"))
})

export default router

