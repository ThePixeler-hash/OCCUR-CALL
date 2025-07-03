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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  UserPlus, 
  Search, 
  Edit, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  DollarSign,
  Users
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { Employee } from "@shared/schema";

export default function Employees() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    employeeNumber: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    birthDate: "",
    hireDate: "",
    position: "",
    department: "",
    baseSalary: "",
    cnssNumber: "",
    bankAccount: "",
  });

  const { data: employees, isLoading } = useQuery({
    queryKey: ["/api/employees"],
    retry: false,
  });

  const createEmployeeMutation = useMutation({
    mutationFn: async (employeeData: any) => {
      await apiRequest("POST", "/api/employees", employeeData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/employees"] });
      setIsDialogOpen(false);
      resetForm();
      toast({
        title: "Succès",
        description: "L'employé a été créé avec succès.",
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
        description: "Impossible de créer l'employé.",
        variant: "destructive",
      });
    },
  });

  const updateEmployeeMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      await apiRequest("PUT", `/api/employees/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/employees"] });
      setIsDialogOpen(false);
      resetForm();
      setEditingEmployee(null);
      toast({
        title: "Succès",
        description: "L'employé a été mis à jour avec succès.",
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
        description: "Impossible de mettre à jour l'employé.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      employeeNumber: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      birthDate: "",
      hireDate: "",
      position: "",
      department: "",
      baseSalary: "",
      cnssNumber: "",
      bankAccount: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const employeeData = {
      ...formData,
      baseSalary: parseFloat(formData.baseSalary) || 0,
    };

    if (editingEmployee) {
      updateEmployeeMutation.mutate({ id: editingEmployee.id, data: employeeData });
    } else {
      createEmployeeMutation.mutate(employeeData);
    }
  };

  const openEditDialog = (employee: Employee) => {
    setEditingEmployee(employee);
    setFormData({
      employeeNumber: employee.employeeNumber,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email || "",
      phone: employee.phone || "",
      address: employee.address || "",
      birthDate: employee.birthDate || "",
      hireDate: employee.hireDate,
      position: employee.position || "",
      department: employee.department || "",
      baseSalary: employee.baseSalary.toString(),
      cnssNumber: employee.cnssNumber || "",
      bankAccount: employee.bankAccount || "",
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingEmployee(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const filteredEmployees = employees?.filter((employee: Employee) =>
    `${employee.firstName} ${employee.lastName} ${employee.position} ${employee.department}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return (
      <div className="pt-20 pb-20 md:pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded" />
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
              {t("employees")}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Gérez vos employés et leurs informations
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={openCreateDialog}
                className="bg-primary hover:bg-primary/90"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Nouvel employé
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingEmployee ? "Modifier l'employé" : "Nouvel employé"}
                </DialogTitle>
                <DialogDescription>
                  {editingEmployee 
                    ? "Modifiez les informations de l'employé" 
                    : "Ajoutez un nouvel employé à votre entreprise"}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="employeeNumber">Matricule</Label>
                    <Input
                      id="employeeNumber"
                      value={formData.employeeNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, employeeNumber: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="position">Poste</Label>
                    <Input
                      id="position"
                      value={formData.position}
                      onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="department">Département</Label>
                    <Input
                      id="department"
                      value={formData.department}
                      onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="baseSalary">Salaire de base (MAD)</Label>
                    <Input
                      id="baseSalary"
                      type="number"
                      value={formData.baseSalary}
                      onChange={(e) => setFormData(prev => ({ ...prev, baseSalary: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="hireDate">Date d'embauche</Label>
                    <Input
                      id="hireDate"
                      type="date"
                      value={formData.hireDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, hireDate: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="birthDate">Date de naissance</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cnssNumber">Numéro CNSS</Label>
                    <Input
                      id="cnssNumber"
                      value={formData.cnssNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, cnssNumber: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="bankAccount">Compte bancaire</Label>
                    <Input
                      id="bankAccount"
                      value={formData.bankAccount}
                      onChange={(e) => setFormData(prev => ({ ...prev, bankAccount: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="address">Adresse</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Annuler
                  </Button>
                  <Button 
                    type="submit"
                    disabled={createEmployeeMutation.isPending || updateEmployeeMutation.isPending}
                  >
                    {editingEmployee ? "Mettre à jour" : "Créer"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-3">
            <GlassCard className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher un employé..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 dark:bg-black/20 border-white/20"
                />
              </div>
            </GlassCard>
          </div>
          
          <GlassCard className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {filteredEmployees.length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Employés
                </p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Employees Table */}
        <GlassCard className="overflow-hidden">
          {filteredEmployees.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {searchTerm ? "Aucun employé trouvé" : "Aucun employé"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchTerm 
                  ? "Essayez de modifier votre recherche"
                  : "Commencez par ajouter votre premier employé"
                }
              </p>
              {!searchTerm && (
                <Button onClick={openCreateDialog}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Ajouter un employé
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employé</TableHead>
                  <TableHead>Poste</TableHead>
                  <TableHead>Département</TableHead>
                  <TableHead>Salaire</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee: Employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {employee.firstName} {employee.lastName}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {employee.employeeNumber}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-900 dark:text-white">
                        {employee.position || "-"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-900 dark:text-white">
                        {employee.department || "-"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {parseFloat(employee.baseSalary).toLocaleString()} MAD
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {employee.email && (
                          <div className="flex items-center space-x-1 text-sm">
                            <Mail className="h-3 w-3 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-400">
                              {employee.email}
                            </span>
                          </div>
                        )}
                        {employee.phone && (
                          <div className="flex items-center space-x-1 text-sm">
                            <Phone className="h-3 w-3 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-400">
                              {employee.phone}
                            </span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(employee)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
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
