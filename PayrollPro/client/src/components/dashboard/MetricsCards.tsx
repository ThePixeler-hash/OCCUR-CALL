import { useQuery } from "@tanstack/react-query";
import { GlassCard } from "@/components/ui/glass-card";
import { useLanguage } from "@/providers/LanguageProvider";
import { Users, DollarSign, AlertTriangle, Clock } from "lucide-react";

export function MetricsCards() {
  const { t } = useLanguage();
  
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["/api/dashboard/metrics"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <GlassCard key={i} className="p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
              <div className="w-12 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
            <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
            <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
          </GlassCard>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: t("totalEmployees"),
      value: metrics?.totalEmployees?.toString() || "0",
      change: "+12%",
      changeType: "positive" as const,
      icon: Users,
      color: "blue",
    },
    {
      title: t("monthlyPayroll"),
      value: metrics?.monthlyPayroll?.toLocaleString() || "0",
      subtitle: "MAD",
      change: "+8%",
      changeType: "positive" as const,
      icon: DollarSign,
      color: "green",
    },
    {
      title: t("complianceIssues"),
      value: metrics?.complianceIssues?.toString() || "0",
      change: "3",
      changeType: metrics?.complianceIssues > 0 ? "negative" : "positive" as const,
      icon: AlertTriangle,
      color: "yellow",
    },
    {
      title: t("attendanceRate"),
      value: `${metrics?.attendanceRate || 0}%`,
      change: "98.5%",
      changeType: "positive" as const,
      icon: Clock,
      color: "purple",
    },
  ];

  const colorClasses = {
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    green: "bg-green-500/10 text-green-600 dark:text-green-400",
    yellow: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        
        return (
          <GlassCard key={index} className="p-6" hover>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[card.color]}`}>
                <Icon className="h-6 w-6" />
              </div>
              <span className={`text-sm font-medium ${
                card.changeType === "positive" 
                  ? "text-green-600 dark:text-green-400" 
                  : "text-red-600 dark:text-red-400"
              }`}>
                {card.change}
              </span>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-baseline space-x-2">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {card.value}
                </h3>
                {card.subtitle && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {card.subtitle}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {card.title}
              </p>
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
}
