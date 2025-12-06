
'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Maximize, ArrowLeft } from 'lucide-react';
import { GraphingEngine } from './graphing-engine';
import type { Equation } from './equation-editor';
import { DialogDescription } from '@/components/ui/dialog';

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
        <DialogHeader className="sr-only">
          <DialogTitle>Graph Preview</DialogTitle>
          <DialogDescription>
            A full-screen view of the interactive graph.
          </DialogDescription>
        </DialogHeader>
        <GraphingEngine equations={equations.filter(eq => eq.isVisible)} />
        <DialogClose asChild>
            <Button variant="outline" className="absolute top-4 left-4 z-20">
                <ArrowLeft className="w-4 h-4 me-2" />
                Back to Editor
            </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
