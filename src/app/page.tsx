
"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sun, Moon } from "lucide-react";
import AiAssistantPageComponent from "@/components/ai/ai-assistant-page";
import { ChatInterface } from "@/components/chat/chat-interface";
import { useTheme } from "next-themes";

export default function Home() {
  const [viewMode, setViewMode] = React.useState<'assistant' | 'chat'>('assistant');
  const [chatInitialQuery, setChatInitialQuery] = React.useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleStartChat = (query: string) => {
    setChatInitialQuery(query);
    setViewMode('chat');
  };

  const handleBackToAssistant = () => {
    setViewMode('assistant');
    setChatInitialQuery(null);
  };

  const handleHeaderButtonPress = () => {
    if (viewMode === 'chat') {
      handleBackToAssistant();
    } else if (viewMode === 'assistant') {
      window.location.href = 'https://6000-firebase-studio-1747578327375.cluster-zkm2jrwbnbd4awuedc2alqxrpk.cloudworkstations.dev/';
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  if (!mounted) {
    return null; // or a loading spinner, to avoid hydration mismatch
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 flex flex-col">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 md:max-w-5xl md:mx-auto w-full border-b animate-fade-in-up">
         <Button
            variant="ghost"
            size="icon"
            aria-label={viewMode === 'chat' ? "Go back to assistant" : "Navigate to external site"}
            onClick={handleHeaderButtonPress}
          >
           <ArrowLeft className="h-5 w-5 text-foreground/70 hover:text-foreground" />
         </Button>
         <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            <span className="text-primary">Edu</span><span className="text-accent">Query</span>
         </h1>
         <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={toggleTheme}>
           {theme === 'dark' ? (
             <Sun className="h-5 w-5 text-foreground/70 hover:text-foreground" />
           ) : (
             <Moon className="h-5 w-5 text-foreground/70 hover:text-foreground" />
           )}
         </Button>
      </div>

      <main className="container mx-auto px-4 sm:px-6 pb-8 md:max-w-5xl flex-grow w-full flex flex-col mt-4 animate-fade-in-up-delayed">
        {viewMode === 'assistant' && (
          <>
            <header className="my-8 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                    AI Assistant
                </h2>
                <p className="text-muted-foreground mt-2">Get suggestions or start a chat with our AI expert.</p>
            </header>
            <AiAssistantPageComponent onStartChat={handleStartChat} />
          </>
        )}
        {viewMode === 'chat' && (
          <div className="flex-grow flex flex-col min-h-0">
            <ChatInterface initialUserMessage={chatInitialQuery} />
          </div>
        )}
      </main>
    </div>
  );
}
