import { type Request, type Response } from "express";
import { managedEmployeeModel } from "../../models";
import crypto from "crypto";
import emailService from "../../utils/emailService";
import logger from "../../utils/logger";

class ManagedEmployeeController {
  // ─── CREATE EMPLOYEE ──────────────────────────────────────────────────────
  public createEmployee = async (req: Request, res: Response) => {
    try {
      const { name, email, phoneNo, position, permissions, password: manualPassword } = req.body;
      const createdBy = req.user?._id?.toString() ?? "";

      // Generate a strong random password if not provided
      const password = manualPassword || crypto.randomBytes(8).toString("hex");

      const employee = await managedEmployeeModel.create({
        name,
        email,
        password,
        phoneNo,
        position,
        permissions: permissions ?? [],
        createdBy,
      });

      // Send welcome email with credentials
      const loginUrl = process.env.MANAGED_EMPLOYEE_LOGIN_URL || "https://wohnzugang.de";
      const html = `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;background:#f9f9f9;border-radius:8px">
          <h2 style="color:#07575A">Welcome to the Employee Panel</h2>
          <p>Hi <strong>${name}</strong>,</p>
          <p>Your employee account has been created. Here are your login credentials:</p>
          <table style="width:100%;border-collapse:collapse;margin:16px 0">
            <tr><td style="padding:8px;font-weight:bold;color:#555">Email</td><td style="padding:8px">${email}</td></tr>
            <tr style="background:#eee"><td style="padding:8px;font-weight:bold;color:#555">Password</td><td style="padding:8px">${password}</td></tr>
          </table>
          <p>Login here: <a href="${loginUrl}" style="color:#07575A">${loginUrl}</a></p>
          <p style="color:#999;font-size:12px">Please change your password after first login.</p>
        </div>
      `;
      try {
        await emailService.sendEmail({ to: [email], subject: "Your Azubi Employee Account Credentials", html });
        logger.info(`Welcome email sent to employee ${email}`);
      } catch (emailErr) {
        logger.error(`Failed to send welcome email to employee ${email}:`, emailErr);
      }

      res.sendCreated201Response("Employee created successfully", employee);
    } catch (error) {
      res.sendErrorResponse("Error creating employee", error);
    }
  };

  // ─── GET ALL EMPLOYEES ────────────────────────────────────────────────────
  public getAllEmployees = async (req: Request, res: Response) => {
    try {
      const { pageNo = 1, recordPerPage = 10, searchValue = "" } = req.query;
      const skip = (Number(pageNo) - 1) * Number(recordPerPage);
      
      const user = req.user as any;
      const query: any = {};
      
      // If user has permissions defined, they are NOT the superadmin.
      // So they should only see employees they created.
      if (user.permissions !== undefined) {
        query.createdBy = user._id.toString();
      }

      if (searchValue) {
        query.$or = [
          { name: { $regex: searchValue, $options: "i" } },
          { email: { $regex: searchValue, $options: "i" } },
          { position: { $regex: searchValue, $options: "i" } },
        ];
      }

      const [employees, count] = await Promise.all([
        managedEmployeeModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(recordPerPage)),
        managedEmployeeModel.countDocuments(query),
      ]);

      // Resolve createdBy to user names
      const creatorIds = [...new Set(employees.map(e => e.createdBy).filter(Boolean))];
      const creatorMap: Record<string, string> = {};

      if (creatorIds.length > 0) {
        const { userModel, managedUserModel } = await import("../../models");
        
        const [users, mUsers, mEmps] = await Promise.all([
          userModel.find({ _id: { $in: creatorIds } }, "username"),
          managedUserModel.find({ _id: { $in: creatorIds } }, "username"),
          managedEmployeeModel.find({ _id: { $in: creatorIds } }, "name"),
        ]);

        users.forEach(u => creatorMap[u._id.toString()] = u.username);
        mUsers.forEach(u => creatorMap[u._id.toString()] = u.username);
        mEmps.forEach(u => creatorMap[u._id.toString()] = u.name);
      }

      const employeesWithCreator = employees.map(e => ({
        ...e.toObject(),
        createdByName: creatorMap[e.createdBy] || "Superadmin",
      }));

      res.sendSuccess200Response("Employees fetched successfully", { employees: employeesWithCreator, count });
    } catch (error) {
      res.sendErrorResponse("Error fetching employees", error);
    }
  };

  // ─── GET EMPLOYEE BY ID ───────────────────────────────────────────────────
  public getEmployeeById = async (req: Request, res: Response) => {
    try {
      const employee = await managedEmployeeModel.findById(req.params.id);
      if (!employee) { res.sendNotFound404Response("Employee not found", null); return; }
      res.sendSuccess200Response("Employee fetched", employee);
    } catch (error) {
      res.sendErrorResponse("Error fetching employee", error);
    }
  };

  // ─── UPDATE EMPLOYEE ──────────────────────────────────────────────────────
  public updateEmployee = async (req: Request, res: Response) => {
    try {
      const { name, email, phoneNo, position, permissions, status, password } = req.body;
      const employee = await managedEmployeeModel.findById(req.params.id);
      if (!employee) { res.sendNotFound404Response("Employee not found", null); return; }

      if (name !== undefined) employee.name = name;
      if (email !== undefined) employee.email = email;
      if (phoneNo !== undefined) employee.phoneNo = phoneNo;
      if (position !== undefined) employee.position = position;
      if (permissions !== undefined) employee.permissions = permissions;
      if (status !== undefined) employee.status = status;
      if (password) employee.password = password;

      await employee.save();
      res.sendSuccess200Response("Employee updated successfully", employee);
    } catch (error) {
      res.sendErrorResponse("Error updating employee", error);
    }
  };

  // ─── DELETE EMPLOYEE ──────────────────────────────────────────────────────
  public deleteEmployee = async (req: Request, res: Response) => {
    try {
      const employee = await managedEmployeeModel.findByIdAndDelete(req.params.id);
      if (!employee) { res.sendNotFound404Response("Employee not found", null); return; }
      res.sendSuccess200Response("Employee deleted successfully", null);
    } catch (error) {
      res.sendErrorResponse("Error deleting employee", error);
    }
  };

  // ─── TOGGLE STATUS ────────────────────────────────────────────────────────
  public toggleStatus = async (req: Request, res: Response) => {
    try {
      const emp = await managedEmployeeModel.findById(req.params.id);
      if (!emp) { res.sendNotFound404Response("Employee not found", null); return; }
      emp.status = emp.status === "Active" ? "Inactive" : "Active";
      await emp.save();
      res.sendSuccess200Response("Status updated", { status: emp.status });
    } catch (error) {
      res.sendErrorResponse("Error toggling status", error);
    }
  };
}

export default ManagedEmployeeController;
