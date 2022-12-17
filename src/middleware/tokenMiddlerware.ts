import jwt, { decode } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/user.entity";
import config from "../config/config";
import generateToken from "../utils/generateToken";
// generateToken
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      if (!token) {
        return res.status(401).send({
          message: "unauthenticated",
          success: false,
          data: [],
        });
      }

      const decoded: any = jwt.verify(token, config.jwtSecret);
      if (!decoded) {
        return res
          .status(401)
          .send({
            message: `Invalid token or user doesn't exist`,
            success: false,
            data: [],
          });
      }

      console.log(decoded, "decoded");
      // console.log(req, "token auth");
      const user = await getRepository(User).findOne(decoded.id);

      if (!user) {
        return res.status(401).send({
          message: "unauthenticated",
          success: false,
          data: [],
        });
      }
      res.locals.id = decoded.id;
      next();
      //   console.log(req, "req");
    } catch (error) {
      return res
        .status(401)
        .send({ message: "not authenticated", success: false, data: [] });
    }
  } else {
    return res
      .status(401)
      .send({ message: "not authenticated", success: false, data: [] });
  }
};
