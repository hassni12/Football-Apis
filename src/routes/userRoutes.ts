import express from "express";
import {
  listAll,
  editUser,
  deleteUser,
  createUser,
  ScoreAssign,
  GetAllUserWithPayment,
  PaymentMethodUpdate,GetPlayersWithTheirScore,updateScore
} from "../controller/User.controller";
// checkRole
import { CreateAdminUser1547919837483 } from "../migration/1549202832774-CreateAdminUser";
import { protect } from "../middleware/tokenMiddlerware";
import { checkRole } from "../middleware/checkRole";
const router = express.Router();
// get all user
router.get("/", [protect, checkRole(["ADMIN"])], listAll);

// edit user with id
router.patch("/:id([0-9]+)", [protect, checkRole(["ADMIN"])], editUser);

//  create coach and admin
router.post("/coach", [protect, checkRole(["ADMIN"])], createUser);

// delete user
router.delete("/:id([0-9]+)", [protect, checkRole(["ADMIN"])], deleteUser);

// player with their payment
router.get(
  "/payment",
  [protect, checkRole(["ADMIN"])],
  GetAllUserWithPayment
);

// payment update by admin
router.patch(
  "/payment/:id([0-9]+)",
  [protect, checkRole(["ADMIN"])],
  PaymentMethodUpdate
);

// get player with their score
router.get(
  "/score",
  [protect, checkRole(["COACH"])],
  GetPlayersWithTheirScore
);
// update score

router.patch(
  "/score/:id([0-9]+)",
  [protect, checkRole(["COACH"])],
  updateScore
);
//  post score to player with
router.post(
  "/score/:id([0-9]+)",
  [protect, checkRole(["COACH"])],
  ScoreAssign
);

export default router;
