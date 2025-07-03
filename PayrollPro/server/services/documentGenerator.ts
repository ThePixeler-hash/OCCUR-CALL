interface PayslipData {
  employee: any;
  company: any;
  payroll: any;
  period: string;
}

interface CNSSReportData {
  company: any;
  employees: any[];
  period: string;
}

export class DocumentGenerator {
  static generatePayslip(data: PayslipData): string {
    const { employee, company, payroll, period } = data;
    
    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Bulletin de Paie - ${period}</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 12px; margin: 20px; }
        .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
        .company-info { float: left; width: 48%; }
        .employee-info { float: right; width: 48%; }
        .clear { clear: both; }
        .section { margin: 20px 0; }
        .calculation-table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        .calculation-table th, .calculation-table td { border: 1px solid #ccc; padding: 8px; text-align: right; }
        .calculation-table th { background-color: #f5f5f5; text-align: center; }
        .total-row { font-weight: bold; background-color: #e8f4f8; }
        .net-salary { font-size: 14px; font-weight: bold; color: #2c5aa0; }
    </style>
</head>
<body>
    <div class="header">
        <h2>BULLETIN DE PAIE</h2>
        <p>Période: ${period}</p>
    </div>
    
    <div class="company-info">
        <h3>EMPLOYEUR</h3>
        <p><strong>${company.name}</strong></p>
        <p>${company.address}</p>
        <p>Tél: ${company.phone}</p>
        <p>CNSS: ${company.cnssNumber}</p>
        <p>Patente: ${company.taxId}</p>
    </div>
    
    <div class="employee-info">
        <h3>SALARIÉ</h3>
        <p><strong>${employee.firstName} ${employee.lastName}</strong></p>
        <p>Matricule: ${employee.employeeNumber}</p>
        <p>Poste: ${employee.position}</p>
        <p>Département: ${employee.department}</p>
        <p>CNSS: ${employee.cnssNumber}</p>
        <p>Date d'embauche: ${new Date(employee.hireDate).toLocaleDateString('fr-FR')}</p>
    </div>
    
    <div class="clear"></div>
    
    <div class="section">
        <h3>ÉLÉMENTS DE RÉMUNÉRATION</h3>
        <table class="calculation-table">
            <thead>
                <tr>
                    <th>Désignation</th>
                    <th>Base</th>
                    <th>Taux</th>
                    <th>Montant</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Salaire de base</td>
                    <td>${payroll.baseSalary.toFixed(2)}</td>
                    <td>-</td>
                    <td>${payroll.baseSalary.toFixed(2)}</td>
                </tr>
                ${payroll.overtimePay > 0 ? `
                <tr>
                    <td>Heures supplémentaires</td>
                    <td>-</td>
                    <td>125%</td>
                    <td>${payroll.overtimePay.toFixed(2)}</td>
                </tr>
                ` : ''}
                ${payroll.bonuses > 0 ? `
                <tr>
                    <td>Primes et indemnités</td>
                    <td>-</td>
                    <td>-</td>
                    <td>${payroll.bonuses.toFixed(2)}</td>
                </tr>
                ` : ''}
                <tr class="total-row">
                    <td colspan="3"><strong>SALAIRE BRUT</strong></td>
                    <td><strong>${payroll.grossSalary.toFixed(2)} MAD</strong></td>
                </tr>
            </tbody>
        </table>
    </div>
    
    <div class="section">
        <h3>COTISATIONS SOCIALES</h3>
        <table class="calculation-table">
            <thead>
                <tr>
                    <th>Désignation</th>
                    <th>Base</th>
                    <th>Taux Salarié</th>
                    <th>Part Salarié</th>
                    <th>Taux Patronal</th>
                    <th>Part Patronale</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>CNSS</td>
                    <td>${payroll.grossSalary.toFixed(2)}</td>
                    <td>6,74%</td>
                    <td>${payroll.cnssEmployee.toFixed(2)}</td>
                    <td>21,09%</td>
                    <td>${payroll.cnssEmployer.toFixed(2)}</td>
                </tr>
                <tr>
                    <td>AMO</td>
                    <td>${payroll.grossSalary.toFixed(2)}</td>
                    <td>2,26%</td>
                    <td>${payroll.amoEmployee.toFixed(2)}</td>
                    <td>4,11%</td>
                    <td>${payroll.amoEmployer.toFixed(2)}</td>
                </tr>
                <tr class="total-row">
                    <td><strong>TOTAL COTISATIONS</strong></td>
                    <td>-</td>
                    <td>-</td>
                    <td><strong>${(payroll.cnssEmployee + payroll.amoEmployee).toFixed(2)}</strong></td>
                    <td>-</td>
                    <td><strong>${(payroll.cnssEmployer + payroll.amoEmployer).toFixed(2)}</strong></td>
                </tr>
            </tbody>
        </table>
    </div>
    
    <div class="section">
        <h3>IMPÔT SUR LE REVENU</h3>
        <table class="calculation-table">
            <thead>
                <tr>
                    <th>Désignation</th>
                    <th>Base</th>
                    <th>Montant</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Frais professionnels (30%)</td>
                    <td>${payroll.grossSalary.toFixed(2)}</td>
                    <td>${payroll.professionalExpenses.toFixed(2)}</td>
                </tr>
                <tr>
                    <td>IGR (Impôt Général sur le Revenu)</td>
                    <td>Revenu imposable</td>
                    <td>${payroll.igrTax.toFixed(2)}</td>
                </tr>
            </tbody>
        </table>
    </div>
    
    ${payroll.deductions > 0 ? `
    <div class="section">
        <h3>AUTRES RETENUES</h3>
        <table class="calculation-table">
            <tbody>
                <tr>
                    <td>Retenues diverses</td>
                    <td>-</td>
                    <td>${payroll.deductions.toFixed(2)}</td>
                </tr>
            </tbody>
        </table>
    </div>
    ` : ''}
    
    <div class="section">
        <h3>RÉCAPITULATIF</h3>
        <table class="calculation-table">
            <tbody>
                <tr>
                    <td>Salaire brut</td>
                    <td>${payroll.grossSalary.toFixed(2)} MAD</td>
                </tr>
                <tr>
                    <td>Total retenues salariales</td>
                    <td>${(payroll.cnssEmployee + payroll.amoEmployee + payroll.igrTax + (payroll.deductions || 0)).toFixed(2)} MAD</td>
                </tr>
                <tr class="total-row net-salary">
                    <td><strong>SALAIRE NET À PAYER</strong></td>
                    <td><strong>${payroll.netSalary.toFixed(2)} MAD</strong></td>
                </tr>
            </tbody>
        </table>
    </div>
    
    <div style="margin-top: 40px; text-align: center; font-size: 10px; color: #666;">
        <p>Ce bulletin de paie est conforme à la législation marocaine en vigueur.</p>
        <p>Généré le ${new Date().toLocaleDateString('fr-FR')} par OCCUR-CALL Payroll System</p>
    </div>
</body>
</html>`;
  }

  static generateCNSSReport(data: CNSSReportData): string {
    const { company, employees, period } = data;
    
    const totalSalaries = employees.reduce((sum, emp) => sum + parseFloat(emp.grossSalary || 0), 0);
    const totalCnssEmployee = employees.reduce((sum, emp) => sum + parseFloat(emp.cnssEmployee || 0), 0);
    const totalCnssEmployer = employees.reduce((sum, emp) => sum + parseFloat(emp.cnssEmployer || 0), 0);
    
    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Déclaration CNSS - ${period}</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 11px; margin: 20px; }
        .header { text-align: center; border: 2px solid #000; padding: 15px; margin-bottom: 20px; }
        .company-section { border: 1px solid #ccc; padding: 10px; margin-bottom: 20px; }
        .employees-table { width: 100%; border-collapse: collapse; font-size: 10px; }
        .employees-table th, .employees-table td { border: 1px solid #000; padding: 5px; text-align: center; }
        .employees-table th { background-color: #f0f0f0; font-weight: bold; }
        .summary { margin-top: 20px; border: 2px solid #000; padding: 15px; }
        .total-row { background-color: #e8f4f8; font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        <h2>CAISSE NATIONALE DE SÉCURITÉ SOCIALE</h2>
        <h3>DÉCLARATION MENSUELLE DES SALAIRES</h3>
        <p><strong>Période: ${period}</strong></p>
    </div>
    
    <div class="company-section">
        <h3>IDENTIFICATION DE L'EMPLOYEUR</h3>
        <table style="width: 100%;">
            <tr>
                <td><strong>Raison sociale:</strong> ${company.name}</td>
                <td><strong>N° CNSS:</strong> ${company.cnssNumber}</td>
            </tr>
            <tr>
                <td><strong>Adresse:</strong> ${company.address}</td>
                <td><strong>Téléphone:</strong> ${company.phone}</td>
            </tr>
        </table>
    </div>
    
    <h3>DÉTAIL DES SALARIÉS</h3>
    <table class="employees-table">
        <thead>
            <tr>
                <th>N° CNSS</th>
                <th>Nom et Prénom</th>
                <th>Salaire Brut</th>
                <th>Cotisation Salarié (6,74%)</th>
                <th>Cotisation Patronale (21,09%)</th>
                <th>Total Cotisations</th>
            </tr>
        </thead>
        <tbody>
            ${employees.map(emp => `
            <tr>
                <td>${emp.cnssNumber || '-'}</td>
                <td>${emp.firstName} ${emp.lastName}</td>
                <td>${parseFloat(emp.grossSalary || 0).toFixed(2)}</td>
                <td>${parseFloat(emp.cnssEmployee || 0).toFixed(2)}</td>
                <td>${parseFloat(emp.cnssEmployer || 0).toFixed(2)}</td>
                <td>${(parseFloat(emp.cnssEmployee || 0) + parseFloat(emp.cnssEmployer || 0)).toFixed(2)}</td>
            </tr>
            `).join('')}
            <tr class="total-row">
                <td colspan="2"><strong>TOTAUX</strong></td>
                <td><strong>${totalSalaries.toFixed(2)}</strong></td>
                <td><strong>${totalCnssEmployee.toFixed(2)}</strong></td>
                <td><strong>${totalCnssEmployer.toFixed(2)}</strong></td>
                <td><strong>${(totalCnssEmployee + totalCnssEmployer).toFixed(2)}</strong></td>
            </tr>
        </tbody>
    </table>
    
    <div class="summary">
        <h3>RÉCAPITULATIF DES COTISATIONS</h3>
        <table style="width: 100%;">
            <tr>
                <td>Nombre de salariés déclarés:</td>
                <td><strong>${employees.length}</strong></td>
            </tr>
            <tr>
                <td>Masse salariale totale:</td>
                <td><strong>${totalSalaries.toFixed(2)} MAD</strong></td>
            </tr>
            <tr>
                <td>Total cotisations salariales (6,74%):</td>
                <td><strong>${totalCnssEmployee.toFixed(2)} MAD</strong></td>
            </tr>
            <tr>
                <td>Total cotisations patronales (21,09%):</td>
                <td><strong>${totalCnssEmployer.toFixed(2)} MAD</strong></td>
            </tr>
            <tr style="border-top: 2px solid #000; font-size: 12px;">
                <td><strong>TOTAL À VERSER À LA CNSS:</strong></td>
                <td><strong>${(totalCnssEmployee + totalCnssEmployer).toFixed(2)} MAD</strong></td>
            </tr>
        </table>
    </div>
    
    <div style="margin-top: 40px;">
        <p>Date limite de paiement: ${this.getPaymentDeadline(period)}</p>
        <p style="margin-top: 30px;">Signature et cachet de l'employeur:</p>
        <div style="border: 1px solid #ccc; height: 80px; width: 200px; margin-top: 10px;"></div>
    </div>
    
    <div style="margin-top: 30px; text-align: center; font-size: 9px; color: #666;">
        <p>Déclaration générée automatiquement par OCCUR-CALL Payroll System</p>
        <p>Conforme aux dispositions de la CNSS - ${new Date().toLocaleDateString('fr-FR')}</p>
    </div>
</body>
</html>`;
  }

  static generateAMOReport(data: CNSSReportData): string {
    const { company, employees, period } = data;
    
    const totalSalaries = employees.reduce((sum, emp) => sum + parseFloat(emp.grossSalary || 0), 0);
    const totalAmoEmployee = employees.reduce((sum, emp) => sum + parseFloat(emp.amoEmployee || 0), 0);
    const totalAmoEmployer = employees.reduce((sum, emp) => sum + parseFloat(emp.amoEmployer || 0), 0);
    
    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Déclaration AMO - ${period}</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 11px; margin: 20px; }
        .header { text-align: center; border: 2px solid #000; padding: 15px; margin-bottom: 20px; }
        .company-section { border: 1px solid #ccc; padding: 10px; margin-bottom: 20px; }
        .employees-table { width: 100%; border-collapse: collapse; font-size: 10px; }
        .employees-table th, .employees-table td { border: 1px solid #000; padding: 5px; text-align: center; }
        .employees-table th { background-color: #f0f0f0; font-weight: bold; }
        .summary { margin-top: 20px; border: 2px solid #000; padding: 15px; }
        .total-row { background-color: #e8f4f8; font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        <h2>ASSURANCE MALADIE OBLIGATOIRE (AMO)</h2>
        <h3>DÉCLARATION MENSUELLE</h3>
        <p><strong>Période: ${period}</strong></p>
    </div>
    
    <div class="company-section">
        <h3>IDENTIFICATION DE L'EMPLOYEUR</h3>
        <table style="width: 100%;">
            <tr>
                <td><strong>Raison sociale:</strong> ${company.name}</td>
                <td><strong>N° AMO:</strong> ${company.amo}</td>
            </tr>
            <tr>
                <td><strong>Adresse:</strong> ${company.address}</td>
                <td><strong>N° CNSS:</strong> ${company.cnssNumber}</td>
            </tr>
        </table>
    </div>
    
    <h3>COTISATIONS AMO PAR SALARIÉ</h3>
    <table class="employees-table">
        <thead>
            <tr>
                <th>N° CNSS</th>
                <th>Nom et Prénom</th>
                <th>Salaire Brut</th>
                <th>Cotisation Salarié (2,26%)</th>
                <th>Cotisation Patronale (4,11%)</th>
                <th>Total AMO</th>
            </tr>
        </thead>
        <tbody>
            ${employees.map(emp => `
            <tr>
                <td>${emp.cnssNumber || '-'}</td>
                <td>${emp.firstName} ${emp.lastName}</td>
                <td>${parseFloat(emp.grossSalary || 0).toFixed(2)}</td>
                <td>${parseFloat(emp.amoEmployee || 0).toFixed(2)}</td>
                <td>${parseFloat(emp.amoEmployer || 0).toFixed(2)}</td>
                <td>${(parseFloat(emp.amoEmployee || 0) + parseFloat(emp.amoEmployer || 0)).toFixed(2)}</td>
            </tr>
            `).join('')}
            <tr class="total-row">
                <td colspan="2"><strong>TOTAUX</strong></td>
                <td><strong>${totalSalaries.toFixed(2)}</strong></td>
                <td><strong>${totalAmoEmployee.toFixed(2)}</strong></td>
                <td><strong>${totalAmoEmployer.toFixed(2)}</strong></td>
                <td><strong>${(totalAmoEmployee + totalAmoEmployer).toFixed(2)}</strong></td>
            </tr>
        </tbody>
    </table>
    
    <div class="summary">
        <h3>RÉCAPITULATIF AMO</h3>
        <table style="width: 100%;">
            <tr>
                <td>Nombre d'assurés:</td>
                <td><strong>${employees.length}</strong></td>
            </tr>
            <tr>
                <td>Assiette des cotisations:</td>
                <td><strong>${totalSalaries.toFixed(2)} MAD</strong></td>
            </tr>
            <tr>
                <td>Cotisations salariales AMO (2,26%):</td>
                <td><strong>${totalAmoEmployee.toFixed(2)} MAD</strong></td>
            </tr>
            <tr>
                <td>Cotisations patronales AMO (4,11%):</td>
                <td><strong>${totalAmoEmployer.toFixed(2)} MAD</strong></td>
            </tr>
            <tr style="border-top: 2px solid #000; font-size: 12px;">
                <td><strong>TOTAL COTISATIONS AMO:</strong></td>
                <td><strong>${(totalAmoEmployee + totalAmoEmployer).toFixed(2)} MAD</strong></td>
            </tr>
        </table>
    </div>
    
    <div style="margin-top: 40px;">
        <p>Échéance de paiement: ${this.getPaymentDeadline(period)}</p>
        <p style="margin-top: 30px;">Cachet et signature:</p>
        <div style="border: 1px solid #ccc; height: 80px; width: 200px; margin-top: 10px;"></div>
    </div>
    
    <div style="margin-top: 30px; text-align: center; font-size: 9px; color: #666;">
        <p>Déclaration AMO générée par OCCUR-CALL Payroll System</p>
        <p>Conforme à la réglementation AMO - ${new Date().toLocaleDateString('fr-FR')}</p>
    </div>
</body>
</html>`;
  }

  private static getPaymentDeadline(period: string): string {
    const [year, month] = period.split('-');
    const nextMonth = new Date(parseInt(year), parseInt(month), 15);
    return nextMonth.toLocaleDateString('fr-FR');
  }
}
