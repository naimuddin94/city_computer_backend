import jwt from "jsonwebtoken";
import config from "../config";
import { IAccessTokenPayload, IRefreshTokenPayload } from "../types";

const accessToken = (payload: IAccessTokenPayload) => {
  return jwt.sign(payload, config.jwt_access_secret as string, {
    expiresIn: config.jwt_access_expires_in,
  });
};

const refreshToken = (payload: IRefreshTokenPayload) => {
  return jwt.sign(payload, config.jwt_refresh_secret as string, {
    expiresIn: config.jwt_refresh_expires_in,
  });
};

export default { accessToken, refreshToken };
