
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { generateTextbookAnswer } from "@/ai/flows/generate-textbook-answer";
import type { Message } from "@/lib/types";
import { ChatMessage } from "./chat-message";
import { ChatInput } from "./chat-input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import "./styles.css";
interface ChatInterfaceProps {
  initialUserMessage?: string | null;
}

export function ChatInterface({ initialUserMessage }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSentInitialQuery, setHasSentInitialQuery] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const internalHandleSendMessage = useCallback(async (text: string, isInitialMessage = false) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`, 
      sender: "user",
      text,
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);

    const aiLoadingMessageId = `ai-loading-${Date.now()}`;
    const aiLoadingMessage: Message = {
      id: aiLoadingMessageId,
      sender: "ai",
      text: "", 
      timestamp: new Date(),
      isLoading: true,
    };
    setMessages((prevMessages) => [...prevMessages, aiLoadingMessage]);

    try {
      const response = await generateTextbookAnswer({ question: text });
      const aiResponseMessage: Message = {
        id: aiLoadingMessageId, 
        sender: "ai",
        text: response.answer,
        citations: response.citations,
        timestamp: new Date(),
        isLoading: false,
      };
      setMessages((prevMessages) =>
        prevMessages.map(msg => msg.id === aiLoadingMessageId ? aiResponseMessage : msg)
      );
    } catch (error) {
      console.error("Error generating answer:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get a response from the AI. Please try again.",
      });
      setMessages((prevMessages) => prevMessages.filter(msg => msg.id !== aiLoadingMessageId));
    } finally {
      setIsLoading(false);
    }
  }, [toast]); 

  useEffect(() => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
      }
    }
  }, [messages]);

  useEffect(() => {
    if (initialUserMessage && !hasSentInitialQuery) {
      setMessages([]); 
      internalHandleSendMessage(initialUserMessage, true);
      setHasSentInitialQuery(true);
    } else if (!initialUserMessage && hasSentInitialQuery) {
      setMessages([]);
      setHasSentInitialQuery(false);
    }
  }, [initialUserMessage, hasSentInitialQuery, internalHandleSendMessage]);


  return (
    <Card className="w-full h-full shadow-2xl flex flex-col rounded-xl hover:shadow-pink-glow-md transition-shadow duration-300 ease-in-out">
      <CardContent className="flex-grow p-0 overflow-hidden">
        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
          {messages.length === 0 && !isLoading && ( 
             <Alert className="border-primary/50 bg-primary/10 mt-2">
              <AlertCircle className="h-4 w-4 text-primary" />
              <AlertTitle className="text-primary">Welcome!</AlertTitle>
              <AlertDescription className="text-primary/80">
                Ask any question about Computer Science concepts, algorithms, programming, and more.
              </AlertDescription>
            </Alert>
          )}
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t p-0"> 
        <ChatInput onSendMessage={internalHandleSendMessage} isLoading={isLoading} />
      </CardFooter>
    </Card>
  );
}

