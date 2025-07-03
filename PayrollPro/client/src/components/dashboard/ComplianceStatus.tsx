import { GlassCard } from "@/components/ui/glass-card";
import { useLanguage } from "@/providers/LanguageProvider";
import { CheckCircle, AlertCircle, Clock } from "lucide-react";

export function ComplianceStatus() {
  const { t } = useLanguage();

  const complianceItems = [
    {
      id: 1,
      title: t("cnssDeclarations"),
      status: "compliant",
      message: t("upToDate"),
      icon: CheckCircle,
    },
    {
      id: 2,
      title: t("igrPayments"),
      status: "compliant",
      message: t("compliant"),
      icon: CheckCircle,
    },
    {
      id: 3,
      title: t("amoContributions"),
      status: "warning",
      message: t("dueInDays"),
      icon: Clock,
    },
    {
      id: 4,
      title: t("laborCode"),
      status: "compliant",
      message: t("compliant"),
      icon: CheckCircle,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "compliant":
        return "text-green-600 dark:text-green-400";
      case "warning":
        return "text-yellow-600 dark:text-yellow-400";
      case "error":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case "compliant":
        return "bg-green-500";
      case "warning":
        return "bg-yellow-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <GlassCard className="p-6">
      <h3 className="font-bold mb-4 text-gray-900 dark:text-white">
        {t("complianceStatus")}
      </h3>
      
      <div className="space-y-4">
        {complianceItems.map((item) => {
          const Icon = item.icon;
          
          return (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${getStatusDot(item.status)}`} />
                <span className="text-sm text-gray-900 dark:text-white">
                  {item.title}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Icon className={`h-4 w-4 ${getStatusColor(item.status)}`} />
                <span className={`text-sm font-medium ${getStatusColor(item.status)}`}>
                  {item.message}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-blue-500/10 dark:bg-blue-500/20 rounded-xl">
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
            Conformité générale: 95%
          </span>
        </div>
        <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
          Votre entreprise respecte les principales obligations légales marocaines.
        </p>
      </div>
    </GlassCard>
  );
}
