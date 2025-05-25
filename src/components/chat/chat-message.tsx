
"use client";

import type { Message } from "@/lib/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User, Loader2, Copy, Check } from "lucide-react";
import { CitationDisplay } from "./citation-display";
import { cn } from "@/lib/utils";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import "./styles.css";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === "user";
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const CodeBlock = ({ node, inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || '');
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
      const codeToCopy = String(children).replace(/\n$/, '');
      navigator.clipboard.writeText(codeToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    if (!hasMounted) {
      // Fallback for SSR or initial render before hydration to avoid mismatch
      return (
        <pre className="bg-muted p-3 rounded-md overflow-x-auto text-sm my-2">
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      );
    }
    
    return !inline && match ? (
      <div className="relative my-2">
        <SyntaxHighlighter
          style={oneDark}
          language={match[1]}
          PreTag="div"
          {...props}
          className="rounded-md !p-4 !bg-gray-800 text-sm overflow-x-auto" // Added overflow-x-auto
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-7 w-7 text-gray-400 hover:text-gray-200 hover:bg-gray-700"
          onClick={handleCopy}
          aria-label="Copy code"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
    ) : (
      <code className={cn(className, "font-mono text-sm bg-muted/50 px-1 py-0.5 rounded")} {...props}>
        {children}
      </code>
    );
  };


  return (
    <div className={cn("flex items-start space-x-3 py-3", isUser ? "justify-end" : "")}>
      {!isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback>
            <Bot className="h-5 w-5 text-primary" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "p-3 rounded-lg shadow-sm max-w-[85%]",
          isUser
            ? "bg-primary text-white chat-bubble-user" 
            : "bg-card text-card-foreground border chat-bubble-ai" 
        )}
      >
        {message.isLoading ? (
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>AI is thinking...</span>
          </div>
        ) : (
           <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code: CodeBlock,
                h1: ({node, ...props}) => <h1 className="text-xl font-semibold my-2" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-lg font-semibold my-2" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-base font-semibold my-2" {...props} />,
                a: ({node, ...props}) => <a className="text-primary hover:underline" {...props} />,
              }}
            >
              {message.text}
            </ReactMarkdown>
          </div>
        )}
        {!isUser && message.citations && message.citations.length > 0 && !message.isLoading && (
          <CitationDisplay citations={message.citations} />
        )}
      </div>
      {isUser && (
         <Avatar className="h-8 w-8">
          <AvatarFallback>
            <User className="h-5 w-5 text-foreground" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

