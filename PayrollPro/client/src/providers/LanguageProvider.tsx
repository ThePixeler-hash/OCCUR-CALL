import React, { createContext, useContext, useState } from "react";

type Language = "fr" | "ar" | "darija" | "en" | "es";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  fr: {
    dashboard: "Tableau de bord",
    employees: "Employés",
    attendance: "Présence",
    payroll: "Paie",
    reports: "Rapports",
    totalEmployees: "Total Employés",
    monthlyPayroll: "Paie Mensuelle",
    complianceIssues: "Problèmes de Conformité",
    attendanceRate: "Taux de Présence",
    welcome: "Bienvenue, Ahmed. Voici ce qui se passe avec votre paie aujourd'hui.",
    aiAssistant: "Assistant IA",
    askAboutCompliance: "Demander à propos de la conformité",
    recentActivities: "Activités Récentes",
    complianceStatus: "Statut de Conformité",
    payrollCalculator: "Calculateur de Paie - Maroc 2025",
    baseSalary: "Salaire de Base (MAD)",
    workingDays: "Jours de Travail",
    calculate: "Calculer",
    cnssDeclarations: "Déclarations CNSS",
    igrPayments: "Paiements IGR",
    amoContributions: "Cotisations AMO",
    laborCode: "Code du Travail",
    upToDate: "À jour",
    compliant: "Conforme",
    dueInDays: "Dû dans 3 jours",
    netSalary: "Salaire Net",
  },
  en: {
    dashboard: "Dashboard",
    employees: "Employees",
    attendance: "Attendance",
    payroll: "Payroll",
    reports: "Reports",
    totalEmployees: "Total Employees",
    monthlyPayroll: "Monthly Payroll",
    complianceIssues: "Compliance Issues",
    attendanceRate: "Attendance Rate",
    welcome: "Welcome back, Ahmed. Here's what's happening with your payroll today.",
    aiAssistant: "AI Assistant",
    askAboutCompliance: "Ask about compliance",
    recentActivities: "Recent Activities",
    complianceStatus: "Compliance Status",
    payrollCalculator: "Payroll Calculator - Morocco 2025",
    baseSalary: "Base Salary (MAD)",
    workingDays: "Working Days",
    calculate: "Calculate",
    cnssDeclarations: "CNSS Declarations",
    igrPayments: "IGR Payments",
    amoContributions: "AMO Contributions",
    laborCode: "Labor Code",
    upToDate: "Up to date",
    compliant: "Compliant",
    dueInDays: "Due in 3 days",
    netSalary: "Net Salary",
  },
  ar: {
    dashboard: "لوحة القيادة",
    employees: "الموظفون",
    attendance: "الحضور",
    payroll: "كشف الراتب",
    reports: "التقارير",
    totalEmployees: "إجمالي الموظفين",
    monthlyPayroll: "الراتب الشهري",
    complianceIssues: "مشاكل الامتثال",
    attendanceRate: "معدل الحضور",
    welcome: "مرحباً بعودتك أحمد. إليك ما يحدث مع كشف راتبك اليوم.",
    aiAssistant: "المساعد الذكي",
    askAboutCompliance: "اسأل عن الامتثال",
    recentActivities: "الأنشطة الأخيرة",
    complianceStatus: "حالة الامتثال",
    payrollCalculator: "حاسبة الراتب - المغرب 2025",
    baseSalary: "الراتب الأساسي (درهم)",
    workingDays: "أيام العمل",
    calculate: "احسب",
    cnssDeclarations: "تصريحات الصندوق الوطني",
    igrPayments: "مدفوعات الضريبة العامة",
    amoContributions: "مساهمات التأمين الصحي",
    laborCode: "قانون الشغل",
    upToDate: "محدث",
    compliant: "متوافق",
    dueInDays: "مستحق خلال 3 أيام",
    netSalary: "الراتب الصافي",
  },
  darija: {
    dashboard: "طابلو دو بورد",
    employees: "الخدامة",
    attendance: "الحضور",
    payroll: "الأجرة",
    reports: "التقارير",
    totalEmployees: "مجموع الخدامة",
    monthlyPayroll: "الأجرة ديال الشهر",
    complianceIssues: "مشاكل المطابقة",
    attendanceRate: "نسبة الحضور",
    welcome: "مرحبا أحمد. هاشنو كاين فالأجرة ديالك اليوم.",
    aiAssistant: "المساعد الذكي",
    askAboutCompliance: "سول على المطابقة",
    recentActivities: "الأنشطة الجديدة",
    complianceStatus: "حالة المطابقة",
    payrollCalculator: "حاسبة الأجرة - المغرب 2025",
    baseSalary: "الأجرة الأساسية (درهم)",
    workingDays: "أيام الخدمة",
    calculate: "احسب",
    cnssDeclarations: "تصريحات الصندوق الوطني",
    igrPayments: "الضريبة العامة",
    amoContributions: "التأمين الصحي",
    laborCode: "قانون الشغل",
    upToDate: "محدث",
    compliant: "موافق",
    dueInDays: "باقي 3 أيام",
    netSalary: "الأجرة الصافية",
  },
  es: {
    dashboard: "Panel de Control",
    employees: "Empleados",
    attendance: "Asistencia",
    payroll: "Nómina",
    reports: "Informes",
    totalEmployees: "Total de Empleados",
    monthlyPayroll: "Nómina Mensual",
    complianceIssues: "Problemas de Cumplimiento",
    attendanceRate: "Tasa de Asistencia",
    welcome: "Bienvenido, Ahmed. Esto es lo que está pasando con tu nómina hoy.",
    aiAssistant: "Asistente IA",
    askAboutCompliance: "Preguntar sobre cumplimiento",
    recentActivities: "Actividades Recientes",
    complianceStatus: "Estado de Cumplimiento",
    payrollCalculator: "Calculadora de Nómina - Marruecos 2025",
    baseSalary: "Salario Base (MAD)",
    workingDays: "Días de Trabajo",
    calculate: "Calcular",
    cnssDeclarations: "Declaraciones CNSS",
    igrPayments: "Pagos IGR",
    amoContributions: "Contribuciones AMO",
    laborCode: "Código Laboral",
    upToDate: "Al día",
    compliant: "Cumple",
    dueInDays: "Vence en 3 días",
    netSalary: "Salario Neto",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("fr");

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[Language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
