import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/providers/LanguageProvider";
import { useToast } from "@/hooks/use-toast";
import { Bot, Send, MessageCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

export function AIAssistant() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content: "Bonjour ! Je suis votre assistant IA spécialisé dans le droit du travail marocain et la conformité paie. Comment puis-je vous aider aujourd'hui ?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");

  const askMutation = useMutation({
    mutationFn: async (question: string) => {
      const response = await apiRequest("POST", "/api/ai/question", { 
        question,
        context: {} 
      });
      return response.json();
    },
    onSuccess: (result) => {
      const aiMessage: Message = {
        id: Date.now().toString(),
        type: "ai",
        content: result.response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de contacter l'assistant IA.",
        variant: "destructive",
      });
    },
  });

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    askMutation.mutate(input);
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <GlassCard className="p-6 h-96 flex flex-col">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center">
          <Bot className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white">
            {t("aiAssistant")}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t("askAboutCompliance")}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-xl text-sm ${
                message.type === "user"
                  ? "bg-primary text-white"
                  : "bg-white/10 dark:bg-black/20 text-gray-900 dark:text-white"
              }`}
            >
              {message.type === "ai" && (
                <div className="flex items-center space-x-2 mb-2">
                  <MessageCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Assistant IA
                  </span>
                </div>
              )}
              <p className="whitespace-pre-wrap">{message.content}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        
        {askMutation.isPending && (
          <div className="flex justify-start">
            <div className="bg-white/10 dark:bg-black/20 p-3 rounded-xl">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex space-x-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Posez votre question sur la conformité paie..."
          className="flex-1 bg-white/10 dark:bg-black/20 border-white/20"
          disabled={askMutation.isPending}
        />
        <Button
          onClick={handleSend}
          disabled={!input.trim() || askMutation.isPending}
          size="sm"
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </GlassCard>
  );
}
