'use client';

import React, { useState, useMemo, useCallback, useRef } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { createFunction } from '@/lib/math-parser';
import { Button } from '../ui/button';
import { ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';

interface Equation {
  id: number;
  value: string;
  color: string;
}

interface GraphingEngineProps {
  equations: Equation[];
}

const INITIAL_DOMAIN = [-10, 10];
const ZOOM_FACTOR = 0.8;

export function GraphingEngine({ equations }: GraphingEngineProps) {
  const [domain, setDomain] = useState<[number, number]>(INITIAL_DOMAIN);
  const [isPanning, setIsPanning] = useState(false);
  const lastMousePos = useRef<{ x: number, y: number } | null>(null);

  const functions = useMemo(() => {
    return equations.map(eq => {
      try {
        return {
          id: eq.id,
          func: createFunction(eq.value),
          color: eq.color,
          name: `f(x) = ${eq.value}`,
        };
      } catch (error) {
        console.error(`Error parsing equation "${eq.value}":`, error);
        return { id: eq.id, func: () => NaN, color: eq.color, name: `f(x) = ${eq.value}` };
      }
    });
  }, [equations]);

  const data = useMemo(() => {
    const [min, max] = domain;
    const step = (max - min) / 200;
    const points = [];
    for (let x = min; x <= max; x += step) {
      const point: { x: number; [key: string]: number } = { x: Number(x.toPrecision(4)) };
      functions.forEach(({ id, func }) => {
        const y = func(x);
        if (Number.isFinite(y)) {
          point[id] = y;
        }
      });
      points.push(point);
    }
    return points;
  }, [domain, functions]);

  const handleZoom = (direction: 'in' | 'out') => {
    const [min, max] = domain;
    const center = (min + max) / 2;
    const range = max - min;
    const newRange = direction === 'in' ? range * ZOOM_FACTOR : range / ZOOM_FACTOR;
    setDomain([center - newRange / 2, center + newRange / 2]);
  };

  const resetView = () => {
    setDomain(INITIAL_DOMAIN);
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsPanning(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.classList.add('cursor-grabbing');
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning || !lastMousePos.current) return;
    
    const dx = e.clientX - lastMousePos.current.x;
    const [min, max] = domain;
    const range = max - min;
    // Assuming the chart width is roughly the component width
    const panFactor = range / e.currentTarget.clientWidth;
    const panAmount = dx * panFactor;

    setDomain(prevDomain => [prevDomain[0] - panAmount, prevDomain[1] - panAmount]);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  }, [isPanning, domain]);

  const handleMouseUpOrLeave = useCallback((e: React.MouseEvent) => {
    setIsPanning(false);
    lastMousePos.current = null;
    e.currentTarget.classList.remove('cursor-grabbing');
  }, []);


  return (
    <div className="w-full h-full flex flex-col relative"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUpOrLeave}
      onMouseLeave={handleMouseUpOrLeave}
    >
        <div className="absolute top-2 right-2 z-10 flex gap-2">
            <Button size="icon" variant="outline" onClick={() => handleZoom('in')}><ZoomIn className="w-4 h-4"/></Button>
            <Button size="icon" variant="outline" onClick={() => handleZoom('out')}><ZoomOut className="w-4 h-4"/></Button>
            <Button size="icon" variant="outline" onClick={resetView}><RefreshCw className="w-4 h-4"/></Button>
        </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
          <XAxis
            dataKey="x"
            type="number"
            domain={domain}
            allowDataOverflow={true}
            stroke="hsl(var(--foreground))"
          />
          <YAxis 
            allowDataOverflow={true} 
            domain={['auto', 'auto']}
            stroke="hsl(var(--foreground))"
           />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              borderColor: 'hsl(var(--border))',
            }}
          />
          <Legend />
          <ReferenceLine y={0} stroke="hsl(var(--foreground))" strokeWidth={1} />
          <ReferenceLine x={0} stroke="hsl(var(--foreground))" strokeWidth={1} />
          {functions.map(({ id, color, name }) => (
            <Line
              key={id}
              type="monotone"
              dataKey={id.toString()}
              stroke={color}
              strokeWidth={2}
              dot={false}
              name={name}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
