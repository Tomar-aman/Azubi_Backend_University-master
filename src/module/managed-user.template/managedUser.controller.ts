import { type Request, type Response } from "express";
import { managedUserModel } from "../../models";
import emailService from "../../utils/emailService";
import logger from "../../utils/logger";
import bcrypt from "bcrypt";

class ManagedUserController {
  // ─── CREATE USER ──────────────────────────────────────────────────────────
  public createUser = async (req: Request, res: Response) => {
    try {
      const { username, email, password, permissions } = req.body;

      const existing = await managedUserModel.findOne({ email });
      if (existing) {
        res.sendCustomErrorResponse("Email already exists", null);
        return;
      }

      const user = await managedUserModel.create({
        username,
        email,
        password,
        permissions: permissions ?? [],
        createdBy: req.user?._id?.toString() ?? "admin",
      });

      // Send welcome email with credentials
      const loginUrl = process.env.ADMIN_PANEL_URL ?? process.env.FRONTEND_URL ?? "http://localhost:3000";
      const html = `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;background:#f9f9f9;border-radius:8px">
          <h2 style="color:#07575A">Welcome to Azubi Admin Panel</h2>
          <p>Hi <strong>${username}</strong>,</p>
          <p>Your admin account has been created. Here are your login credentials:</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0">
            <tr><td style="padding:8px;font-weight:bold;color:#555">Email</td><td style="padding:8px">${email}</td></tr>
            <tr style="background:#eee"><td style="padding:8px;font-weight:bold;color:#555">Password</td><td style="padding:8px">${password}</td></tr>
          </table>
          <p>Login here: <a href="${loginUrl}" style="color:#07575A">${loginUrl}</a></p>
          <p style="color:#999;font-size:12px">Please change your password after first login.</p>
        </div>
      `;
      try {
        await emailService.sendEmail({ to: [email], subject: "Your Azubi Admin Account Credentials", html });
        logger.info(`Welcome email sent to ${email}`);
      } catch (emailErr) {
        logger.error(`Failed to send welcome email to ${email}:`, emailErr);
        // Don't block user creation if email fails
      }

      res.sendCreated201Response("User created successfully", {
        _id: user._id,
        username: user.username,
        email: user.email,
        permissions: user.permissions,
        status: user.status,
      });
    } catch (error) {
      res.sendErrorResponse("Error creating user", error);
    }
  };

  // ─── GET ALL USERS ────────────────────────────────────────────────────────
  public getAllUsers = async (req: Request, res: Response) => {
    try {
      const { pageNo = 1, recordPerPage = 10, searchValue = "" } = req.query;
      const skip = (Number(pageNo) - 1) * Number(recordPerPage);
      
      const user = req.user as any;
      const query: any = {};
      
      if (user.permissions !== undefined) {
        query.createdBy = user._id.toString();
      }

      if (searchValue) {
        query.$or = [
          { username: { $regex: searchValue, $options: "i" } },
          { email: { $regex: searchValue, $options: "i" } },
        ];
      }

      const [users, count] = await Promise.all([
        managedUserModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(recordPerPage)).select("-password"),
        managedUserModel.countDocuments(query),
      ]);

      const creatorIds = [...new Set(users.map(u => u.createdBy).filter(Boolean))];
      const creatorMap: Record<string, string> = {};

      if (creatorIds.length > 0) {
        const { userModel, managedEmployeeModel } = await import("../../models");
        const [superUsers, mUsers, mEmps] = await Promise.all([
          userModel.find({ _id: { $in: creatorIds } }, "username"),
          managedUserModel.find({ _id: { $in: creatorIds } }, "username"),
          managedEmployeeModel.find({ _id: { $in: creatorIds } }, "name"),
        ]);

        superUsers.forEach(u => creatorMap[u._id.toString()] = u.username);
        mUsers.forEach(u => creatorMap[u._id.toString()] = u.username);
        mEmps.forEach(u => creatorMap[u._id.toString()] = u.name);
      }

      const usersWithCreator = users.map(u => ({
        ...u.toObject(),
        createdByName: creatorMap[u.createdBy!] || "Superadmin",
      }));

      res.sendSuccess200Response("Users fetched successfully", { users: usersWithCreator, count });
    } catch (error) {
      res.sendErrorResponse("Error fetching users", error);
    }
  };

  // ─── GET USER BY ID ───────────────────────────────────────────────────────
  public getUserById = async (req: Request, res: Response) => {
    try {
      const user = await managedUserModel.findById(req.params.id).select("-password");
      if (!user) { res.sendNotFound404Response("User not found", null); return; }
      res.sendSuccess200Response("User fetched", user);
    } catch (error) {
      res.sendErrorResponse("Error fetching user", error);
    }
  };

  // ─── UPDATE USER ──────────────────────────────────────────────────────────
  public updateUser = async (req: Request, res: Response) => {
    try {
      const { username, email, permissions, status, newPassword } = req.body;
      const updateData: any = { username, email, permissions, status };

      if (newPassword) {
        updateData.password = await bcrypt.hash(newPassword, 10);
      }

      const user = await managedUserModel.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true }).select("-password");
      if (!user) { res.sendNotFound404Response("User not found", null); return; }
      res.sendSuccess200Response("User updated successfully", user);
    } catch (error) {
      res.sendErrorResponse("Error updating user", error);
    }
  };

  // ─── DELETE USER ──────────────────────────────────────────────────────────
  public deleteUser = async (req: Request, res: Response) => {
    try {
      const user = await managedUserModel.findByIdAndDelete(req.params.id);
      if (!user) { res.sendNotFound404Response("User not found", null); return; }
      res.sendSuccess200Response("User deleted successfully", null);
    } catch (error) {
      res.sendErrorResponse("Error deleting user", error);
    }
  };

  // ─── TOGGLE STATUS ────────────────────────────────────────────────────────
  public toggleStatus = async (req: Request, res: Response) => {
    try {
      const user = await managedUserModel.findById(req.params.id);
      if (!user) { res.sendNotFound404Response("User not found", null); return; }
      user.status = user.status === "Active" ? "Inactive" : "Active";
      await user.save();
      res.sendSuccess200Response("Status updated", { status: user.status });
    } catch (error) {
      res.sendErrorResponse("Error toggling status", error);
    }
  };
}

export default ManagedUserController;
