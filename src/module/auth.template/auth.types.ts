import { type JwtPayload } from "jsonwebtoken";

export interface CreateSessionType {
  email: string;
  password: string;
  ip: string;
  userAgent: string;
}

export interface JwtRefreshTokenPayload {
  sessionId: string;
}

export interface JwtAccessTokenPayload extends JwtRefreshTokenPayload {}

export interface JwtRefreshTokenClaims
  extends JwtRefreshTokenPayload,
    JwtPayload {}
export interface JwtAccessTokenClaims
  extends JwtAccessTokenPayload,
    JwtPayload {}
