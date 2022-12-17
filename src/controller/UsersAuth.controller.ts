import { Request, Response } from "express";
import { getRepository, MoreThanOrEqual } from "typeorm";
import { User } from "../entity/user.entity";
import generateToken from "../utils/generateToken";
import { Payment } from "../entity/payment.entity";
export const Register = async (req: Request, res: Response) => {
  const {
    name,
    email,
    password,
    comparepassword,
    avatar,
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
      message: "must fill all details of player",
      success: false,
      data: [],
    });
  }
  const UserExists = await getRepository(User).findOne({ email });
  if (UserExists) {
    return res.status(401).json({
      message: "Player already exist",
      success: false,
      data: [],
    });
  }
  const userRepository = getRepository(User);

  let player = new User();
  (player.name = name),
    (player.email = email),
    (player.password = password),
    (player.avatar = avatar),
    (player.date_of_birth = date_of_birth),
    (player.nic = nic),
    (player.role = role),
    (player.approve_status = approve_status);

  player.hashPassword();
  // if ()

  let user;
  try {
    user = await userRepository.save(player);
  } catch (e) {
    return res
      .status(409)
      .send({ message: "username already in use", success: false, data: [] });
    // return ;
  }
  // console.log(user.createdAt.toISOString());

  try {
    await userRepository
      .createQueryBuilder("user")
      .insert()
      .into(Payment)

      .values([
        { user },
        { user },
        { user },
        { user },
        { user },
        { user },
        { user },
        { user },
        { user },
        { user },
        { user },
        { user },
      ])
      .execute();
  } catch (error) {
    return res
      .status(201)
      .json({ message: `${error} Register`, success: false, data: [] });
  }

  //If all ok, send 201 response
  return res
    .status(201)
    .json({ message: `${user.role} Register`, success: true, data: [] });
  // res.status(201).json({ data: player });
};
export const Login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log(req.headers);

  if (!(email && password)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Email or Password", data: [] });
  }

  const userRepository = getRepository(User);
  let player = await userRepository.findOne({ where: { email } });
  if (!player) {
    return res.status(400).send({
      message: "Invalid credentials",
      success: false,
      data: [],
    });
  }

  if (!player.checkIfUnencryptedPasswordIsValid(password)) {
    return res
      .status(401)
      .send({ success: false, message: "Invalid Email or Password", data: [] });
    // return;
  }
  if (!player.approve_status)
    return res.status(400).json({
      success: false,
      message: "email not been approved by admin",
      data: [],
    });

  // generate token
  return res.send({
    message: "",
    data: [
      {
        name: player.name,
        avtar: player.avatar,
        email: player.email,
        role: player.role,
        token: generateToken({ id: player.id }),
      },
    ],
    success: true,
  });
};

export const AuthenticatedUser = async (req: Request, res: Response) => {
  console.log(res.locals.id.id, "authenticatedUser");
  const user = await getRepository(User).findOne({ id: res.locals.id.id });
  if (user) {
    return res.status(200).send({ data: [user], success: true, message: "" });
  } else {
    return res
      .status(401)
      .send({ message: "not authenticated", success: false, data: [] });
  }
};

export const AuthenticatedUserScore = async (req: Request, res: Response) => {
  console.log(res.locals.id.id, "authenticatedUser");
  const userRepository = getRepository(User);
  const user = await userRepository
    .createQueryBuilder("user")
    .leftJoinAndSelect("user.scores", "score")
    .where("user.id = :id", { id: res.locals.id.id })
    .orderBy('score.createdAt', 'DESC')
    .getOne();

if (user) {
    return res.status(200).send({ data: [user], success: true, message: "" });
  } else {
    return res
      .status(401)
      .send({ message: "not authenticated", success: false, data: [] });
  }
};




export const PaymentInfo = async (req: Request, res: Response) => {
  console.log(res.locals.id.id, "authenticatedUser");
  const { year } = req.body;
  const userRepository = getRepository(User);
  const user = await userRepository
    // user!.payments!.length
    .createQueryBuilder("user")
    .leftJoinAndSelect("user.payments", "payment")
    .where("user.id = :id", { id: res.locals.id.id })
    .getOne();

  let arr = user!.payments!.length;
  let i = 0;
  while (i < arr) {
    console.log(user?.payments[i]!.createdAt!.getFullYear());
    i++;
  }

  if (!(user?.payments[0]!.createdAt!.getFullYear() === year)) {
    try {
      await userRepository
        .createQueryBuilder("user")
        .insert()
        .into(Payment)
        .values([
          { user },
          { user },
          { user },
          { user },
          { user },
          { user },
          { user },
          { user },
          { user },
          { user },
          { user },
          { user },
        ])
        .execute();
    } catch (error) {
      return res
        .status(201)
        .json({ message: `${error} Register`, success: false, data: [] });
    }
  }

  if (user) {
    return res
      .status(200)
      .send({ data: user!.payments, success: true, message: "" });
  } else {
    return res
      .status(401)
      .send({ message: "not authenticated", success: false, data: [] });
  }
};

export const PaymentMethodUpdate = async (req: Request, res: Response) => {
  const { message, reference, from, to,isPaid, total_price} = req.body;
  console.log(res.locals.id.id);
  try {
    const userRepository = getRepository(User);
    const user = await userRepository.findOne({ id: res.locals.id.id });
    if (!user)
    return res
      .status(400)
      .send({ message: `${user} user not found`, success: false, data: [] });
 
    const paymentRepository=getRepository(Payment);
    const payment= await paymentRepository.findOne({ id: +req.params.id });
    if (!payment)
    return res
      .status(400)
      .send({ message: `${payment} payment not found`, success: false, data: [] });
 
    // let player = new Payment();
    (payment!.message = message||payment!.message),
      (payment!.from = from||payment!.from),
      (payment!.reference = reference||payment!.reference),
      (payment!.to = to||payment!.to),
      (payment!.total_price = total_price||payment!.total_price),
      (payment!.isPaid = isPaid||payment!.isPaid),
      (payment!.user = user!);
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
    let playerWithPayment = await userRepository
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.payments", "payment")
      .where("user.id = :id", { id: res.locals.id.id })
      
      .getOne();
    return res.send({
      data: playerWithPayment!.payments,
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

export const Test = async (req: Request, res: Response) => {
  // req.headers.authorization?.replace(`Bearer `, " ");
  console.log(res.locals.id.id);
  const userRepository = getRepository(User);
  let playerWithPayment = await userRepository
    .createQueryBuilder("user")
    .leftJoinAndSelect("user.payments", "payment")
    .where("user.id = :id", { id: res.locals.id.id })
    // .orderBy('u', 'ASC')
    .getOne();
  let arr = playerWithPayment!.payments!.length;
  // console.log(arr);
  for (let i = 0; i < arr; i++) {
    console.log(playerWithPayment?.payments[i].createdAt.getFullYear());
  }
  // console.log(playerWithPayment);
  return res.send({
    data: playerWithPayment?.payments[1].createdAt.getFullYear(),
    message: "success",
  });
};

export const Logout = async (req: Request, res: Response) => {
  req.headers.authorization?.replace(`Bearer `, " ");

  res.send({
    message: "success",
  });
};
