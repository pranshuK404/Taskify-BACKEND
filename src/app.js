import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler.middleware.js"

const app = express()

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(cookieParser())

app.use(express.json({ limit: "16kb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

app.get("/", (req, res) => {
  res.send("Taskify API Running")
})

// -----------Importing Routes----------------
import indexRoutes from "./routes/index.routes.js"  


// -----------Mounting Routes----------------
app.use("/api/v1", indexRoutes)


//-----------Error Handler Middleware----------------
app.use(errorHandler)

export default app
