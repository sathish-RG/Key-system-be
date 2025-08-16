module.exports = function allowRoles(roles) {
  return (req, res, next) => {
    // User must be authenticated first
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: User not authenticated" });
    }

    // Role must be allowed
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
    }

    next();
  };
};
