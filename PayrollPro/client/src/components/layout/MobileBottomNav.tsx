import { Link, useLocation } from "wouter";
import { useLanguage } from "@/providers/LanguageProvider";
import { cn } from "@/lib/utils";
import { Home, Users, Clock, DollarSign, BarChart3 } from "lucide-react";

export function MobileBottomNav() {
  const [location] = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { path: "/", icon: Home, label: t("dashboard") },
    { path: "/employees", icon: Users, label: "Staff" },
    { path: "/attendance", icon: Clock, label: "Time" },
    { path: "/payroll", icon: DollarSign, label: "Pay" },
    { path: "/reports", icon: BarChart3, label: "Reports" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40">
      <div className="backdrop-blur-xl bg-white/90 dark:bg-black/90 border-t border-white/20 dark:border-white/10">
        <div className="grid grid-cols-5 gap-1 px-2 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            
            return (
              <Link key={item.path} href={item.path}>
                <button
                  className={cn(
                    "flex flex-col items-center py-2 px-1 space-y-1 rounded-lg transition-all duration-200",
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-gray-600 dark:text-gray-400 hover:text-primary"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
