import { Role } from "@prisma/client";
import { Router } from "express";

export interface IErrorSource {
  path: string | number;
  message: string;
}

export interface IRoutes {
  path: string;
  route: Router;
}

export interface IRefreshTokenPayload {
  userId: string;
}

export interface IAccessTokenPayload extends IRefreshTokenPayload {
  email: string;
  role: Role;
  image: string | null;
  name: string;
}

export interface IMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
