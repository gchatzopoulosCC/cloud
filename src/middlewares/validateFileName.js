const validateFileName = (req, res, next) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).send({
            message: "name required!",
        });
    }

    // Check if the name contains only letters, numbers, parentheses, underscores, and dots
    const regex = /^[a-zA-Z0-9_().]+$/;
    if (!regex.test(name)) {
        return res.status(400).send({
            message: "Invalid characters! You can use only latin letters, numbers, parentheses, underscores, and dots",
        });
    }

    next();
};

module.exports = validateFileName;