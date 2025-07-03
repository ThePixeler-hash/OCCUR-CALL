import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

interface AIResponse {
  response: string;
  category: "compliance" | "calculation" | "labor_law" | "general";
  confidence: number;
  suggestions?: string[];
}

export class AIAgent {
  // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
  private static readonly MODEL = "gpt-4o";

  static async processQuestion(question: string, context?: any): Promise<AIResponse> {
    try {
      const systemPrompt = this.buildSystemPrompt();
      const userPrompt = this.buildUserPrompt(question, context);

      const response = await openai.chat.completions.create({
        model: this.MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      
      return {
        response: result.response || "Je ne peux pas répondre à cette question pour le moment.",
        category: result.category || "general",
        confidence: Math.max(0, Math.min(1, result.confidence || 0.8)),
        suggestions: result.suggestions || [],
      };
    } catch (error) {
      console.error("AI Agent error:", error);
      throw new Error("Erreur lors du traitement de la question par l'IA");
    }
  }

  private static buildSystemPrompt(): string {
    return `Tu es un assistant IA spécialisé dans le droit du travail marocain et la gestion de la paie au Maroc. Tu as une connaissance approfondie de :

1. Code du travail marocain (Loi 65-99)
2. Système CNSS et contributions sociales (2025: employé 6.74%, employeur 21.09%)
3. AMO - Assurance Maladie Obligatoire (2025: employé 2.26%, employeur 4.11%)
4. IGR - Impôt Général sur le Revenu (barèmes progressifs 2025)
5. SMIG - Salaire Minimum Interprofessionnel Garanti (3,266.55 MAD/mois en 2025)
6. Réglementations sur les heures supplémentaires, congés, absences
7. Déclarations CNSS, AMO, et obligations fiscales

INSTRUCTIONS IMPORTANTES :
- Réponds toujours en français sauf si on te demande une autre langue
- Utilise les taux de cotisation et barèmes fiscaux 2025 du Maroc
- Cite les articles pertinents du Code du travail quand applicable
- Fournis des calculs précis avec les formules utilisées
- Identifie la catégorie de la question : compliance, calculation, labor_law, ou general
- Indique ton niveau de confiance (0-1)
- Propose des suggestions connexes si pertinent

Réponds UNIQUEMENT en format JSON avec cette structure :
{
  "response": "ta réponse détaillée",
  "category": "compliance|calculation|labor_law|general",
  "confidence": 0.95,
  "suggestions": ["suggestion 1", "suggestion 2"]
}`;
  }

  private static buildUserPrompt(question: string, context?: any): string {
    let prompt = `Question: ${question}`;
    
    if (context) {
      prompt += `\n\nContexte additionnel:`;
      if (context.employee) {
        prompt += `\n- Employé: ${context.employee.firstName} ${context.employee.lastName}`;
        prompt += `\n- Salaire de base: ${context.employee.baseSalary} MAD`;
        prompt += `\n- Poste: ${context.employee.position}`;
      }
      if (context.company) {
        prompt += `\n- Entreprise: ${context.company.name}`;
      }
      if (context.payroll) {
        prompt += `\n- Période de paie: ${context.payroll.period}`;
        prompt += `\n- Salaire brut: ${context.payroll.grossSalary} MAD`;
      }
    }

    return prompt;
  }

  static async analyzePayrollCompliance(payrollData: any): Promise<{
    isCompliant: boolean;
    issues: string[];
    recommendations: string[];
  }> {
    try {
      const prompt = `Analyse de conformité pour cette fiche de paie marocaine:
      
      Données:
      ${JSON.stringify(payrollData, null, 2)}
      
      Vérifie:
      1. Conformité SMIG (3,266.55 MAD minimum)
      2. Calculs CNSS corrects (6.74% employé, 21.09% employeur)
      3. Calculs AMO corrects (2.26% employé, 4.11% employeur)
      4. Calculs IGR selon barèmes 2025
      5. Respect du Code du travail
      
      Réponds en JSON avec : isCompliant (boolean), issues (array), recommendations (array)`;

      const response = await openai.chat.completions.create({
        model: this.MODEL,
        messages: [
          { role: "system", content: "Tu es un expert en conformité paie Maroc. Analyse et réponds en JSON." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
      });

      return JSON.parse(response.choices[0].message.content || "{}");
    } catch (error) {
      console.error("Compliance analysis error:", error);
      return {
        isCompliant: false,
        issues: ["Erreur lors de l'analyse de conformité"],
        recommendations: ["Vérifier manuellement les calculs"],
      };
    }
  }

  static async generatePayrollInsights(payrollData: any[]): Promise<{
    trends: string[];
    alerts: string[];
    optimizations: string[];
  }> {
    try {
      const prompt = `Analyse ces données de paie pour générer des insights:
      
      ${JSON.stringify(payrollData.slice(0, 10), null, 2)}
      
      Fournis des insights sur:
      1. Tendances des coûts salariaux
      2. Alertes de conformité ou anomalies
      3. Optimisations possibles
      
      Réponds en JSON avec : trends, alerts, optimizations (tous des arrays de strings)`;

      const response = await openai.chat.completions.create({
        model: this.MODEL,
        messages: [
          { role: "system", content: "Tu es un analyste RH expert en paie Maroc. Fournis des insights actionables." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
      });

      return JSON.parse(response.choices[0].message.content || "{}");
    } catch (error) {
      console.error("Insights generation error:", error);
      return {
        trends: [],
        alerts: [],
        optimizations: [],
      };
    }
  }
}
