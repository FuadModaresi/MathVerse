'use client';

import { Button } from '@/components/ui/button';

interface MathKeyboardProps {
  onKeyPress: (key: string) => void;
}

export function MathKeyboard({ onKeyPress }: MathKeyboardProps) {
  const keys = [
    // Row 1
    { display: 'sin', value: 'sin(' }, { display: 'cos', value: 'cos(' }, { display: 'tan', value: 'tan(' }, { display: 'log', value: 'log(' }, { display: 'ln', value: 'ln(' },
    // Row 2
    { display: '(', value: '(' }, { display: ')', value: ')' }, { display: '√', value: 'sqrt(' }, { display: 'x²', value: '^2' }, { display: 'xʸ', value: '^' },
    // Row 3
    { display: 'π', value: 'PI' }, { display: 'e', value: 'E' }, { display: '1/x', value: '1/' }, { display: '|x|', value: 'abs(' }, { display: '!', value: '!' },
  ];

  return (
    <div className="grid grid-cols-5 gap-2 rounded-lg bg-muted p-4">
      {keys.map((key) => (
        <Button
          key={key.display}
          variant="secondary"
          className="h-12 text-lg font-mono"
          onClick={() => onKeyPress(key.value)}
          aria-label={key.value}
        >
          {key.display}
        </Button>
      ))}
    </div>
  );
}
