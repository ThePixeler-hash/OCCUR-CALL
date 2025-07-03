# OCCUR-CALL

OCCUR-CALL - AI-Powered Payroll Management System for Morocco

A comprehensive, production-ready payroll management system specifically designed for Moroccan businesses, featuring AI-powered insights, automated calculations, and full compliance with local labor laws.

## 🚀 Features

### Core Functionality
- *Employee Management*: Complete employee lifecycle management with profiles, documents, and history
- *Attendance Tracking*: Biometric attendance with AI-powered face recognition
- *Payroll Processing*: Automated salary calculations with Morocco-specific tax rules
- *Compliance Monitoring*: Real-time compliance checks for CNSS, IGR, and AMO
- *Document Processing*: AI-powered OCR for payroll document extraction
- *Reporting & Analytics*: Comprehensive reports with predictive analytics

### AI-Powered Features
- *Anomaly Detection*: Automatically detect payroll irregularities and compliance issues
- *Predictive Analytics*: Forecast budget requirements and turnover risks
- *Smart Document Processing*: Extract data from payroll documents using OCR and NLP
- *Intelligent Insights*: AI-generated recommendations for payroll optimization
- *Compliance Automation*: Automated checks against Moroccan labor laws
-*AI agent*:
Accessible by all users and can be asked anything about the app

### Morocco-Specific Compliance
- *CNSS Contributions*: Automatic calculation of employee (6.29%) and employer (13.46%) contributions
- *IGR Tax Brackets*: Progressive tax calculation according to Moroccan tax law
- *AMO Insurance*: Automatic health insurance contribution calculation (2%)
- *Minimum Wage Compliance*: Ensures all calculations meet legal requirements
-*supplementary hours*:
Verifies if employees have worked additive hours above what’s needed
-*Absence & delay*:
Verifies if employees have delays or absences, can know the parameters after the admin enter the details to ai agent that will implement the parameters (AI agent should appear to the admin in first place and ask him some questions, the the AI agent will customize the app and it’s parameters by itself)
- *Multi-language Support*: French, Arabic, Darija, English, and Spanish

## 🛠 Technology Stack

- *Frontend*: html, css, js
- *Backend*: xampp, python, js, c and whatever needed 
- *AI Services*: OpenAI GPT-4, Tesseract.js OCR, Face-API.js
- *Authentication*: special auth system made especially for the app (or free external system)
- *Database*: SQL with comprehensive schema
- *Deployment*: deployed on windows, database on xampp for users, and the app’s database is automatically made by the app and saved on the device.

## 📋 Prerequisites

Before setting up the application, ensure you have:

