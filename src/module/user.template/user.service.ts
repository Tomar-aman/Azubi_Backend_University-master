import type mongoose from "mongoose";
import { type FilterQuery } from "mongoose";
import { type User, type UserDocument } from "../../models/user";
import { type UserSessionDocument, type UserSession } from "src/models/session";
import { userModel, userSessionModel } from "../../models";

export class UserService {
  public async findById(id: string | mongoose.Schema.Types.ObjectId) {
    return await userModel.findById(id);
  }

  public async findOneWithOptions(options: FilterQuery<UserDocument>) {
    return await userModel.findOne(options);
  }

  public async create(user: User) {
    return await userModel.create(user);
  }

  public async createSession(payload: UserSession) {
    const { userId, userAgent, ipAddress } = payload;
    return await userSessionModel.create({
      userId,
      userAgent,
      ipAddress,
    });
  }

  public async getUserSessionDetailsBySessionId(sessionId: string) {
    return await userSessionModel.findById(sessionId);
  }

  public async getUserSessionDetails(
    payload: FilterQuery<UserSessionDocument>,
  ) {
    return await userSessionModel.findOne(payload);
  }

  public async updateProfile(
    userId: string,
    newPassword?: string,
    oldPassword?: string,
    profileFields?: Record<string, any>,
  ) {
    const user = await userModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Check if old password is provided and matches the current password
    if (oldPassword) {
      const isPasswordMatch = await user.comparePassword(oldPassword);
      if (!isPasswordMatch) {
        throw new Error("Old password is incorrect");
      }
    }

    // Update the password if new password is provided
    if (newPassword) {
      await user.updatePassword(newPassword);
    }

    // Update other profile fields if provided
    if (profileFields) {
      Object.assign(user, profileFields);
    }
    // Save the updated user document
    await user.save();
  }

  public async updateForgetPassword(userId: string, newPassword: string) {
    const user = await userModel.findById(userId);
    if (user) {
      user.password = newPassword;
      return await user.save();
    }
  }
}
