const jwt = require("jsonwebtoken");

function generateToken(userId, username,res) {
    const payload = {
        id: userId,
        username: username
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    res.cookie("jwt", token, {
        httpOnly: true
    });
};

module.exports = {
    generateToken
}