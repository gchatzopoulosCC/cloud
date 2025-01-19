const validateOwnership = async (req, res, next) => {
    /*
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }*/

    if (req.params.id !== req.user.settingsId) {
        return res.status(403).json({ message: "Forbidden" });
    }

    next();
}

module.exports = validateOwnership;