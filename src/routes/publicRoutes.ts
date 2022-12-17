import express from "express";
import { PublicScore } from "../controller/Public.contoller";
const router = express.Router();

    router.get('/all_players',PublicScore);



    // router

export default router