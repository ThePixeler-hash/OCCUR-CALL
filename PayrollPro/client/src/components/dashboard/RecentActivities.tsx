import { GlassCard } from "@/components/ui/glass-card";
import { useLanguage } from "@/providers/LanguageProvider";
import { Check, UserPlus, FileText, Calendar } from "lucide-react";

export function RecentActivities() {
  const { t } = useLanguage();

  const activities = [
    {
      id: 1,
      icon: Check,
      title: "Paie traitée pour décembre",
      time: "Il y a 2 heures",
      color: "green",
    },
    {
      id: 2,
      icon: UserPlus,
      title: "Nouvel employé ajouté",
      time: "Il y a 5 heures",
      color: "blue",
    },
    {
      id: 3,
      icon: FileText,
      title: "Rapport CNSS généré",
      time: "Il y a 1 jour",
      color: "yellow",
    },
    {
      id: 4,
      icon: Calendar,
      title: "Planification de paie",
      time: "Il y a 2 jours",
      color: "purple",
    },
  ];

  const colorClasses = {
    green: "bg-green-500/10 text-green-600 dark:text-green-400",
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    yellow: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  };

  return (
    <GlassCard className="p-6">
      <h3 className="font-bold mb-4 text-gray-900 dark:text-white">
        {t("recentActivities")}
      </h3>
      
      <div className="space-y-3">
        {activities.map((activity) => {
          const Icon = activity.icon;
          
          return (
            <div
              key={activity.id}
              className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 dark:bg-black/20 hover:bg-white/10 dark:hover:bg-black/30 transition-colors cursor-pointer"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorClasses[activity.color as keyof typeof colorClasses]}`}>
                <Icon className="h-4 w-4" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {activity.title}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {activity.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
