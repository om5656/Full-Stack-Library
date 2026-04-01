const adminMiddleware = (req,res,next) => {
  if(req.role !== "admin") return res.status(403).json({ msg: "Admin Only" });
  next();
 
}

module.exports = adminMiddleware;