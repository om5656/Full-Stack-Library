const jwt = require("jsonwebtoken");

const authMiddleware = (req,res,next) => {
  const authHeader = req.headers.authorization;
  if(!authHeader) return res.status(401).json({ msg: "Token Required" });
console.log(authHeader);
console.log("----------------------------------");

  const token = authHeader.split(" ")[1];
  console.log(token);
  
  try {
    const payload = jwt.verify(token, process.env.JWT_SK);
    req.user = payload.id;
    req.role = payload.role;
    next();
  } catch(err) {
    return res.status(401).json({ msg: "Invalid Token" });
  }
}

module.exports = authMiddleware;