import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/providers/LanguageProvider";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  DollarSign, 
  Download, 
  Eye, 
  Calculator,
  FileText,
  TrendingUp,
  Users,
  Calendar
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function Payroll() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPeriod, setSelectedPeriod] = useState(format(new Date(), "yyyy-MM"));
  const [viewingPayroll, setViewingPayroll] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: employees } = useQuery({
    queryKey: ["/api/employees"],
    retry: false,
  });

  const { data: payrolls, isLoading } = useQuery({
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

  const generateDocumentMutation = useMutation({
    mutationFn: async ({ type, payrollId, period }: { type: string; payrollId?: string; period?: string }) => {
      let url = "";
      let body = {};
      
      if (type === "payslip" && payrollId) {
        url = `/api/documents/payslip/${payrollId}`;
      } else if (type === "cnss-report" && period) {
        url = "/api/documents/cnss-report";
        body = { period };
      } else if (type === "amo-report" && period) {
        url = "/api/documents/amo-report";
        body = { period };
      }
      
      const response = await apiRequest("POST", url, Object.keys(body).length > 0 ? body : undefined);
      return response;
    },
    onSuccess: (response, variables) => {
      // Create download link
      response.blob().then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${variables.type}-${variables.period || 'document'}.html`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      });
      
      toast({
        title: "Document généré",
        description: "Le document a été téléchargé avec succès.",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Non autorisé",
          description: "Vous êtes déconnecté. Reconnexion...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Erreur",
        description: "Impossible de générer le document.",
        variant: "destructive",
      });
    },
  });

  const calculateStats = () => {
    if (!payrolls || payrolls.length === 0) {
      return { 
        totalEmployees: 0, 
        totalGross: 0, 
        totalNet: 0, 
        totalCnss: 0, 
        totalAmo: 0, 
        totalIgr: 0 
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

    return { totalEmployees, totalGross, totalNet, totalCnss, totalAmo, totalIgr };
  };

  const stats = calculateStats();

  const viewPayrollDetails = (payroll: any) => {
    const employee = employees?.find((e: any) => e.id === payroll.employeeId);
    setViewingPayroll({ ...payroll, employee });
    setIsDialogOpen(true);
  };

  const downloadPayslip = (payrollId: string) => {
    generateDocumentMutation.mutate({ type: "payslip", payrollId });
  };

  const downloadCNSSReport = () => {
    generateDocumentMutation.mutate({ type: "cnss-report", period: selectedPeriod });
  };

  const downloadAMOReport = () => {
    generateDocumentMutation.mutate({ type: "amo-report", period: selectedPeriod });
  };

  if (isLoading) {
    return (
      <div className="pt-20 pb-20 md:pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded" />
              ))}
            </div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-20 md:pb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t("payroll")}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Gestion et suivi des bulletins de paie
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={downloadCNSSReport}
              disabled={!payrolls || payrolls.length === 0 || generateDocumentMutation.isPending}
            >
              <FileText className="mr-2 h-4 w-4" />
              Rapport CNSS
            </Button>
            <Button 
              variant="outline" 
              onClick={downloadAMOReport}
              disabled={!payrolls || payrolls.length === 0 || generateDocumentMutation.isPending}
            >
              <FileText className="mr-2 h-4 w-4" />
              Rapport AMO
            </Button>
          </div>
        </div>

        {/* Period Selector */}
        <div className="mb-8">
          <GlassCard className="p-4">
            <Label htmlFor="period">Période</Label>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="mt-1 max-w-xs bg-white/10 dark:bg-black/20 border-white/20">
                <SelectValue placeholder="Sélectionner une période" />
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
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <GlassCard className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalEmployees}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Employés payés
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
                  {stats.totalGross.toLocaleString()} MAD
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
                  {stats.totalNet.toLocaleString()} MAD
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Masse salariale nette
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded-xl flex items-center justify-center">
                <Calculator className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalCnss.toLocaleString()} MAD
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total CNSS
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl flex items-center justify-center">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalAmo.toLocaleString()} MAD
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total AMO
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalIgr.toLocaleString()} MAD
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total IGR
                </p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Payroll Table */}
        <GlassCard className="overflow-hidden">
          {!payrolls || payrolls.length === 0 ? (
            <div className="p-12 text-center">
              <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Aucune paie trouvée
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Aucun bulletin de paie pour cette période
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employé</TableHead>
                  <TableHead>Salaire brut</TableHead>
                  <TableHead>Cotisations</TableHead>
                  <TableHead>IGR</TableHead>
                  <TableHead>Salaire net</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payrolls.map((payroll: any) => {
                  const employee = employees?.find((e: any) => e.id === payroll.employeeId);
                  const totalContributions = 
                    parseFloat(payroll.cnssEmployee || 0) + 
                    parseFloat(payroll.amoEmployee || 0);
                  
                  return (
                    <TableRow key={payroll.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {employee ? `${employee.firstName} ${employee.lastName}` : "Employé inconnu"}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {employee?.employeeNumber || "-"}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {parseFloat(payroll.grossSalary).toLocaleString()} MAD
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-gray-900 dark:text-white">
                          {totalContributions.toLocaleString()} MAD
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-gray-900 dark:text-white">
                          {parseFloat(payroll.igrTax || 0).toLocaleString()} MAD
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-green-600 dark:text-green-400">
                          {parseFloat(payroll.netSalary).toLocaleString()} MAD
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          payroll.status === "paid" 
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : payroll.status === "approved"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                        }`}>
                          {payroll.status === "paid" ? "Payé" : 
                           payroll.status === "approved" ? "Approuvé" : 
                           payroll.status === "calculated" ? "Calculé" : "Brouillon"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => viewPayrollDetails(payroll)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => downloadPayslip(payroll.id)}
                            disabled={generateDocumentMutation.isPending}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </GlassCard>

        {/* Payroll Details Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Détails du bulletin de paie</DialogTitle>
              <DialogDescription>
                {viewingPayroll?.employee && 
                  `${viewingPayroll.employee.firstName} ${viewingPayroll.employee.lastName} - ${selectedPeriod}`
                }
              </DialogDescription>
            </DialogHeader>
            
            {viewingPayroll && (
              <div className="space-y-6">
                {/* Employee Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Employé</Label>
                    <p className="font-medium">
                      {viewingPayroll.employee?.firstName} {viewingPayroll.employee?.lastName}
                    </p>
                  </div>
                  <div>
                    <Label>Matricule</Label>
                    <p className="font-medium">{viewingPayroll.employee?.employeeNumber}</p>
                  </div>
                  <div>
                    <Label>Poste</Label>
                    <p className="font-medium">{viewingPayroll.employee?.position || "-"}</p>
                  </div>
                  <div>
                    <Label>Département</Label>
                    <p className="font-medium">{viewingPayroll.employee?.department || "-"}</p>
                  </div>
                </div>

                {/* Salary Breakdown */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Détail de la paie</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <GlassCard className="p-4">
                      <Label>Salaire de base</Label>
                      <p className="text-xl font-bold text-green-600 dark:text-green-400">
                        {parseFloat(viewingPayroll.baseSalary).toLocaleString()} MAD
                      </p>
                    </GlassCard>
                    
                    <GlassCard className="p-4">
                      <Label>Salaire brut</Label>
                      <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        {parseFloat(viewingPayroll.grossSalary).toLocaleString()} MAD
                      </p>
                    </GlassCard>
                  </div>

                  {/* Contributions */}
                  <div className="grid grid-cols-2 gap-4">
                    <GlassCard className="p-4">
                      <Label>CNSS Employé (6,74%)</Label>
                      <p className="text-lg font-semibold text-red-600 dark:text-red-400">
                        -{parseFloat(viewingPayroll.cnssEmployee || 0).toLocaleString()} MAD
                      </p>
                    </GlassCard>
                    
                    <GlassCard className="p-4">
                      <Label>AMO Employé (2,26%)</Label>
                      <p className="text-lg font-semibold text-red-600 dark:text-red-400">
                        -{parseFloat(viewingPayroll.amoEmployee || 0).toLocaleString()} MAD
                      </p>
                    </GlassCard>
                    
                    <GlassCard className="p-4">
                      <Label>IGR</Label>
                      <p className="text-lg font-semibold text-red-600 dark:text-red-400">
                        -{parseFloat(viewingPayroll.igrTax || 0).toLocaleString()} MAD
                      </p>
                    </GlassCard>
                    
                    <GlassCard className="p-4">
                      <Label>Frais professionnels</Label>
                      <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                        +{parseFloat(viewingPayroll.professionalExpenses || 0).toLocaleString()} MAD
                      </p>
                    </GlassCard>
                  </div>

                  {/* Net Salary */}
                  <GlassCard className="p-6 bg-green-500/10 border-green-500/20">
                    <div className="flex justify-between items-center">
                      <Label className="text-lg">Salaire net à payer</Label>
                      <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                        {parseFloat(viewingPayroll.netSalary).toLocaleString()} MAD
                      </p>
                    </div>
                  </GlassCard>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => downloadPayslip(viewingPayroll.id)}
                    disabled={generateDocumentMutation.isPending}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Télécharger
                  </Button>
                  <Button onClick={() => setIsDialogOpen(false)}>
                    Fermer
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
