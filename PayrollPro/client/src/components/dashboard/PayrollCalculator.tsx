import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/providers/LanguageProvider";
import { useToast } from "@/hooks/use-toast";
import { Calculator } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface PayrollCalculation {
  grossSalary: number;
  cnssEmployee: number;
  cnssEmployer: number;
  amoEmployee: number;
  amoEmployer: number;
  igrTax: number;
  professionalExpenses: number;
  netSalary: number;
}

export function PayrollCalculator() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [calculation, setCalculation] = useState<PayrollCalculation | null>(null);
  const [formData, setFormData] = useState({
    baseSalary: 8000,
    workingDays: 22,
    standardWorkingDays: 22,
    overtimeHours: 0,
    bonuses: 0,
    deductions: 0,
    dependents: 0,
  });

  const calculateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest("POST", "/api/payroll/calculate", data);
      return response.json();
    },
    onSuccess: (result) => {
      setCalculation(result);
      toast({
        title: "Calcul terminé",
        description: "Les calculs de paie ont été effectués avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur de calcul",
        description: "Impossible de calculer la paie. Vérifiez les données saisies.",
        variant: "destructive",
      });
    },
  });

  const handleCalculate = () => {
    calculateMutation.mutate(formData);
  };

  const updateFormData = (field: string, value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {t("payrollCalculator")}
        </h3>
        <Button 
          onClick={handleCalculate}
          disabled={calculateMutation.isPending}
          className="bg-primary hover:bg-primary/90"
        >
          <Calculator className="mr-2 h-4 w-4" />
          {calculateMutation.isPending ? "Calcul..." : t("calculate")}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-2">
          <Label htmlFor="baseSalary">{t("baseSalary")}</Label>
          <Input
            id="baseSalary"
            type="number"
            value={formData.baseSalary}
            onChange={(e) => updateFormData("baseSalary", parseFloat(e.target.value) || 0)}
            className="bg-white/10 dark:bg-black/20 border-white/20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="workingDays">{t("workingDays")}</Label>
          <Input
            id="workingDays"
            type="number"
            value={formData.workingDays}
            onChange={(e) => updateFormData("workingDays", parseFloat(e.target.value) || 0)}
            className="bg-white/10 dark:bg-black/20 border-white/20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="overtimeHours">Heures supplémentaires</Label>
          <Input
            id="overtimeHours"
            type="number"
            value={formData.overtimeHours}
            onChange={(e) => updateFormData("overtimeHours", parseFloat(e.target.value) || 0)}
            className="bg-white/10 dark:bg-black/20 border-white/20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dependents">Personnes à charge</Label>
          <Input
            id="dependents"
            type="number"
            value={formData.dependents}
            onChange={(e) => updateFormData("dependents", parseFloat(e.target.value) || 0)}
            className="bg-white/10 dark:bg-black/20 border-white/20"
          />
        </div>
      </div>

      {calculation && (
        <div className="space-y-4">
          <h4 className="font-semibold text-lg text-gray-900 dark:text-white">
            Calculs Fiscaux (Règles 2025)
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlassCard className="p-4">
              <h5 className="font-medium mb-3 text-gray-900 dark:text-white">
                Cotisations CNSS
              </h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Employé (6,74%)</span>
                  <span className="font-medium">{calculation.cnssEmployee.toFixed(2)} MAD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Employeur (21,09%)</span>
                  <span className="font-medium">{calculation.cnssEmployer.toFixed(2)} MAD</span>
                </div>
                <div className="border-t pt-2 font-medium border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between">
                    <span>Total (27,83%)</span>
                    <span>{(calculation.cnssEmployee + calculation.cnssEmployer).toFixed(2)} MAD</span>
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-4">
              <h5 className="font-medium mb-3 text-gray-900 dark:text-white">
                AMO Assurance Santé
              </h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Employé (2,26%)</span>
                  <span className="font-medium">{calculation.amoEmployee.toFixed(2)} MAD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Employeur (4,11%)</span>
                  <span className="font-medium">{calculation.amoEmployer.toFixed(2)} MAD</span>
                </div>
                <div className="border-t pt-2 font-medium border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between">
                    <span>Total (6,37%)</span>
                    <span>{(calculation.amoEmployee + calculation.amoEmployer).toFixed(2)} MAD</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>

          <GlassCard className="p-4">
            <h5 className="font-medium mb-3 text-gray-900 dark:text-white">
              IGR Impôt sur le Revenu (Progressif 2025)
            </h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Salaire imposable</span>
                <span className="font-medium">
                  {(calculation.grossSalary - calculation.cnssEmployee - calculation.amoEmployee).toFixed(2)} MAD
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Frais professionnels (30%)</span>
                <span className="font-medium">{calculation.professionalExpenses.toFixed(2)} MAD</span>
              </div>
              <div className="border-t pt-2 font-medium border-gray-200 dark:border-gray-700">
                <div className="flex justify-between">
                  <span>Montant IGR</span>
                  <span>{calculation.igrTax.toFixed(2)} MAD</span>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-4 bg-green-500/10 border-green-500/20">
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg text-gray-900 dark:text-white">
                {t("netSalary")}
              </span>
              <span className="font-bold text-2xl text-green-600 dark:text-green-400">
                {calculation.netSalary.toFixed(2)} MAD
              </span>
            </div>
          </GlassCard>
        </div>
      )}
    </GlassCard>
  );
}
