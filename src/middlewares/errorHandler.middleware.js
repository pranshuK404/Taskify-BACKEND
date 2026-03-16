const errorHandler = (err, req, res, next) => {

  const statusCode = err.statusCode || 500

  console.error("Error:", err.message)
  console.error("Stack:", err.stack)

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
    data: null,
    path: req.originalUrl,
    method: req.method,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  })

}

export { errorHandler }

