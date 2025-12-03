'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Palette, Plus, Trash2, Pilcrow, Eye, EyeOff } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { MathKeyboard } from './math-keyboard';


export interface Equation {
  id: number;
  value: string;
  color: string;
  isVisible: boolean;
}

interface EquationEditorProps {
  equations: Equation[];
  setEquations: React.Dispatch<React.SetStateAction<Equation[]>>;
}

const defaultColors = ['#FF00FF', '#00FFFF', '#FFFF00', '#FF0000', '#00FF00', '#0000FF'];

export function EquationEditor({ equations, setEquations }: EquationEditorProps) {
  const [activeInputId, setActiveInputId] = useState<number | null>(null);

  const addEquation = () => {
    const newId = equations.length > 0 ? Math.max(...equations.map(e => e.id)) + 1 : 1;
    const nextColor = defaultColors[equations.length % defaultColors.length];
    setEquations([
      ...equations,
      { id: newId, value: '', color: nextColor, isVisible: true },
    ]);
  };

  const updateEquation = (id: number, field: keyof Equation, value: string | boolean) => {
    setEquations(
      equations.map(eq => (eq.id === id ? { ...eq, [field]: value } : eq))
    );
  };

  const removeEquation = (id: number) => {
    setEquations(equations.filter(eq => eq.id !== id));
  };
  
  const handleKeyboardPress = (key: string) => {
    if (activeInputId === null) return;
    setEquations(equations.map(eq => {
      if (eq.id === activeInputId) {
        return { ...eq, value: eq.value + key };
      }
      return eq;
    }));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold font-headline">Functions</h3>
        <Button size="sm" onClick={addEquation}>
          <Plus className="h-4 w-4 me-2" /> Add
        </Button>
      </div>
      <div className="space-y-4">
        {equations.map(eq => (
          <div key={eq.id} className="space-y-2">
            <div className="flex items-center gap-2">
              <label htmlFor={`eq-${eq.id}`} className="text-sm font-medium" dir="ltr">f(x) =</label>
              <Input
                id={`eq-${eq.id}`}
                type="text"
                value={eq.value}
                onChange={e => updateEquation(eq.id, 'value', e.target.value)}
                onFocus={() => setActiveInputId(eq.id)}
                placeholder="e.g., x^2"
                className="font-mono"
                dir="ltr"
              />
               <Popover>
                <PopoverTrigger asChild>
                   <Button variant="outline" size="icon" onClick={() => setActiveInputId(eq.id)}>
                      <Pilcrow className="h-4 w-4" />
                   </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <MathKeyboard onKeyPress={handleKeyboardPress} />
                </PopoverContent>
              </Popover>
              <div className="relative">
                <Input
                  type="color"
                  value={eq.color}
                  onChange={e => updateEquation(eq.id, 'color', e.target.value)}
                  className="w-8 h-8 p-0 border-none bg-transparent appearance-none cursor-pointer"
                  style={{'--color': eq.color} as React.CSSProperties}
                />
                 <Palette className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-white mix-blend-difference pointer-events-none" />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => updateEquation(eq.id, 'isVisible', !eq.isVisible)}
                aria-label="Toggle visibility"
              >
                {eq.isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeEquation(eq.id)}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
