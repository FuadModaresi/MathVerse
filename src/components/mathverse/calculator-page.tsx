'use client';

import React, { useReducer } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MathKeyboard } from './math-keyboard';

type State = {
  currentOperand: string;
  previousOperand: string;
  operation: string | null;
  overwrite: boolean;
};

type Action =
  | { type: 'ADD_DIGIT'; payload: string }
  | { type: 'CHOOSE_OPERATION'; payload: string }
  | { type: 'CLEAR' }
  | { type: 'DELETE_DIGIT' }
  | { type: 'EVALUATE' };

const initialState: State = {
  currentOperand: '0',
  previousOperand: '',
  operation: null,
  overwrite: true,
};

function reducer(state: State, { type, payload }: Action): State {
  switch (type) {
    case 'ADD_DIGIT':
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload,
          overwrite: false,
        };
      }
      if (payload === '0' && state.currentOperand === '0') return state;
      if (payload === '.' && state.currentOperand.includes('.')) return state;
      return {
        ...state,
        currentOperand: `${state.currentOperand || ''}${payload}`,
      };

    case 'CHOOSE_OPERATION':
      if (state.currentOperand === '' && state.previousOperand === '') return state;
      if (state.previousOperand === '') {
        return {
          ...state,
          operation: payload,
          previousOperand: state.currentOperand,
          currentOperand: '',
        };
      }
      if (state.currentOperand === '') {
        return { ...state, operation: payload };
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload,
        currentOperand: '',
      };

    case 'EVALUATE':
      if (state.operation == null || state.currentOperand === '' || state.previousOperand === '') {
        return state;
      }
      return {
        ...state,
        overwrite: true,
        previousOperand: '',
        operation: null,
        currentOperand: evaluate(state),
      };

    case 'CLEAR':
      return { ...initialState };

    case 'DELETE_DIGIT':
        if (state.overwrite) return { ...initialState };
        if (state.currentOperand === '') return state;
        if (state.currentOperand.length === 1) return {...state, currentOperand: '0', overwrite: true};
        return { ...state, currentOperand: state.currentOperand.slice(0, -1) };

    default:
      return state;
  }
}

function evaluate({ currentOperand, previousOperand, operation }: State): string {
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    if (isNaN(prev) || isNaN(current)) return "";
    let computation: number;
    switch (operation) {
        case "+": computation = prev + current; break;
        case "-": computation = prev - current; break;
        case "×": computation = prev * current; break;
        case "÷": computation = prev / current; break;
        default: computation = NaN;
    }
    return computation.toString();
}

export function CalculatorPage() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, initialState);

  const handleKeyPress = (key: string) => {
    if (key >= '0' && key <= '9' || key === '.') {
      dispatch({ type: 'ADD_DIGIT', payload: key });
    } else if (['+', '-', '×', '÷'].includes(key)) {
      dispatch({ type: 'CHOOSE_OPERATION', payload: key });
    } else if (key === '=') {
      dispatch({ type: 'EVALUATE' });
    } else if (key === 'AC') {
        dispatch({ type: 'CLEAR' });
    }
  };

  const mainButtons = [
    'AC', 'C', '%', '÷',
    '7', '8', '9', '×',
    '4', '5', '6', '-',
    '1', '2', '3', '+',
    '0', '.', '=',
  ];

  return (
    <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
      <Card className="w-full md:w-[400px] p-4 shadow-lg">
        <CardContent className="p-2">
          <div className="bg-muted rounded-lg p-4 text-right mb-4">
            <div className="text-muted-foreground text-xl break-all">
              {previousOperand} {operation}
            </div>
            <div className="text-foreground text-4xl font-bold break-all" id="display">{currentOperand}</div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {mainButtons.map(label => {
                const isOperator = ['÷', '×', '-', '+', '='].includes(label);
                const isWide = label === '0';
                return (
                    <Button
                        key={label}
                        variant={isOperator ? 'default' : 'secondary'}
                        className={`h-16 text-2xl ${isWide ? 'col-span-2' : ''}`}
                        onClick={() => {
                            if (label === '=') dispatch({ type: 'EVALUATE' });
                            else if (label === 'AC') dispatch({ type: 'CLEAR' });
                            else if (label === 'C') dispatch({ type: 'DELETE_DIGIT' });
                            else if (isOperator || ['%'].includes(label)) dispatch({ type: 'CHOOSE_OPERATION', payload: label });
                            else dispatch({ type: 'ADD_DIGIT', payload: label });
                        }}
                    >
                        {label}
                    </Button>
                )
            })}
          </div>
        </CardContent>
      </Card>
      <div className="flex-1">
        <h3 className="text-xl font-bold mb-4 font-headline">Mathematical Keyboard</h3>
        <MathKeyboard onKeyPress={handleKeyPress} />
      </div>
    </div>
  );
}
