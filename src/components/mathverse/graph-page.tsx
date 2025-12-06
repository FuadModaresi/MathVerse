
'use client';

import React, { useState, useRef, useCallback } from 'react';
import { EquationEditor } from './equation-editor';
import { GraphingEngine } from './graphing-engine';
import { AiExplainer } from './ai-explainer';
import { Card } from '@/components/ui/card';
import type { Equation } from './equation-editor';
import { Separator } from '../ui/separator';
import { GraphPreview } from './graph-preview';

export function GraphPage() {
  const [equations, setEquations] = useState<Equation[]>([
    { id: 1, value: 'sin(x)', color: '#8884d8', isVisible: true },
    { id: 2, value: 'cos(x)', color: '#82ca9d', isVisible: true },
  ]);
  const graphContainerRef = useRef<HTMLDivElement>(null);

  const getGraphAsSvgDataUri = useCallback(async () => {
    if (graphContainerRef.current) {
      const svgElement = graphContainerRef.current.querySelector('svg');
      if (svgElement) {
        const svgString = new XMLSerializer().serializeToString(svgElement);
        const encoded = btoa(unescape(encodeURIComponent(svgString)));
        return `data:image/svg+xml;base64,${encoded}`;
      }
    }
    return null;
  }, []);

  return (
    <div className="grid md:grid-cols-[350px_1fr] gap-6 h-full">
      <Card className="p-4 flex flex-col gap-4 overflow-y-auto">
        <div className="text-left">
            <h2 className="text-xl font-bold font-headline">Graphing Engine</h2>
            <p className="text-muted-foreground text-sm mt-1">Plot and explore functions.</p>
        </div>
        <Separator/>
        <EquationEditor equations={equations} setEquations={setEquations} />
        <Separator/>
        <AiExplainer equations={equations} getGraphAsSvgDataUri={getGraphAsSvgDataUri} />
      </Card>
      <div className="relative md:hidden">
        <GraphPreview equations={equations} />
      </div>
      <Card className="overflow-hidden hidden md:block" ref={graphContainerRef}>
        <GraphingEngine equations={equations.filter(eq => eq.isVisible)} />
      </Card>
    </div>
  );
}
