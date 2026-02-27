const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Token requerido"
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token inválido"
    });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user.rol !== 1) {
    return res.status(403).json({
      message: "Acceso solo para administradores"
    });
  }
  next();
};

exports.isInstructor = (req, res, next) => {
  if (req.user.rol !== 2) {
    return res.status(403).json({
      message: "Acceso solo para instructores"
    });
  }
  next();
};

exports.hasRole = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({
        message: "No tienes permisos para esta acción"
      });
    }
    next();
  };
};
