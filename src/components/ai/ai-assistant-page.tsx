
"use client";

import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ChevronUp, Lightbulb, Zap, Code2, Loader2, Database, Brain, Terminal, Network, GitMerge, FileText, Layers, HelpCircle, Mic, MicOff } from "lucide-react";
import { generateCSQuestions } from "@/ai/flows/generate-cs-questions-flow";
import { useToast } from "@/hooks/use-toast";

interface SuggestionItem {
  id: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
}

const iconMap: Record<string, LucideIcon> = {
  Code2,
  Lightbulb,
  Zap,
  Database,
  Brain,
  Terminal,
  Network,
  GitMerge,
  FileText,
  Layers,
};
const DefaultIcon = HelpCircle; 

const staticSuggestionItems: SuggestionItem[] = [
  { id: "schema-orders", icon: Database, title: "Show schema for \"Orders\" table", subtitle: "View the structure of the Orders table." },
  { id: "optimize-perf", icon: Zap, title: "Optimize SQL performance", subtitle: "Get suggestions to make your query faster." },
  { id: "explain-join", icon: GitMerge, title: "Explain different types of SQL JOINs", subtitle: "Understand how data is combined from tables." },
  { id: "normalize-db", icon: Layers, title: "What is database normalization?", subtitle: "Learn about organizing database schemas." },
  { id: "nosql-vs-sql", icon: Network, title: "Compare NoSQL and SQL databases", subtitle: "Understand key differences and use cases." },
  { id: "acid-props", icon: FileText, title: "Explain ACID properties in transactions", subtitle: "Learn about atomicity, consistency, isolation, durability." },
];

interface AiAssistantPageComponentProps {
  onStartChat: (query: string) => void;
}

export default function AiAssistantPageComponent({ onStartChat }: AiAssistantPageComponentProps) {
  const [queryInput, setQueryInput] = React.useState("");
  const [suggestionsVisible, setSuggestionsVisible] = React.useState(true);
  const [dynamicSuggestions, setDynamicSuggestions] = React.useState<SuggestionItem[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = React.useState(false);
  const [isListening, setIsListening] = React.useState(false);
  const { toast } = useToast();
  const recognitionRef = React.useRef<SpeechRecognition | null>(null);

  React.useEffect(() => {
    const fetchSuggestions = async () => {
      if (!suggestionsVisible) {
        setIsLoadingSuggestions(false);
        return;
      }
      setIsLoadingSuggestions(true);
      try {
        const response = await generateCSQuestions({});
        if (response && response.questions && response.questions.length > 0) {
          const formattedSuggestions = response.questions.map((q, index) => ({
            id: `cs-q-${index}`,
            icon: iconMap[q.iconKey] || DefaultIcon,
            title: q.title,
            subtitle: q.subtitle,
          }));
          setDynamicSuggestions(formattedSuggestions);
        } else {
          console.warn("AI did not return questions or returned empty, using static fallback.");
          setDynamicSuggestions(staticSuggestionItems.slice(0,6));
        }
      } catch (error) {
        console.error("Failed to fetch dynamic suggestions:", error);
        setDynamicSuggestions(staticSuggestionItems.slice(0,6));
      } finally {
        setIsLoadingSuggestions(false);
      }
    };

    if (suggestionsVisible) {
        fetchSuggestions();
    }
  }, [suggestionsVisible]);

  React.useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setQueryInput(prev => prev ? `${prev} ${transcript}` : transcript);
      setIsListening(false);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error", event.error);
      let errorMessage = "Speech recognition error. Please try again.";
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        errorMessage = "Microphone access denied. Please enable it in your browser settings.";
      } else if (event.error === 'no-speech') {
        errorMessage = "No speech detected. Please try again.";
      }
      toast({
        variant: "destructive",
        title: "Voice Input Error",
        description: errorMessage,
      });
      setIsListening(false);
    };
    
    recognition.onend = () => {
        setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [toast]);


  const handleSuggestionClick = (title: string) => {
    setQueryInput(title);
  };

  const handleSubmitQuery = () => {
    if (queryInput.trim()) {
      onStartChat(queryInput.trim());
      setQueryInput(""); 
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast({
        variant: "destructive",
        title: "Voice Input Not Supported",
        description: "Your browser does not support voice recognition.",
      });
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
          console.error("Error starting speech recognition:", error);
          toast({
            variant: "destructive",
            title: "Voice Input Error",
            description: "Could not start voice recognition. Make sure microphone permissions are granted.",
          });
          setIsListening(false);
      }
    }
  };

  const displayedSuggestions = suggestionsVisible && dynamicSuggestions.length > 0
    ? dynamicSuggestions
    : suggestionsVisible ? staticSuggestionItems.slice(0,6) : [];


  return (
    <div className="space-y-6">
      <Card className="shadow-lg rounded-xl hover:shadow-pink-glow-md transition-shadow duration-300 ease-in-out">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary animate-shimmer-glow" />
            <CardTitle className="text-xl text-accent">AI Suggestions</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setSuggestionsVisible(!suggestionsVisible)} className="text-sm text-muted-foreground hover:text-foreground">
            {suggestionsVisible ? "Hide" : "Show"}
            <ChevronUp className={`ml-1 h-4 w-4 transition-transform ${suggestionsVisible ? "" : "rotate-180"}`} />
          </Button>
        </CardHeader>
        {suggestionsVisible && (
          <CardContent>
            {isLoadingSuggestions ? (
              <div className="flex items-center justify-center p-4 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Loading suggestions...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {displayedSuggestions.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSuggestionClick(item.title)}
                    className="text-left p-4 rounded-lg border bg-card hover:shadow-pink-glow-md transition-shadow cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary h-full flex flex-col justify-between"
                    aria-label={`Suggestion: ${item.title}`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <item.icon className="h-5 w-5 text-primary shrink-0" />
                        <p className="font-semibold text-sm text-card-foreground">{item.title}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                    </div>
                  </button>
                ))}
                {displayedSuggestions.length === 0 && !isLoadingSuggestions && (
                    <p className="text-muted-foreground col-span-full text-center py-4">No suggestions available at the moment. Try showing them again.</p>
                )}
              </div>
            )}
          </CardContent>
        )}
      </Card>

      <Card className="shadow-lg rounded-xl hover:shadow-pink-glow-md transition-shadow duration-300 ease-in-out">
        <CardHeader>
          <CardTitle className="text-xl">Ask the AI Assistant</CardTitle>
          <CardDescription className="text-sm">
            Type your Computer Science questions, ask for code explanations, or get suggestions. Use commands like <Badge variant="secondary">/explain</Badge> or <Badge variant="secondary">/suggest</Badge>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="e.g., Explain Big O notation, or type /suggest a project idea..."
            className="min-h-[120px] text-sm"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            aria-label="Chat Input"
          />
        </CardContent>
        <CardFooter className="flex justify-end items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleListening}
            className="text-muted-foreground hover:text-primary"
            aria-label={isListening ? "Stop listening" : "Start listening"}
          >
            {isListening ? <MicOff className="h-5 w-5 text-primary" /> : <Mic className="h-5 w-5" />}
          </Button>
          <Button className="btn-success px-8" onClick={handleSubmitQuery} disabled={!queryInput.trim()}>
            Start Chat
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
