import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { PayrollCalculator } from "./services/payrollCalculator";
import { AIAgent } from "./services/aiAgent";
import { DocumentGenerator } from "./services/documentGenerator";
import { z } from "zod";
import { insertEmployeeSchema, insertAttendanceSchema, insertPayrollSchema, insertAiInteractionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Dashboard metrics
  app.get("/api/dashboard/metrics", isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.companyId) {
        return res.status(400).json({ message: "User not associated with a company" });
      }

      const employees = await storage.getEmployees(user.companyId);
      const currentPeriod = new Date().toISOString().slice(0, 7); // YYYY-MM
      const payrolls = await storage.getPayrolls(user.companyId, currentPeriod);

      const totalEmployees = employees.length;
      const monthlyPayroll = payrolls.reduce((sum, p) => sum + parseFloat(p.grossSalary), 0);
      const attendanceRate = 98.5; // TODO: Calculate from attendance data
      const complianceIssues = 0; // TODO: Run compliance checks

      res.json({
        totalEmployees,
        monthlyPayroll,
        attendanceRate,
        complianceIssues,
      });
    } catch (error) {
      console.error("Error fetching metrics:", error);
      res.status(500).json({ message: "Failed to fetch dashboard metrics" });
    }
  });

  // Payroll calculation
  app.post("/api/payroll/calculate", isAuthenticated, async (req, res) => {
    try {
      const input = z.object({
        baseSalary: z.number().positive(),
        workingDays: z.number().positive(),
        standardWorkingDays: z.number().positive().default(22),
        overtimeHours: z.number().optional(),
        bonuses: z.number().optional(),
        deductions: z.number().optional(),
        dependents: z.number().optional(),
      }).parse(req.body);

      const calculation = PayrollCalculator.calculatePayroll(input);
      res.json(calculation);
    } catch (error) {
      console.error("Error calculating payroll:", error);
      res.status(400).json({ message: "Invalid payroll calculation input" });
    }
  });

  // Employee management
  app.get("/api/employees", isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.companyId) {
        return res.status(400).json({ message: "User not associated with a company" });
      }

      const employees = await storage.getEmployees(user.companyId);
      res.json(employees);
    } catch (error) {
      console.error("Error fetching employees:", error);
      res.status(500).json({ message: "Failed to fetch employees" });
    }
  });

  app.post("/api/employees", isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.companyId) {
        return res.status(400).json({ message: "User not associated with a company" });
      }

      const employeeData = insertEmployeeSchema.parse({
        ...req.body,
        companyId: user.companyId,
      });

      const employee = await storage.createEmployee(employeeData);
      res.status(201).json(employee);
    } catch (error) {
      console.error("Error creating employee:", error);
      res.status(400).json({ message: "Failed to create employee" });
    }
  });

  app.put("/api/employees/:id", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = insertEmployeeSchema.partial().parse(req.body);
      
      const employee = await storage.updateEmployee(id, updateData);
      res.json(employee);
    } catch (error) {
      console.error("Error updating employee:", error);
      res.status(400).json({ message: "Failed to update employee" });
    }
  });

  // Attendance management
  app.get("/api/attendance/:employeeId", isAuthenticated, async (req, res) => {
    try {
      const { employeeId } = req.params;
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "Start date and end date are required" });
      }

      const attendance = await storage.getAttendance(
        employeeId, 
        startDate as string, 
        endDate as string
      );
      res.json(attendance);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      res.status(500).json({ message: "Failed to fetch attendance" });
    }
  });

  app.post("/api/attendance", isAuthenticated, async (req, res) => {
    try {
      const attendanceData = insertAttendanceSchema.parse(req.body);
      const attendance = await storage.createAttendance(attendanceData);
      res.status(201).json(attendance);
    } catch (error) {
      console.error("Error creating attendance:", error);
      res.status(400).json({ message: "Failed to create attendance record" });
    }
  });

  // Payroll management
  app.get("/api/payroll", isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.companyId) {
        return res.status(400).json({ message: "User not associated with a company" });
      }

      const { period } = req.query;
      const payrolls = await storage.getPayrolls(user.companyId, period as string);
      res.json(payrolls);
    } catch (error) {
      console.error("Error fetching payrolls:", error);
      res.status(500).json({ message: "Failed to fetch payroll data" });
    }
  });

  app.post("/api/payroll", isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.companyId) {
        return res.status(400).json({ message: "User not associated with a company" });
      }

      const payrollData = insertPayrollSchema.parse({
        ...req.body,
        companyId: user.companyId,
      });

      const payroll = await storage.createPayroll(payrollData);
      res.status(201).json(payroll);
    } catch (error) {
      console.error("Error creating payroll:", error);
      res.status(400).json({ message: "Failed to create payroll" });
    }
  });

  // AI Agent
  app.post("/api/ai/question", isAuthenticated, async (req: any, res) => {
    try {
      const { question, context } = req.body;
      
      if (!question || typeof question !== 'string') {
        return res.status(400).json({ message: "Question is required" });
      }

      const response = await AIAgent.processQuestion(question, context);
      
      // Save interaction to database
      await storage.createAiInteraction({
        userId: req.user.claims.sub,
        companyId: context?.companyId,
        question,
        response: response.response,
        category: response.category,
        metadata: { confidence: response.confidence, suggestions: response.suggestions },
      });

      res.json(response);
    } catch (error) {
      console.error("Error processing AI question:", error);
      res.status(500).json({ message: "Failed to process question" });
    }
  });

  app.get("/api/ai/history", isAuthenticated, async (req: any, res) => {
    try {
      const interactions = await storage.getAiInteractions(req.user.claims.sub, 20);
      res.json(interactions);
    } catch (error) {
      console.error("Error fetching AI history:", error);
      res.status(500).json({ message: "Failed to fetch AI interaction history" });
    }
  });

  // Document generation
  app.post("/api/documents/payslip/:payrollId", isAuthenticated, async (req, res) => {
    try {
      const { payrollId } = req.params;
      const payroll = await storage.getPayroll(payrollId);
      
      if (!payroll) {
        return res.status(404).json({ message: "Payroll not found" });
      }

      const employee = await storage.getEmployee(payroll.employeeId);
      const company = await storage.getCompany(payroll.companyId);

      if (!employee || !company) {
        return res.status(404).json({ message: "Employee or company not found" });
      }

      const payslipHtml = DocumentGenerator.generatePayslip({
        employee,
        company,
        payroll,
        period: payroll.period,
      });

      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Content-Disposition', `attachment; filename="payslip-${employee.firstName}-${employee.lastName}-${payroll.period}.html"`);
      res.send(payslipHtml);
    } catch (error) {
      console.error("Error generating payslip:", error);
      res.status(500).json({ message: "Failed to generate payslip" });
    }
  });

  app.post("/api/documents/cnss-report", isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.companyId) {
        return res.status(400).json({ message: "User not associated with a company" });
      }

      const { period } = req.body;
      if (!period) {
        return res.status(400).json({ message: "Period is required" });
      }

      const company = await storage.getCompany(user.companyId);
      const employees = await storage.getEmployees(user.companyId);
      const payrolls = await storage.getPayrolls(user.companyId, period);

      // Merge employee and payroll data
      const employeesWithPayroll = employees.map(emp => {
        const payroll = payrolls.find(p => p.employeeId === emp.id);
        return { ...emp, ...payroll };
      });

      const reportHtml = DocumentGenerator.generateCNSSReport({
        company: company!,
        employees: employeesWithPayroll,
        period,
      });

      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Content-Disposition', `attachment; filename="cnss-report-${period}.html"`);
      res.send(reportHtml);
    } catch (error) {
      console.error("Error generating CNSS report:", error);
      res.status(500).json({ message: "Failed to generate CNSS report" });
    }
  });

  app.post("/api/documents/amo-report", isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user?.companyId) {
        return res.status(400).json({ message: "User not associated with a company" });
      }

      const { period } = req.body;
      if (!period) {
        return res.status(400).json({ message: "Period is required" });
      }

      const company = await storage.getCompany(user.companyId);
      const employees = await storage.getEmployees(user.companyId);
      const payrolls = await storage.getPayrolls(user.companyId, period);

      // Merge employee and payroll data
      const employeesWithPayroll = employees.map(emp => {
        const payroll = payrolls.find(p => p.employeeId === emp.id);
        return { ...emp, ...payroll };
      });

      const reportHtml = DocumentGenerator.generateAMOReport({
        company: company!,
        employees: employeesWithPayroll,
        period,
      });

      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Content-Disposition', `attachment; filename="amo-report-${period}.html"`);
      res.send(reportHtml);
    } catch (error) {
      console.error("Error generating AMO report:", error);
      res.status(500).json({ message: "Failed to generate AMO report" });
    }
  });

  // Compliance checks
  app.post("/api/compliance/check-payroll", isAuthenticated, async (req, res) => {
    try {
      const payrollData = req.body;
      const analysis = await AIAgent.analyzePayrollCompliance(payrollData);
      res.json(analysis);
    } catch (error) {
      console.error("Error checking payroll compliance:", error);
      res.status(500).json({ message: "Failed to check payroll compliance" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
