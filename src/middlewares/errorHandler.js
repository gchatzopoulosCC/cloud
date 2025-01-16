const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ message: "Something went wrong", error: err.message });
}

module.exports = errorHandler;