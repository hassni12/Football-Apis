import { User } from "../entity/user.entity";
import { getRepository } from 'typeorm';
import { Request, Response } from "express";


export const PublicScore = async (req: Request, res: Response) => {

    const userRepository = getRepository(User);
    const user = await userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.scores", "score")
      .select('AVG(score.pac)', 'averageScore')
      .orderBy("score.id", "DESC")
      .getRawMany()

  console.log(user)
  if (user) {
  
      return res.status(200).send({ data: user, success: true, message: "" });
    } else {
      return res
        .status(401)
        .send({ message: "not any player", success: false, data: [] });
    }
  };
  