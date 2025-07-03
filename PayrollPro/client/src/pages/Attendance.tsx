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
  Clock, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Users,
  TrendingUp,
  Timer
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { fr } from "date-fns/locale";

export default function Attendance() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), "yyyy-MM"));

  const { data: employees } = useQuery({
    queryKey: ["/api/employees"],
    retry: false,
  });

  const { data: attendance, isLoading: attendanceLoading } = useQuery({
    queryKey: ["/api/attendance", selectedEmployee, selectedMonth],
    enabled: !!selectedEmployee,
    queryFn: async () => {
      if (!selectedEmployee) return [];
      
      const startDate = startOfMonth(new Date(selectedMonth + "-01"));
      const endDate = endOfMonth(new Date(selectedMonth + "-01"));
      
      const response = await fetch(
        `/api/attendance/${selectedEmployee}?startDate=${format(startDate, "yyyy-MM-dd")}&endDate=${format(endDate, "yyyy-MM-dd")}`,
        { credentials: "include" }
      );
      
      if (!response.ok) throw new Error("Failed to fetch attendance");
      return response.json();
    },
  });

  const addAttendanceMutation = useMutation({
    mutationFn: async (attendanceData: any) => {
      await apiRequest("POST", "/api/attendance", attendanceData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/attendance"] });
      toast({
        title: "Succès",
        description: "Présence enregistrée avec succès.",
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
        description: "Impossible d'enregistrer la présence.",
        variant: "destructive",
      });
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "absent":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "late":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case "sick":
        return <AlertCircle className="h-4 w-4 text-blue-600" />;
      case "vacation":
        return <Calendar className="h-4 w-4 text-purple-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      present: "Présent",
      absent: "Absent",
      late: "Retard",
      sick: "Malade",
      vacation: "Congé",
    };
    return labels[status as keyof typeof labels] || status;
  };

  const calculateStats = () => {
    if (!attendance || attendance.length === 0) {
      return { totalDays: 0, presentDays: 0, absentDays: 0, lateCount: 0, attendanceRate: 0 };
    }

    const totalDays = attendance.length;
    const presentDays = attendance.filter((a: any) => a.status === "present").length;
    const absentDays = attendance.filter((a: any) => a.status === "absent").length;
    const lateCount = attendance.filter((a: any) => a.status === "late").length;
    const attendanceRate = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

    return { totalDays, presentDays, absentDays, lateCount, attendanceRate };
  };

  const stats = calculateStats();

  return (
    <div className="pt-20 pb-20 md:pb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t("attendance")}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Suivi et gestion de la présence des employés
          </p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <GlassCard className="p-4">
            <Label htmlFor="employee">Employé</Label>
            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <SelectTrigger className="mt-1 bg-white/10 dark:bg-black/20 border-white/20">
                <SelectValue placeholder="Sélectionner un employé" />
              </SelectTrigger>
              <SelectContent>
                {employees?.map((employee: any) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.firstName} {employee.lastName} - {employee.employeeNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </GlassCard>

          <GlassCard className="p-4">
            <Label htmlFor="month">Mois</Label>
            <Input
              id="month"
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="mt-1 bg-white/10 dark:bg-black/20 border-white/20"
            />
          </GlassCard>
        </div>

        {/* Statistics */}
        {selectedEmployee && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <GlassCard className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {stats.totalDays}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Jours total
                  </p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500/10 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center">
                  <CheckCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {stats.presentDays}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Présent
                  </p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl flex items-center justify-center">
                  <XCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {stats.absentDays}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Absent
                  </p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded-xl flex items-center justify-center">
                  <Timer className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {stats.lateCount}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Retards
                  </p>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {stats.attendanceRate.toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Taux présence
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {/* Attendance Table */}
        <GlassCard className="overflow-hidden">
          {!selectedEmployee ? (
            <div className="p-12 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Sélectionner un employé
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Choisissez un employé pour voir son historique de présence
              </p>
            </div>
          ) : attendanceLoading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Chargement des données de présence...
              </p>
            </div>
          ) : !attendance || attendance.length === 0 ? (
            <div className="p-12 text-center">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Aucune donnée de présence
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Aucun enregistrement trouvé pour cette période
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Arrivée</TableHead>
                  <TableHead>Départ</TableHead>
                  <TableHead>Heures travaillées</TableHead>
                  <TableHead>Heures sup.</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendance.map((record: any) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {format(new Date(record.date), "dd MMM yyyy", { locale: fr })}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-900 dark:text-white">
                        {record.checkIn 
                          ? format(new Date(record.checkIn), "HH:mm")
                          : "-"
                        }
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-900 dark:text-white">
                        {record.checkOut 
                          ? format(new Date(record.checkOut), "HH:mm")
                          : "-"
                        }
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-900 dark:text-white">
                        {record.hoursWorked ? `${record.hoursWorked}h` : "-"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-900 dark:text-white">
                        {record.overtimeHours ? `${record.overtimeHours}h` : "-"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(record.status)}
                        <span className="text-gray-900 dark:text-white">
                          {getStatusLabel(record.status)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-600 dark:text-gray-400 text-sm">
                        {record.notes || "-"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
