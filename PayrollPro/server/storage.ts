import {
  users,
  companies,
  employees,
  attendance,
  payroll,
  aiInteractions,
  documentTemplates,
  type User,
  type UpsertUser,
  type Company,
  type InsertCompany,
  type Employee,
  type InsertEmployee,
  type Attendance,
  type InsertAttendance,
  type Payroll,
  type InsertPayroll,
  type AiInteraction,
  type InsertAiInteraction,
  type DocumentTemplate,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql, gte, lte } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Company operations
  getCompany(id: string): Promise<Company | undefined>;
  createCompany(company: InsertCompany): Promise<Company>;
  updateCompany(id: string, company: Partial<InsertCompany>): Promise<Company>;
  
  // Employee operations
  getEmployees(companyId: string): Promise<Employee[]>;
  getEmployee(id: string): Promise<Employee | undefined>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  updateEmployee(id: string, employee: Partial<InsertEmployee>): Promise<Employee>;
  
  // Attendance operations
  getAttendance(employeeId: string, startDate: string, endDate: string): Promise<Attendance[]>;
  createAttendance(attendance: InsertAttendance): Promise<Attendance>;
  updateAttendance(id: string, attendance: Partial<InsertAttendance>): Promise<Attendance>;
  
  // Payroll operations
  getPayrolls(companyId: string, period?: string): Promise<Payroll[]>;
  getPayroll(id: string): Promise<Payroll | undefined>;
  createPayroll(payrollData: InsertPayroll): Promise<Payroll>;
  updatePayroll(id: string, payrollData: Partial<InsertPayroll>): Promise<Payroll>;
  
  // AI interactions
  createAiInteraction(interaction: InsertAiInteraction): Promise<AiInteraction>;
  getAiInteractions(userId: string, limit?: number): Promise<AiInteraction[]>;
  
  // Document templates
  getDocumentTemplates(type?: string): Promise<DocumentTemplate[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }
  
  // Company operations
  async getCompany(id: string): Promise<Company | undefined> {
    const [company] = await db.select().from(companies).where(eq(companies.id, id));
    return company;
  }

  async createCompany(company: InsertCompany): Promise<Company> {
    const [newCompany] = await db.insert(companies).values(company).returning();
    return newCompany;
  }

  async updateCompany(id: string, company: Partial<InsertCompany>): Promise<Company> {
    const [updatedCompany] = await db
      .update(companies)
      .set({ ...company, updatedAt: new Date() })
      .where(eq(companies.id, id))
      .returning();
    return updatedCompany;
  }
  
  // Employee operations
  async getEmployees(companyId: string): Promise<Employee[]> {
    return await db.select().from(employees).where(eq(employees.companyId, companyId));
  }

  async getEmployee(id: string): Promise<Employee | undefined> {
    const [employee] = await db.select().from(employees).where(eq(employees.id, id));
    return employee;
  }

  async createEmployee(employee: InsertEmployee): Promise<Employee> {
    const [newEmployee] = await db.insert(employees).values(employee).returning();
    return newEmployee;
  }

  async updateEmployee(id: string, employee: Partial<InsertEmployee>): Promise<Employee> {
    const [updatedEmployee] = await db
      .update(employees)
      .set({ ...employee, updatedAt: new Date() })
      .where(eq(employees.id, id))
      .returning();
    return updatedEmployee;
  }
  
  // Attendance operations
  async getAttendance(employeeId: string, startDate: string, endDate: string): Promise<Attendance[]> {
    return await db
      .select()
      .from(attendance)
      .where(
        and(
          eq(attendance.employeeId, employeeId),
          gte(attendance.date, startDate),
          lte(attendance.date, endDate)
        )
      )
      .orderBy(desc(attendance.date));
  }

  async createAttendance(attendanceData: InsertAttendance): Promise<Attendance> {
    const [newAttendance] = await db.insert(attendance).values(attendanceData).returning();
    return newAttendance;
  }

  async updateAttendance(id: string, attendanceData: Partial<InsertAttendance>): Promise<Attendance> {
    const [updatedAttendance] = await db
      .update(attendance)
      .set(attendanceData)
      .where(eq(attendance.id, id))
      .returning();
    return updatedAttendance;
  }
  
  // Payroll operations
  async getPayrolls(companyId: string, period?: string): Promise<Payroll[]> {
    const conditions = [eq(payroll.companyId, companyId)];
    if (period) {
      conditions.push(eq(payroll.period, period));
    }
    
    return await db
      .select()
      .from(payroll)
      .where(and(...conditions))
      .orderBy(desc(payroll.period));
  }

  async getPayroll(id: string): Promise<Payroll | undefined> {
    const [payrollRecord] = await db.select().from(payroll).where(eq(payroll.id, id));
    return payrollRecord;
  }

  async createPayroll(payrollData: InsertPayroll): Promise<Payroll> {
    const [newPayroll] = await db.insert(payroll).values(payrollData).returning();
    return newPayroll;
  }

  async updatePayroll(id: string, payrollData: Partial<InsertPayroll>): Promise<Payroll> {
    const [updatedPayroll] = await db
      .update(payroll)
      .set({ ...payrollData, updatedAt: new Date() })
      .where(eq(payroll.id, id))
      .returning();
    return updatedPayroll;
  }
  
  // AI interactions
  async createAiInteraction(interaction: InsertAiInteraction): Promise<AiInteraction> {
    const [newInteraction] = await db.insert(aiInteractions).values(interaction).returning();
    return newInteraction;
  }

  async getAiInteractions(userId: string, limit = 50): Promise<AiInteraction[]> {
    return await db
      .select()
      .from(aiInteractions)
      .where(eq(aiInteractions.userId, userId))
      .orderBy(desc(aiInteractions.createdAt))
      .limit(limit);
  }
  
  // Document templates
  async getDocumentTemplates(type?: string): Promise<DocumentTemplate[]> {
    return await db
      .select()
      .from(documentTemplates);
  }
}

export const storage = new DatabaseStorage();
