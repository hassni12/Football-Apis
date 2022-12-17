import { Request, Response } from "express";
import { createQueryBuilder, getRepository } from "typeorm";
import { validate } from "class-validator";
// createQueryBuilder
import { User } from "../entity/user.entity";
import { Score } from "../entity/score.entity";
import { Payment } from "../entity/payment.entity";

// get list of users
export const listAll = async (req: Request, res: Response) => {
  //Get users from database
  const userRepository = getRepository(User);
  let user;
  try {
    user = await userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.payments", "payment")
      .leftJoinAndSelect("user.scores", "score")
      .getMany();
    return res.send({ data: user, success: true, message: "success" });
  } catch (error) {
    return res.send({ data: [], success: false, message: "" });
  }
};

// edit user
export const editUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  console.log(id, "id");
  const { name, email, role, approve_status ,date_of_birth,avatar} = req.body;
  const userRepository = getRepository(User);
  let user;
  try {
    user = await userRepository.findOneOrFail(id);
  } catch (error) {
    //If not found, send a 404 response
    return res
      .status(404)
      .send({ message: "User not found", success: false, data: [] });
  }

  user.name = name || user.name;
  user.email = email|| user.email;
  user.avatar = avatar||user.avatar;
  user.date_of_birth = date_of_birth|| user.date_of_birth;
  user.approve_status = approve_status|| user.approve_status;
  user.role = role|| user.role;
  const errors = await validate(user);
  console.log(errors, "errors");
  if (errors.length > 0) {
    return res.status(400).send(errors);
  }
  try {
    await userRepository.save(user);
  } catch (e) {
    return res
      .status(409)
      .send({ message: "user not updated", success: false, data: [] });
  }
  //After all send a 204 (no content, but accepted) response
  return res
    .status(204)
    .send({ message: "user update", success: true, data: [user] });
};

// delete user
export const deleteUser = async (req: Request, res: Response) => {
  const id = +req.params.id;

  const userRepository = getRepository(User);
  // let user: User;
  try {
    await userRepository
      .createQueryBuilder("user")
      .delete()
      .from(User)
      .where("id = :id", { id: id })
      .execute();
    return res
    .status(204)
    .send({ success: true, data: [], message: "user deleted" });
  
  } catch (error) {
    return res
      .status(404)
      .send({ message: "User not found", success: false, data: [] });
  }
  };

// create new coach and admin
export const createUser = async (req: Request, res: Response) => {
  const {
    name,
    email,
    password,
    comparepassword,
    // avatar,
    nic,
    role,
    date_of_birth,
    approve_status,
  } = req.body;

  if (password !== comparepassword) {
    return res
      .status(400)
      .json({ message: "password not match", success: false, data: [] });
  }
  if (!(name && password && email)) {
    return res.status(400).json({
      message: "must fill all details of user",
      success: false,
      data: [],
    });
  }

  const UserExists = await getRepository(User).findOne({ email });
  if (UserExists) {
    return res.status(401).json({
      message: "User already exist",
      success: false,
      data: [],
    });
  }
  let coach = new User();
  (coach.name = name),
    (coach.email = email),
    (coach.password = password),
    // (coach.avatar = avatar),
    (coach.date_of_birth = date_of_birth),
    (coach.nic = nic),
    (coach.role = role),
    (coach.approve_status = approve_status);

  coach.hashPassword();
  const userRepository = getRepository(User);
  let user;
  try {
    user = await userRepository.save(coach);
  } catch (e) {
    return res
      .status(409)
      .send({ message: "coach not get", success: false, data: [] });
  }
  //If all ok, send 201 response
  return res.status(201).json({
    message: `${user.role} Register`,
    success: true,
    data: [user.name],
  });
};

// get score with player 
export const GetPlayersWithTheirScore = async (req: Request, res: Response) => {

  try {
    const userRepository = getRepository(User);
    let playerWithScore = await userRepository

      .createQueryBuilder("user")
      .leftJoinAndSelect("user.scores", "score")
      .where("user.role!= 'ADMIN' ")
      .andWhere("user.role!= 'COACH' ")
      // .where("user.id = :id", { id: id })
      .getMany();
    console.log(playerWithScore);
    return res.send({
      data: playerWithScore,
      message: "success",
      success: true,
    });
  } catch (error) {
    return res.send({
      data: [],
      message: `${error} not get user`,
      success: false,
    });
  }
};
// update score

