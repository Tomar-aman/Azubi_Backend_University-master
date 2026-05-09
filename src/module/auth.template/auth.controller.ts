import { type Request, type Response } from "express";
import { UserService } from "../user.template/user.service";
import {
  type JwtAccessTokenPayload,
  type JwtRefreshTokenPayload,
} from "./auth.types";
import { type UserSession } from "src/models/session";
import { AuthService } from "./auth.service";
class AuthController {
  private readonly userService: UserService;
  private readonly authService: AuthService;
  constructor() {
    this.userService = new UserService();
    this.authService = new AuthService();
  }

  public createUser = async (req: Request, res: Response) => {
    try {
      const user = await this.userService.create(req.body);
      res.sendCreated201Response("User created successfully", user);
    } catch (error) {
      res.sendErrorResponse("Error creating user", error);
    }
  };

  public loginUser = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await this.userService.findOneWithOptions({ email });
      if (!user) {
        res.sendNotFound404Response("User not found", null);
        return;
      }
      const isPasswordMatch = await user.comparePassword(password);
      if (!isPasswordMatch) {
        res.sendUnauthorized401Response("Incorrect password", null);
        return;
      }
      const payload: UserSession = {
        userAgent: req.headers["user-agent"] ?? "",
        ipAddress: req.ip ?? "",
        userId: user._id,
      };
      const session = await this.userService.createSession(payload);
      const accessTokenPayload: JwtAccessTokenPayload = {
        sessionId: session._id,
      };
      const refreshTokenPayload: JwtRefreshTokenPayload = {
        sessionId: session._id,
      };
      const accessToken =
        this.authService.createAccessToken(accessTokenPayload);
      const refreshToken =
        this.authService.createRefreshToken(refreshTokenPayload);
      res.sendCreated201Response("Login successful", {
        accessToken,
        refreshToken,
      });
    } catch (error) {
      res.sendErrorResponse("Error during login", error);
    }
  };

  public generateAccessTokenFromRefreshToken = async (
    req: Request,
    res: Response,
  ) => {
    try {
      const { token } = req.body;
      const accessToken = await this.authService.getAccessTokenFromRefreshToken(
        token as string,
      );
      if (!accessToken) {
        res.sendUnauthorized401Response(
          "Refresh token expired. Please re-authenticate to generate a new token.",
          {},
        );
      } else {
        res.sendSuccess200Response("New access token generated successfully.", {
          accessToken,
        });
      }
    } catch (error) {
      res.sendErrorResponse("Error code 101", error);
    }
  };
}

export default AuthController;