1. *xampp*: users database setup
2. *OpenAI API Key*: Get your API key from [OpenAI](https://platform.openai.com)
3. *Node.js*: Version 18 or higher
4.*replit or cursor*

## 🚀 Quick Setup

### 1. Database Setup

Database setup for users on xampp and for other, it’s coded and will be automatically setup once the app is downloaded and the ai agent understands what’s the customization the user needs

### 2. Environment Configuration
Environment configuration with APIs and external needed systems on a special file
### 3. Install Dependencies

bash
npm install


### 4. Run the Application

bash
npm run dev


## 📊 Database Schema

The system includes comprehensive tables for:

- *Companies*: Multi-tenant company management
- *Admins*: Role-based user management (Admin, HR, Manager, Employee), manages everything in the app, even other users(companies, employees, social organization, accounting dapartment)
- *Employees*: Complete employee profiles with documents and history
- *Departments & Positions*: Organizational structure
- *Attendance*: Daily attendance tracking with biometric verification
- *Payroll Calculations*: Detailed payroll processing with tax calculations
- *Tax Rules*: Configurable tax and contribution rules
- *AI Insights*: AI-generated insights and recommendations
- *Compliance Checks*: Automated compliance monitoring
- *Audit Logs*: Complete audit trail for all operations

## 🤖 AI Integration

### Edge Functions

The system includes several AI-powered edge functions:

- *ai-payroll-processor*: Main AI processing function for:
  - Payroll anomaly detection
  - Document processing and OCR
  - Turnover risk prediction
  - Work schedule optimization
  - Compliance checking

### AI Services

- *Anomaly Detection*: Identifies unusual patterns in payroll data
- *Predictive Analytics*: Forecasts budget requirements and employee risks
- *Document Processing*: Extracts data from scanned payroll documents
- *Compliance Monitoring*: Automated checks against labor laws
- *Smart Insights*: Generates actionable recommendations

## 💼 Business Logic

### Payroll Calculation Engine

The system includes a sophisticated payroll calculator that handles:

- *Base Salary Adjustments*: Pro-rated for absent days
- *Overtime Calculation*
-*Absence & delays*
- *Tax Calculations*: tax brackets
- *Social Contributions*: CNSS and AMO calculations with thresholds
- *Deductions*: Loans, advances, and other deductions
- *Bonuses*: Performance and project bonuses

### Morocco Tax Compliance

Pre-configured with current Moroccan tax rules:

- *IGR Brackets*
- *CNSS (CT, LT, prestations familiales)Rates*
- *AMO Rate*
- *Minimum Wage*
-*IR*
-*CIMR*
-*IPE*
All resources are in the moroccan business code (code de travail marocain)
Taxes are splitted into (charges patronales deducted from employer salary [don’t appear on employee payroll]) and (charges salariales deducted from employee’s salary and appears on payroll)
-*custom taxes*:defined by admin according to contract and business code


## 🔐 Security Features

- *Row Level Security*: Database-level security for multi-tenant data
- *Role-Based Access*: Granular permissions for different user roles
- *Audit Trail*: Complete logging of all system operations
- *Data Encryption*: Sensitive data encrypted at rest and in transit
- *Biometric Security*: Face recognition for attendance verification

## 📱 User Roles & Permissions

### Admin
- Full system access
- Company settings management
- User management
- All payroll operations
- Employee management
- Attendance tracking
- Payroll processing
- Reports generation
- Team member viewing
- Attendance approval
- Basic reporting
-Document export(ETAT 9421-DAMANCOM-CNSS-Paslips-PayslipLogs-IR-Salary Transfer )

### Employee
- Personal data viewing
- Payslip access
- Attendance history
-document export (payslip-salary transfer)

### Accounting Department 
-Salary Declaration receiving
-document export

### Social Organization 
-Social declaration receiving
-document export

## 🌐 Multi-Language Support

The system supports:
- *French* (Français)
- *Arabic* (العربية)
- *Darija* (الدارجة)
- *English*
- *Spanish* (Español)

## 📈 Reporting & Analytics

### Standard Reports
- Monthly payroll summaries
- Tax compliance reports
- Employee cost analysis
- Attendance reports
- Year-end summaries

### AI-Powered Analytics
- Budget forecasting
- Turnover risk analysis
- Salary benchmarking
- Compliance scoring
- Performance insights

## 🚀 Deployment

The application is configured for easy deployment:

## 🔧 Development

### Project Structure

src/
├── components/          # Reusable UI components
├── pages/              # Application pages
├── services/           # Business logic and API calls
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
└── types/              # TypeScript type definitions

Xampp/
├── migrations/         # Database migrations
└── functions/          # Edge functions




### Key Services
- *DatabaseService*: All database operations
- *PayrollCalculator*: Salary and tax calculations
- *AIService*: AI-powered features
- *BiometricService*: Face recognition
- *OCRService*: Document processing
-*AI agent*

## 📞 Support

For technical support or questions:
- Check the documentation in the /docs folder
- Review the database schema in /supabase/migrations
- Examine the AI functions in /supabase/functions

## 🔄 Updates & Maintenance

The system is designed for easy updates:
- Database migrations for schema changes
- Configurable tax rules for law changes
- Modular AI services for feature additions
- Comprehensive logging for troubleshooting

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

*PayrollAI* - Revolutionizing payroll management in Morocco with the power of artificial intelligence.