export const updateScore= async (req: Request, res: Response) => {
  const { pac, sho, das, dri, def, phy } = req.body;
  // console.log(res.locals.id.id);
  const id = +req.params.id;
  console.log(id);
  try {

    const scoreRepository = getRepository(Score);
    const score = await scoreRepository.findOne({ id: id });

    // console.log(payment);
    (score!.sho = sho||score!.sho),
    (score!.pac = pac||score!.pac),
    (score!.das = das||score!.das),
    (score!.dri = dri||score!.dri),
    (score!.def = def||score!.def),
    (score!.phy = phy||score!.phy)
    // (score!.user = user);
    //  (payment!.user = user);
    try {
      await scoreRepository.save(score!);
    } catch (error) {
      return res.status(409).send({
        message: `${error} score not correct`,
        success: false,
        data: [],
      });
    }
    // await paymentRepository.save(player);
    let playerWithScore = await scoreRepository
      .createQueryBuilder("score")
      // .leftJoinAndSelect("payment.user", "user")
      .where("score.id = :id", { id: id })
      .getOne();
    return res.send({
      data: [playerWithScore],
      message: "success",
      success: true,
    });
  } catch (error) {
    return res.send({
      data: [],
      message: `${error} not get score`,
      success: false,
    });
  }
};

// coach assign score to player
export const ScoreAssign = async (req: Request, res: Response) => {
  const { pac, sho, das, dri, def, phy } = req.body;
  // console.log(typeof(+req.params.id));
  let id = +req.params.id;

  console.log(id);
  try {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ id: id });
    if (!user)
      return res
        .status(400)
        .send({ message: `${user} user not found`, success: false, data: [] });
    console.log(user);
    const scoreRepository = getRepository(Score);
    let score = new Score();
    (score.sho = sho),
      (score.pac = pac),
      (score.das = das),
      (score.dri = dri),
      (score.def = def),
      (score.phy = phy),
      (score.user = user);

    try {
      await scoreRepository.save(score);
    } catch (error) {
      return res
        .status(409)
        .send({
          message: `${error} score not saved`,
          success: false,
          data: [],
        });
    }

    let playerWithScore = await userRepository
      // // .getRepository(User)
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.scores", "score")
      // .where("user.role!= 'ADMIN' ")
      // .andWhere("user.role!= 'COACH' ")
      .where("user.id = :id", { id: id })
      .getMany();
    console.log(playerWithScore);
    return res.send({
      data: [playerWithScore],
      message: "success",
      success: true,
    });
  } catch (error) {
    return res.send({
      data: [],
      message: `${error} not get user`,
      success: false,
    });
  }
};

export const PaymentMethodUpdate = async (req: Request, res: Response) => {
  const { isApproved } = req.body;
  // console.log(res.locals.id.id);
  const id = +req.params.id;
  console.log(id);
  try {

    const paymentRepository = getRepository(Payment);
    const payment = await paymentRepository.findOne({ id: id });

    console.log(payment);
    (payment!.isApproved = isApproved||payment!.isApproved);
    //  (payment!.user = user);
    try {
      await paymentRepository.save(payment!);
    } catch (error) {
      return res.status(409).send({
        message: `${error} payment not correct`,
        success: false,
        data: [],
      });
    }
    // await paymentRepository.save(player);
    let playerWithPayment = await paymentRepository
      .createQueryBuilder("payment")
      // .leftJoinAndSelect("payment.user", "user")
      .where("payment.id = :id", { id: id })
      .getOne();
    return res.send({
      data: [playerWithPayment],
      message: "success",
      success: true,
    });
  } catch (error) {
    return res.send({
      data: [],
      message: `${error} not get user`,
      success: false,
    });
  }
};
//  GET ALL USER WITH THEIR PAYMENT 
export const GetAllUserWithPayment = async (req: Request, res: Response) => {
  //Get users from database
  const userRepository = getRepository(User);
  let user;
  try {
    user = await userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.payments", "payment")
      .where("user.role!= 'ADMIN' ")
      .andWhere("user.role!= 'COACH' ")
      // .leftJoinAndSelect("user.scores", "score")
      .getMany();
    return res.send({ data: user, success: true, message: "success" });
  } catch (error) {
    return res.send({ data: [], success: false, message: "" });
  }
};
