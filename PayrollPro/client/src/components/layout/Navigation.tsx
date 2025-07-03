import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useTheme } from "@/providers/ThemeProvider";
import { useLanguage } from "@/providers/LanguageProvider";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Home,
  Users,
  Clock,
  DollarSign,
  BarChart3,
  Sun,
  Moon,
  Globe,
  Bot,
  Menu,
} from "lucide-react";

interface NavigationProps {
  onAIToggle: () => void;
}

export function Navigation({ onAIToggle }: NavigationProps) {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: "/", icon: Home, label: t("dashboard") },
    { path: "/employees", icon: Users, label: t("employees") },
    { path: "/attendance", icon: Clock, label: t("attendance") },
    { path: "/payroll", icon: DollarSign, label: t("payroll") },
    { path: "/reports", icon: BarChart3, label: t("reports") },
  ];

  const languages = [
    { code: "fr", label: "🇫🇷 Français" },
    { code: "ar", label: "🇲🇦 العربية" },
    { code: "darija", label: "🇲🇦 الدارجة" },
    { code: "en", label: "🇺🇸 English" },
    { code: "es", label: "🇪🇸 Español" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-40">
      <GlassCard className="mx-4 mt-4 px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              OCCUR-CALL
            </h1>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.path;
                
                return (
                  <Link key={item.path} href={item.path}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      className={cn(
                        "transition-all duration-200",
                        isActive && "bg-primary/10 text-primary dark:bg-primary/20"
                      )}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-2">
            {/* AI Assistant Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onAIToggle}
              className="relative"
            >
              <Bot className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </Button>

            {/* Theme Toggle */}
            <Button variant="ghost" size="sm" onClick={toggleTheme}>
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Globe className="h-4 w-4 mr-1" />
                  {language.toUpperCase()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as any)}
                    className={cn(
                      "cursor-pointer",
                      language === lang.code && "bg-primary/10"
                    )}
                  >
                    {lang.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Profile */}
            {user && (
              <div className="flex items-center space-x-3">
                <GlassCard className="px-3 py-2">
                  <div className="flex items-center space-x-2">
                    <img
                      src={(user as any).profileImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32"}
                      alt="User Avatar"
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <div className="hidden sm:block">
                      <p className="text-sm font-medium">
                        {(user as any).firstName} {(user as any).lastName}
                      </p>
                      <p className="text-xs opacity-70">Utilisateur</p>
                    </div>
                  </div>
                </GlassCard>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-white/20">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.path;
                
                return (
                  <Link key={item.path} href={item.path}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </GlassCard>
    </nav>
  );
}
