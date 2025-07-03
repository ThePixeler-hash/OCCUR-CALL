import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/providers/LanguageProvider";
import { MetricsCards } from "@/components/dashboard/MetricsCards";
import { PayrollCalculator } from "@/components/dashboard/PayrollCalculator";
import { AIAssistant } from "@/components/dashboard/AIAssistant";
import { RecentActivities } from "@/components/dashboard/RecentActivities";
import { ComplianceStatus } from "@/components/dashboard/ComplianceStatus";

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="pt-20 pb-20 md:pb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
            {t("dashboard")}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {t("welcome")}
          </p>
        </div>

        {/* Metrics Cards */}
        <MetricsCards />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payroll Calculator */}
          <div className="lg:col-span-2">
            <PayrollCalculator />
          </div>

          {/* Quick Actions Sidebar */}
          <div className="space-y-6">
            {/* AI Assistant */}
            <AIAssistant />

            {/* Recent Activities */}
            <RecentActivities />

            {/* Compliance Status */}
            <ComplianceStatus />
          </div>
        </div>
      </div>
    </div>
  );
}
