import jwt from "jsonwebtoken";
import config from "../config/config";
const generateToken = (id:any) => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: "3d",
  });
};
export default generateToken;

