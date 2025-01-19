// TODO: Implement this middleware to check if the user is the owner of the resource
const validateOwnership = async (req, res, next) => {
    // THESE DON'T WORK
    /*
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }*/

    /*
    if (req.params.id !== req.user.settingsId) {
        return res.status(403).json({ message: "Forbidden" });
    }*/

    next();
}

module.exports = validateOwnership;