import express, {NextFunction, Request, Response} from "express";
import * as bodyParser from "body-parser";
import * as dotenv from 'dotenv';
import cors from "cors";

import cookieParser = require("cookie-parser");
import { deliveriesRouter } from "./src/endpoints/deliveries";

dotenv.config();

const port = process.env.APPLICATION_PORT;

export const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

app.use('/', deliveriesRouter);

if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {console.log(`Server is running on ${port}`)});
}