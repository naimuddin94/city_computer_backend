/*
 * Title: City Computer
 * Description: A backend application with express, prisma and postgres
 * Author: Md Naim Uddin
 * Date: 01/12/2024
 *
 */

import cors from "cors";
import express, { Application, Request, Response } from "express";
import { globalErrorHandler, notFound } from "./app/utils";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send({ message: "City Computers server is running :(" });
});

app.use(globalErrorHandler as unknown as express.ErrorRequestHandler);

app.use(notFound);

export default app;