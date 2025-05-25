"use client";

import type { Citation } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpenText, Quote } from "lucide-react";

interface CitationDisplayProps {
  citations: Citation[];
}

export function CitationDisplay({ citations }: CitationDisplayProps) {
  if (!citations || citations.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <h4 className="text-sm font-semibold mb-2 text-foreground/80 flex items-center">
        <BookOpenText className="w-4 h-4 mr-2 text-accent-foreground" />
        Citations
      </h4>
      <div className="space-y-2">
        {citations.map((citation, index) => (
          <Badge key={index} variant="outline" className="mr-2 mb-2 p-2 bg-accent/20 border-accent text-accent-foreground hover:bg-accent/30">
            <Quote className="w-3 h-3 mr-1.5" />
            {citation.source}, p. {citation.page}
          </Badge>
        ))}
      </div>
    </div>
  );
}
