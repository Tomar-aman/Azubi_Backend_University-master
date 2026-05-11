import { type Request, type Response } from "express";
import { UserService } from "./user.service";
import JwtService from "../../utils/jwt";
import EmailService from "../../utils/emailService";
import logger from "../../utils/logger";
import {
  type JwtAccessTokenPayload,
  type JwtRefreshTokenClaims,
  type JwtRefreshTokenPayload,
} from "../auth.template/auth.types";
import { type UserSession } from "../../models/session";
import { AuthService } from "../auth.template/auth.service";
import { JobService } from "../job.template/job.service";
import { EmployerService } from "../employer.template/employer.service";

class UserController {
  private readonly userService: UserService;
  private readonly jwtService = new JwtService();
  private readonly authService: AuthService;
  private readonly jobService: JobService;
  private readonly employerService: EmployerService;

  constructor() {
    this.jobService = new JobService();
    this.userService = new UserService();
    this.authService = new AuthService();
    this.employerService = new EmployerService();
  }

  public getUser = async (req: Request, res: Response) => {
    try {
      // req.user is populated by verifyToken middleware (works for both User and ManagedUser)
      const user = req.user;
      res.sendSuccess200Response("User fetched successfully", user);
    } catch (error) {
      res.sendErrorResponse("Error fetching user", error);
    }
  };

  public updateProfile = async (req: Request, res: Response) => {
    try {
      const { _id } = req.user;
      const { newPassword, oldPassword, ...otherProfileFields } = req.body;

      await this.userService.updateProfile(
        _id,
        newPassword,
        oldPassword,
        otherProfileFields,
      );

      res.sendSuccess200Response("Profile updated successfully", null);
    } catch (error) {
      res.sendErrorResponse("Error updating profile", error);
    }
  };

  public getForPasswordLink = async (req: Request, res: Response) => {
    try {
      const { email } = req.params;
      const user = await this.userService.findOneWithOptions({ email });
      if (!user) {
        res.sendCustomErrorResponse("user not found", null);
      } else {
        const payload = {
          id: user._id,
        };
        const resetToken = this.jwtService.sign(payload, { expiresIn: "1h" });

        const resetLink = `${process.env.FRONTEND_URL}/${process.env.RESET_PASSWORD}?token=${resetToken}`;
        const emailOptions: any = {
          to: user.email,
          subject: "Password Reset Request",
          html: `Click the following link to reset your password: <a href="${resetLink}">${resetLink}</a>`,
        };

        await EmailService.sendEmail(emailOptions);

        res.sendSuccess200Response(
          "Password reset email sent successfully",
          null,
        );
      }
    } catch (error) {
      logger.error("getForPasswordLink", error);
      res.sendErrorResponse("Error ", error);
    }
  };

  public resetPassword = async (req: Request, res: Response) => {
    try {
      const { token, password } = req.body;
      const decoded = this.jwtService.verify(token) as JwtRefreshTokenClaims;
      const user = await this.userService.findOneWithOptions({
        _id: decoded.id,
      });
      if (user) {
        const payload: UserSession = {
          userAgent: req.headers["user-agent"] ?? "",
          ipAddress: req.ip ?? "",
          userId: user._id,
        };
        await this.userService.updateForgetPassword(user._id, password);
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
        res.sendCreated201Response("password reset Success", {
          accessToken,
          refreshToken,
        });
      }
    } catch (error) {
      logger.error("resetPassword", error);
      res.sendErrorResponse("resetPassword ", error);
    }
  };

  public getAllDashBoardDataHandler = async (_: Request, res: Response) => {
    try {
      const jobs = await this.jobService.getCount();
      const employer = await this.employerService.getCount();
      const application = await this.jobService.getApplicationCount();
      const appoinment = await this.employerService.getAppoinmentCount();
      res.sendSuccess200Response("Password reset email sent successfully", {
        jobs,
        employer,
        application,
        appoinment,
      });
    } catch (error) {
      logger.error("getForPasswordLink", error);
      res.sendErrorResponse("Error ", error);
    }
  };
}

export default UserController;
