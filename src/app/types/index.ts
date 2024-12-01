import { Router } from "express";

export interface IErrorSource {
  path: string | number;
  message: string;
}

export interface IRoutes {
  path: string;
  route: Router;
}
