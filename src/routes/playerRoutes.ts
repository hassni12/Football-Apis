import express from "express";
import {Login, Logout, Register,AuthenticatedUser,AuthenticatedUserScore,PaymentMethodUpdate,Test,PaymentInfo} from "../controller/UsersAuth.controller";
// protect
import { CreateAdminUser1547919837483 } from '../migration/1549202832774-CreateAdminUser';
import { protect } from '../middleware/tokenMiddlerware';
const router = express.Router();

    router.post('/register',Register);
    router.post('/login', Login);
    
    router.get('/',protect,AuthenticatedUser);
    router.get('/get_score',protect,AuthenticatedUserScore)
    router.get('/info',protect,PaymentInfo);
    router.patch('/payment/:id([0-9]+)',protect,PaymentMethodUpdate);
    router.get('/test',protect,Test);
    router.post('/logout',Logout);


    // router

export default router