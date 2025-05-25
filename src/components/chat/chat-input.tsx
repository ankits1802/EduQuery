
"use client";

import type React from 'react';
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Loader2, Mic, MicOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
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
      setInputValue(prev => prev ? `${prev} ${transcript}` : transcript);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue("");
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

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2 w-full p-2">
      <div className="flex-grow relative flex items-center">
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask any CS question, or type a command..."
          className="flex-grow pr-10 py-2 h-10 rounded-lg border-input bg-background focus-visible:ring-primary" 
          disabled={isLoading}
          aria-label="Chat input"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={toggleListening}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground hover:text-primary"
          aria-label={isListening ? "Stop listening" : "Start listening"}
          disabled={isLoading}
        >
          {isListening ? <MicOff className="h-5 w-5 text-primary" /> : <Mic className="h-5 w-5" />}
        </Button>
      </div>
      <Button 
        type="submit" 
        size="icon" 
        disabled={isLoading || !inputValue.trim()} 
        aria-label="Send message"
        className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg h-10 w-10 flex-shrink-0"
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Send className="h-5 w-5" />
        )}
      </Button>
    </form>
  );
}

