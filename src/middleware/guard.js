import { cookieExtractor } from "../config/passport.config.js";
import { jwtDecode } from "jwt-decode";

const verificarRol = function (rolesPermitidos) {
  return function (req, res, next) {
  const token = cookieExtractor(req);
  const payload = jwtDecode(token);
  if (payload.rol === rolesPermitidos[0]) {
    next();
  } else {
    res.status(401).send("No tienes permisos suficientes");
  }



};
}

export default verificarRol;