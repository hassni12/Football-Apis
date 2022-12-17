import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/user.entity";

export const checkRole = (roles: Array<string>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const id = res.locals.id;
    const userRepository = getRepository(User);

    const user = await userRepository.findOneOrFail(id);

    console.log(roles, "roles");
    if (roles.indexOf(user.role) > -1) next();
    else res.status(401).send({message:"you are not a admin",success:false,data:[]});
  };
};
