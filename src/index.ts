import express from 'express';
import cors from "cors";
import dotenv from "dotenv";
import colors from "colors";
import helmet from "helmet";
import morgan from "morgan"
import {createConnection} from "typeorm";
import playerRoutes from "./routes/playerRoutes";
// PublicScore
import publicRoutes from "./routes/publicRoutes"
import userRoutes from "./routes/userRoutes";

import {notFound,errorHandler} from './middleware/errorMiddleware' 
// import { PublicScore } from './controller/Public.contoller';
createConnection().then(() => {
    console.log("Connected to Mysql"); 
}).catch((error)=>{
console.log(`${error}`)
})

const port = process.env.PORT || 5000;
dotenv.config();
const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet())
app.use(cors(
//     {
//     origin: ['http://localhost:3000', 'http://localhost:8080', 'http://localhost:4200'],
// }
));

app.use("/api/player",playerRoutes)

app.use("/api/public",publicRoutes)
app.use("/api/user",userRoutes)
app.use(notFound);
app.use(errorHandler);
app.listen(port, () => {
    console.log(`successfully connected to ${port}`);
});
