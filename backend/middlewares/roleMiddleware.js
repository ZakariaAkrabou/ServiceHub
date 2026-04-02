export const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin only" });
  }
  next();
};

export const isProvider = (req, res, next) => {
  if (!req.user || req.user.role !== "service_provider") {
    return res.status(403).json({ message: "Access denied. Provider only" });
  }
  next();
};
export const isCustomer = (req, res, next) => {
  if (!req.user || req.user.role !== "customer") {
    return res.status(403).json({ message: "Access denied. Customers only." });
  }
  next();
};