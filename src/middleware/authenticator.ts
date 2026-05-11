import { type Request, type Response, type NextFunction } from "express";
import JwtService from "../utils/jwt";
import { UserService } from "../module/user.template/user.service";
import { type JwtAccessTokenClaims } from "../module/auth.template/auth.types";
import logger from "../utils/logger";
import { managedUserModel, managedEmployeeModel } from "../models/index";

class AuthMiddleware {
  private readonly jwtService = new JwtService();
  private readonly userService: UserService;
  constructor() {
    this.userService = new UserService();
  }

  verifyToken = async (req: Request, _: Response, next: NextFunction) => {
    try {
      // Check if the Authorization header is present
      const authHeader = req.headers.authorization;
      if (authHeader) {
        // Extract the token and remove the "Bearer" prefix
        const token = authHeader.split(" ")[1];
        // Verify the token using JwtService
        const decodedToken = this.jwtService.verify(
          token,
        ) as JwtAccessTokenClaims;
        const session = await this.userService.getUserSessionDetails({
          _id: decodedToken.sessionId,
          isValidSession: true,
        });
        if (session) {
          // 1) Try main User model
          let user: any = await this.userService.findById(session?.userId);

          // 2) Fallback to ManagedUser model
          if (!user) {
            user = await managedUserModel.findById(session?.userId);
          }

          // 3) Fallback to ManagedEmployee model
          if (!user) {
            user = await managedEmployeeModel.findById(session?.userId);
          }

          if (user) {
            req.user = user;
          }
        }
      }
      next();
    } catch (error) {
      // Token verification failed
      next();
      logger.error("verifyToken", error);
    }
  };

  requireUser = async (req: Request, res: Response, next: NextFunction) => {
    if (req.user) {
      next();
    } else {
      res.sendUnauthorized401Response("Unauthorized", null);
    }
  };
}

export default AuthMiddleware;
