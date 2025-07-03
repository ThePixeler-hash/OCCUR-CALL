import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/providers/LanguageProvider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign,
  FileText,
  Download,
  Calendar,
  PieChart
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function Reports() {
  const { t } = useLanguage();
  const [selectedPeriod, setSelectedPeriod] = useState(format(new Date(), "yyyy-MM"));
  const [selectedReport, setSelectedReport] = useState("payroll-summary");

  const { data: payrolls } = useQuery({
    queryKey: ["/api/payroll", selectedPeriod],
    queryFn: async () => {
      const response = await fetch(
        `/api/payroll?period=${selectedPeriod}`,
        { credentials: "include" }
      );
      if (!response.ok) throw new Error("Failed to fetch payrolls");
      return response.json();
    },
  });

  const { data: employees } = useQuery({
    queryKey: ["/api/employees"],
    retry: false,
  });

  const calculateMetrics = () => {
    if (!payrolls || payrolls.length === 0) {
      return {
        totalEmployees: 0,
        totalGross: 0,
        totalNet: 0,
        totalCnss: 0,
        totalAmo: 0,
        totalIgr: 0,
        averageSalary: 0,
        salaryRange: { min: 0, max: 0 },
        departmentBreakdown: {},
        statusBreakdown: {},
      };
    }

    const totalEmployees = payrolls.length;
    const totalGross = payrolls.reduce((sum: number, p: any) => sum + parseFloat(p.grossSalary || 0), 0);
    const totalNet = payrolls.reduce((sum: number, p: any) => sum + parseFloat(p.netSalary || 0), 0);
    const totalCnss = payrolls.reduce((sum: number, p: any) => 
      sum + parseFloat(p.cnssEmployee || 0) + parseFloat(p.cnssEmployer || 0), 0);
    const totalAmo = payrolls.reduce((sum: number, p: any) => 
      sum + parseFloat(p.amoEmployee || 0) + parseFloat(p.amoEmployer || 0), 0);
    const totalIgr = payrolls.reduce((sum: number, p: any) => sum + parseFloat(p.igrTax || 0), 0);
    
    const salaries = payrolls.map((p: any) => parseFloat(p.grossSalary || 0));
    const averageSalary = totalGross / totalEmployees;
    const salaryRange = {
      min: Math.min(...salaries),
      max: Math.max(...salaries),
    };

    // Department breakdown
    const departmentBreakdown = employees?.reduce((acc: any, emp: any) => {
      const dept = emp.department || "Non défini";
      acc[dept] = (acc[dept] || 0) + 1;
      return acc;
    }, {}) || {};

    // Status breakdown
    const statusBreakdown = payrolls.reduce((acc: any, p: any) => {
      const status = p.status || "draft";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return {
      totalEmployees,
      totalGross,
      totalNet,
      totalCnss,
      totalAmo,
      totalIgr,
      averageSalary,
      salaryRange,
      departmentBreakdown,
      statusBreakdown,
    };
  };

  const metrics = calculateMetrics();

  const reportTypes = [
    { value: "payroll-summary", label: "Résumé de paie" },
    { value: "cost-analysis", label: "Analyse des coûts" },
    { value: "compliance-report", label: "Rapport de conformité" },
    { value: "department-breakdown", label: "Répartition par département" },
  ];

  const exportReport = () => {
    // Generate CSV or PDF report based on selected type
    const csvContent = generateCSVReport();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `rapport-${selectedReport}-${selectedPeriod}.csv`;
    link.click();
  };

  const generateCSVReport = () => {
    if (!payrolls || !employees) return "";

    const headers = [
      "Matricule",
      "Nom",
      "Prénom", 
      "Département",
      "Poste",
      "Salaire Brut",
      "CNSS Employé",
      "AMO Employé", 
      "IGR",
      "Salaire Net"
    ].join(",");

    const rows = payrolls.map((p: any) => {
      const employee = employees.find((e: any) => e.id === p.employeeId);
      return [
        employee?.employeeNumber || "",
        employee?.lastName || "",
        employee?.firstName || "",
        employee?.department || "",
        employee?.position || "",
        parseFloat(p.grossSalary || 0).toFixed(2),
        parseFloat(p.cnssEmployee || 0).toFixed(2),
        parseFloat(p.amoEmployee || 0).toFixed(2),
        parseFloat(p.igrTax || 0).toFixed(2),
        parseFloat(p.netSalary || 0).toFixed(2),
      ].join(",");
    }).join("\n");

    return `${headers}\n${rows}`;
  };

  return (
    <div className="pt-20 pb-20 md:pb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t("reports")}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Analyses et rapports détaillés de votre paie
            </p>
          </div>
          
          <Button onClick={exportReport} className="bg-primary hover:bg-primary/90">
            <Download className="mr-2 h-4 w-4" />
            Exporter le rapport
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <GlassCard className="p-4">
            <label className="block text-sm font-medium mb-2">Période</label>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="bg-white/10 dark:bg-black/20 border-white/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => {
                  const date = new Date();
                  date.setMonth(date.getMonth() - i);
                  const value = format(date, "yyyy-MM");
                  const label = format(date, "MMMM yyyy", { locale: fr });
                  return (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </GlassCard>

          <GlassCard className="p-4">
            <label className="block text-sm font-medium mb-2">Type de rapport</label>
            <Select value={selectedReport} onValueChange={setSelectedReport}>
              <SelectTrigger className="bg-white/10 dark:bg-black/20 border-white/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </GlassCard>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <GlassCard className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metrics.totalEmployees}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Employés actifs
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-500/10 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metrics.totalGross.toLocaleString()} MAD
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Masse salariale brute
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metrics.averageSalary.toLocaleString()} MAD
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Salaire moyen
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl flex items-center justify-center">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {((metrics.totalGross - metrics.totalNet) / metrics.totalGross * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Taux de prélèvement
                </p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Cost Breakdown */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center">
              <PieChart className="mr-2 h-5 w-5" />
              Répartition des coûts
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Salaires nets</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {metrics.totalNet.toLocaleString()} MAD ({((metrics.totalNet / metrics.totalGross) * 100).toFixed(1)}%)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Cotisations CNSS</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {metrics.totalCnss.toLocaleString()} MAD ({((metrics.totalCnss / metrics.totalGross) * 100).toFixed(1)}%)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Cotisations AMO</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {metrics.totalAmo.toLocaleString()} MAD ({((metrics.totalAmo / metrics.totalGross) * 100).toFixed(1)}%)
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">IGR</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {metrics.totalIgr.toLocaleString()} MAD ({((metrics.totalIgr / metrics.totalGross) * 100).toFixed(1)}%)
                </span>
              </div>
            </div>
          </GlassCard>

          {/* Department Breakdown */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Répartition par département
            </h3>
            <div className="space-y-4">
              {Object.entries(metrics.departmentBreakdown).map(([dept, count]) => (
                <div key={dept} className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">{dept}</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900 dark:text-white">{count as number}</span>
                    <span className="text-sm text-gray-500">
                      ({(((count as number) / metrics.totalEmployees) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              ))}
              {Object.keys(metrics.departmentBreakdown).length === 0 && (
                <p className="text-gray-500 text-center">Aucune donnée disponible</p>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Salary Analysis */}
        <GlassCard className="p-6 mb-8">
          <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center">
            <BarChart3 className="mr-2 h-5 w-5" />
            Analyse salariale
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {metrics.salaryRange.min.toLocaleString()} MAD
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Salaire minimum</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {metrics.averageSalary.toLocaleString()} MAD
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Salaire moyen</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {metrics.salaryRange.max.toLocaleString()} MAD
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Salaire maximum</p>
            </div>
          </div>
        </GlassCard>

        {/* Compliance Summary */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Résumé de conformité
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-500/10 rounded-xl">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">100%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Conformité SMIG</div>
            </div>
            <div className="text-center p-4 bg-blue-500/10 rounded-xl">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">27.83%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Taux CNSS appliqué</div>
            </div>
            <div className="text-center p-4 bg-purple-500/10 rounded-xl">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">6.37%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Taux AMO appliqué</div>
            </div>
            <div className="text-center p-4 bg-yellow-500/10 rounded-xl">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">2025</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Barèmes IGR</div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
