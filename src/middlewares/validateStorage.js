const userService = require('../services/userService');

const validateStorage = (req, res, next) => {
    const userId = req.params.id;
    const user = userService.getById(userId);
    if (!user) {
        return res.status(404).send({
            message: "User not found!",
        });
    }
    const userStorage = user.storage;
    const plan = user.plan;
    console.log("Plan: ", plan);
    const file = req.file;
    const fileSize = file.size;

    // Get plan storage
    let planStorage;
    if (plan === "free") {
        // 500MB
        planStorage = 500 * 1024 * 1024;
    } else if (plan === "premium") {
        // 10 GB
        planStorage = 10 * 1024 * 1024 * 1024;
    } else {
        return res.status(400).json({ message: "Invalid plan!" });
    }

    // Check if the user has enough storage
    if (userStorage + fileSize > planStorage) {
        return res.status(400).send({
            message: "Not enough storage!",
        });
    }
    next();
};

module.exports = validateStorage;