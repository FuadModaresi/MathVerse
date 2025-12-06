'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { explainGraphWithAI, type ExplainGraphWithAIInput } from '@/ai/flows/explain-graph-with-ai';
import type { Equation } from './equation-editor';

interface AiExplainerProps {
  equations: Equation[];
  getGraphAsSvgDataUri: () => Promise<string | null>;
}

export function AiExplainer({ equations, getGraphAsSvgDataUri }: AiExplainerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleExplain = async () => {
    const visibleEquations = equations.filter(eq => eq.isVisible && eq.value.trim() !== '');
    if (visibleEquations.length === 0) {
      setError('Please enter at least one visible function to explain.');
      setIsOpen(true);
      return;
    }

    setIsOpen(true);
    setIsLoading(true);
    setError('');
    setExplanation('');

    try {
      const equationString = visibleEquations.map(eq => eq.value).join(', ');
      
      const input: ExplainGraphWithAIInput = {
        equation: equationString,
      };

      const result = await explainGraphWithAI(input);
      setExplanation(result.explanation);
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button onClick={handleExplain} disabled={isLoading} className="w-full">
        <Sparkles className="w-4 h-4 me-2" />
        {isLoading ? 'Thinking...' : 'Explain with AI'}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] md:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              AI Graph Explanation
            </DialogTitle>
            <DialogDescription>
              An AI-generated analysis of the function(s).
            </DialogDescription>
          </DialogHeader>
          <div className="py-4" dir="ltr">
            {isLoading && (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            )}
            {error && (
              <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {explanation && <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">{explanation}</div>}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
