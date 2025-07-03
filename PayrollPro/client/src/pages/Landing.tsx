import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { useLanguage } from "@/providers/LanguageProvider";
import { 
  Users, 
  Calculator, 
  FileText, 
  Shield, 
  Bot, 
  BarChart3,
  CheckCircle,
  ArrowRight,
  Sparkles
} from "lucide-react";

export default function Landing() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Users,
      title: "Gestion des Employés",
      description: "Gestion complète du cycle de vie des employés avec profils, documents et historique.",
    },
    {
      icon: Calculator,
      title: "Calculs de Paie",
      description: "Calculs automatisés avec les règles fiscales marocaines 2025 (CNSS, AMO, IGR).",
    },
    {
      icon: Shield,
      title: "Conformité Légale",
      description: "Vérifications en temps réel de la conformité au Code du travail marocain.",
    },
    {
      icon: Bot,
      title: "Assistant IA",
      description: "Assistant intelligent spécialisé dans le droit du travail marocain.",
    },
    {
      icon: FileText,
      title: "Documents Officiels",
      description: "Génération automatique des bulletins de paie, déclarations CNSS et AMO.",
    },
    {
      icon: BarChart3,
      title: "Rapports & Analytics",
      description: "Analyses prédictives et insights pour optimiser votre gestion RH.",
    },
  ];

  const benefits = [
    "Conformité garantie avec le Code du travail marocain",
    "Calculs automatiques CNSS (27,83%) et AMO (6,37%)",
    "Barèmes IGR 2025 intégrés",
    "Support multi-langues (FR, AR, Darija, EN, ES)",
    "Interface moderne avec thème sombre/clair",
    "Assistant IA expert en droit social",
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <GlassCard className="px-4 py-2 inline-flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Powered by AI
                </span>
              </GlassCard>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                OCCUR-CALL
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-4">
              Système de Gestion de Paie Intelligent
            </p>
            
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
              Solution complète de gestion de paie pour les entreprises marocaines, 
              avec conformité légale garantie et assistant IA intégré.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
                onClick={() => window.location.href = "/api/login"}
              >
                Commencer maintenant
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/20 hover:bg-white/10"
              >
                Découvrir les fonctionnalités
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Fonctionnalités Avancées
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Une solution complète conçue spécifiquement pour les besoins des entreprises marocaines
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            
            return (
              <GlassCard key={index} className="p-8 hover:scale-105 transition-transform duration-300" hover>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
              Conformité Marocaine Garantie
            </h2>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Notre système est développé en conformité stricte avec le Code du travail marocain 
              et les dernières réglementations fiscales de 2025.
            </p>
            
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:pl-8">
            <GlassCard className="p-8" hover>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                  Conformité 100%
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Respectez automatiquement toutes les obligations légales marocaines
                </p>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-4 bg-white/10 dark:bg-black/20 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">27,83%</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">CNSS Total</div>
                  </div>
                  <div className="p-4 bg-white/10 dark:bg-black/20 rounded-xl">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">6,37%</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">AMO Total</div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <GlassCard className="p-12 text-center" hover>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
            Prêt à transformer votre gestion de paie ?
          </h2>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Rejoignez les entreprises marocaines qui font confiance à OCCUR-CALL 
            pour leur gestion de paie et leur conformité légale.
          </p>
          
          <Button 
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 text-lg"
            onClick={() => window.location.href = "/api/login"}
          >
            Commencer gratuitement
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </GlassCard>
      </div>
    </div>
  );
}
