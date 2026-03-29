const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
const authHeader = req.headers.authorization;

if (!authHeader) {
return res.status(401).json({ msg: "No token provided" });
}

const token = authHeader.split(" ")[1];

try {
const decoded = jwt.verify(token, process.env.JWT_SK);
req.user = decoded.id;
req.role = decoded.role;
next();
} catch (error) {
return res.status(401).json({ msg: "Invalid token" });
}
};

module.exports = authMiddleware;