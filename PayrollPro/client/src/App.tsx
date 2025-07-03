import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { LanguageProvider } from "@/providers/LanguageProvider";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

// Layout Components
import { Navigation } from "@/components/layout/Navigation";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

// Pages
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Employees from "@/pages/Employees";
import Attendance from "@/pages/Attendance";
import Payroll from "@/pages/Payroll";
import Reports from "@/pages/Reports";

// AI Modal Component
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AIAssistant } from "@/components/dashboard/AIAssistant";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  const handleAIToggle = () => {
    setIsAIModalOpen(!isAIModalOpen);
  };

  return (
    <>
      {/* Navigation - only show for authenticated users */}
      {isAuthenticated && <Navigation onAIToggle={handleAIToggle} />}
      
      <Switch>
        {isLoading || !isAuthenticated ? (
          <Route path="/" component={Landing} />
        ) : (
          <>
            <Route path="/" component={Dashboard} />
            <Route path="/employees" component={Employees} />
            <Route path="/attendance" component={Attendance} />
            <Route path="/payroll" component={Payroll} />
            <Route path="/reports" component={Reports} />
          </>
        )}
        <Route component={NotFound} />
      </Switch>

      {/* Mobile Bottom Navigation - only show for authenticated users */}
      {isAuthenticated && <MobileBottomNav />}

      {/* AI Assistant Modal */}
      <Dialog open={isAIModalOpen} onOpenChange={setIsAIModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-lg flex items-center justify-center">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L3 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.734.99A.996.996 0 0118 6v2a1 1 0 11-2 0v-.277l-1.254.145a1 1 0 11-.992-1.736L14.984 6l-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.723V12a1 1 0 11-2 0v-1.277l-1.246-.855a1 1 0 01-.372-1.364zM3 11a1 1 0 011 1v1.277l1.246.855a1 1 0 11-.992 1.736l-1.75-1A1 1 0 012 14v-2a1 1 0 011-1zm14 0a1 1 0 011 1v2a1 1 0 01-.504.868l-1.75 1a1 1 0 11-.992-1.736L16 13.277V12a1 1 0 011-1zm-9.618 5.504a1 1 0 011.364.372l.254.145V16a1 1 0 112 0v1.021l.254-.145a1 1 0 11.992 1.736l-1.735.992a.995.995 0 01-1.022 0l-1.735-.992a1 1 0 01-.372-1.364z" clipRule="evenodd" />
                </svg>
              </div>
              <span>Assistant IA</span>
            </DialogTitle>
            <DialogDescription>
              Expert en droit du travail marocain et conformité paie
            </DialogDescription>
          </DialogHeader>
          
          <div className="h-96">
            <AIAssistant />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <TooltipProvider>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
              <Toaster />
              <Router />
            </div>
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
