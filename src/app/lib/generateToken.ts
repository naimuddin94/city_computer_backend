import jwt from "jsonwebtoken";
import config from "../config";

interface IRefreshTokenPayload {
  userId: string;
}

interface IAccessTokenPayload extends IRefreshTokenPayload {
  email: string;
  role: string;
}

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
