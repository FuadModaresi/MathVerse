
'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Maximize } from 'lucide-react';
import { GraphingEngine } from './graphing-engine';
import type { Equation } from './equation-editor';

interface GraphPreviewProps {
  equations: Equation[];
}

export function GraphPreview({ equations }: GraphPreviewProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Maximize className="w-4 h-4 me-2" />
          Preview Graph
        </Button>
      </DialogTrigger>
      <DialogContent className="w-screen h-screen max-w-none p-0">
        <GraphingEngine equations={equations.filter(eq => eq.isVisible)} />
      </DialogContent>
    </Dialog>
  );
}
