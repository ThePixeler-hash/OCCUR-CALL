import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  integer,
  decimal,
  boolean,
  date,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (mandatory for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role", { enum: ["admin", "hr", "manager", "employee", "accounting", "social"] }).default("employee"),
  companyId: varchar("company_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Companies table
export const companies = pgTable("companies", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  address: text("address"),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 255 }),
  cnssNumber: varchar("cnss_number", { length: 50 }),
  taxId: varchar("tax_id", { length: 50 }),
  amo: varchar("amo", { length: 50 }),
  settings: jsonb("settings").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Employees table
export const employees = pgTable("employees", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").references(() => users.id),
  companyId: varchar("company_id").references(() => companies.id),
  employeeNumber: varchar("employee_number", { length: 50 }).notNull(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  birthDate: date("birth_date"),
  hireDate: date("hire_date").notNull(),
  position: varchar("position", { length: 100 }),
  department: varchar("department", { length: 100 }),
  baseSalary: decimal("base_salary", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { enum: ["active", "inactive", "terminated"] }).default("active"),
  cnssNumber: varchar("cnss_number", { length: 50 }),
  bankAccount: varchar("bank_account", { length: 50 }),
  documents: jsonb("documents").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Attendance table
export const attendance = pgTable("attendance", {
  id: uuid("id").primaryKey().defaultRandom(),
  employeeId: varchar("employee_id").references(() => employees.id).notNull(),
  date: date("date").notNull(),
  checkIn: timestamp("check_in"),
  checkOut: timestamp("check_out"),
  hoursWorked: decimal("hours_worked", { precision: 4, scale: 2 }),
  overtimeHours: decimal("overtime_hours", { precision: 4, scale: 2 }).default("0"),
  status: varchar("status", { enum: ["present", "absent", "late", "sick", "vacation"] }).default("present"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Payroll table
export const payroll = pgTable("payroll", {
  id: uuid("id").primaryKey().defaultRandom(),
  employeeId: varchar("employee_id").references(() => employees.id).notNull(),
  companyId: varchar("company_id").references(() => companies.id).notNull(),
  period: varchar("period", { length: 7 }).notNull(), // YYYY-MM format
  baseSalary: decimal("base_salary", { precision: 10, scale: 2 }).notNull(),
  overtimePay: decimal("overtime_pay", { precision: 10, scale: 2 }).default("0"),
  bonuses: decimal("bonuses", { precision: 10, scale: 2 }).default("0"),
  grossSalary: decimal("gross_salary", { precision: 10, scale: 2 }).notNull(),
  
  // Tax calculations
  cnssEmployee: decimal("cnss_employee", { precision: 10, scale: 2 }).notNull(),
  cnssEmployer: decimal("cnss_employer", { precision: 10, scale: 2 }).notNull(),
  amoEmployee: decimal("amo_employee", { precision: 10, scale: 2 }).notNull(),
  amoEmployer: decimal("amo_employer", { precision: 10, scale: 2 }).notNull(),
  igrTax: decimal("igr_tax", { precision: 10, scale: 2 }).notNull(),
  professionalExpenses: decimal("professional_expenses", { precision: 10, scale: 2 }).notNull(),
  
  // Deductions
  deductions: decimal("deductions", { precision: 10, scale: 2 }).default("0"),
  
  // Final amounts
  netSalary: decimal("net_salary", { precision: 10, scale: 2 }).notNull(),
  
  // Metadata
  calculationDetails: jsonb("calculation_details").default({}),
  status: varchar("status", { enum: ["draft", "calculated", "approved", "paid"] }).default("draft"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AI interactions table
export const aiInteractions = pgTable("ai_interactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  companyId: varchar("company_id").references(() => companies.id),
  question: text("question").notNull(),
  response: text("response").notNull(),
  category: varchar("category", { enum: ["compliance", "calculation", "labor_law", "general"] }).default("general"),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

// Document templates table
export const documentTemplates = pgTable("document_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { enum: ["payslip", "cnss_report", "amo_report", "igr_report", "etat_9421", "damancom"] }).notNull(),
  template: text("template").notNull(),
  language: varchar("language", { length: 5 }).default("fr"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  company: one(companies, {
    fields: [users.companyId],
    references: [companies.id],
  }),
  employee: one(employees),
  aiInteractions: many(aiInteractions),
}));

export const companiesRelations = relations(companies, ({ many }) => ({
  employees: many(employees),
  payrolls: many(payroll),
  users: many(users),
}));

export const employeesRelations = relations(employees, ({ one, many }) => ({
  user: one(users, {
    fields: [employees.userId],
    references: [users.id],
  }),
  company: one(companies, {
    fields: [employees.companyId],
    references: [companies.id],
  }),
  attendance: many(attendance),
  payrolls: many(payroll),
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
  employee: one(employees, {
    fields: [attendance.employeeId],
    references: [employees.id],
  }),
}));

export const payrollRelations = relations(payroll, ({ one }) => ({
  employee: one(employees, {
    fields: [payroll.employeeId],
    references: [employees.id],
  }),
  company: one(companies, {
    fields: [payroll.companyId],
    references: [companies.id],
  }),
}));

export const aiInteractionsRelations = relations(aiInteractions, ({ one }) => ({
  user: one(users, {
    fields: [aiInteractions.userId],
    references: [users.id],
  }),
  company: one(companies, {
    fields: [aiInteractions.companyId],
    references: [companies.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertCompanySchema = createInsertSchema(companies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEmployeeSchema = createInsertSchema(employees).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAttendanceSchema = createInsertSchema(attendance).omit({
  id: true,
  createdAt: true,
});

export const insertPayrollSchema = createInsertSchema(payroll).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAiInteractionSchema = createInsertSchema(aiInteractions).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Company = typeof companies.$inferSelect;
export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Employee = typeof employees.$inferSelect;
export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;
export type Attendance = typeof attendance.$inferSelect;
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;
export type Payroll = typeof payroll.$inferSelect;
export type InsertPayroll = z.infer<typeof insertPayrollSchema>;
export type AiInteraction = typeof aiInteractions.$inferSelect;
export type InsertAiInteraction = z.infer<typeof insertAiInteractionSchema>;
export type DocumentTemplate = typeof documentTemplates.$inferSelect;
