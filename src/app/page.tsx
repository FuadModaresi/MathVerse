import { Calculator, FunctionSquare, Pilcrow } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/mathverse/header';
import { GraphPage } from '@/components/mathverse/graph-page';
import { CalculatorPage } from '@/components/mathverse/calculator-page';
import { MathKeyboard } from '@/components/mathverse/math-keyboard';

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header />
      <Tabs defaultValue="graph" className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <TabsContent value="graph" className="h-full p-4 md:p-6">
            <GraphPage />
          </TabsContent>
          <TabsContent value="calculator" className="h-full p-4 md:p-6">
            <CalculatorPage />
          </TabsContent>
          <TabsContent value="keyboard" className="h-full p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-4 font-headline">Mathematical Keyboard</h2>
              <p className="text-muted-foreground mb-6">A custom keyboard for easy input of mathematical symbols.</p>
              <MathKeyboard onKeyPress={() => {}} />
            </div>
          </TabsContent>
        </div>
        <TabsList className="grid w-full grid-cols-3 h-16 rounded-none mt-auto">
          <TabsTrigger value="graph" className="h-full text-sm">
            <FunctionSquare className="w-5 h-5 me-2" />
            Graph
          </TabsTrigger>
          <TabsTrigger value="calculator" className="h-full text-sm">
            <Calculator className="w-5 h-5 me-2" />
            Calculator
          </TabsTrigger>
          <TabsTrigger value="keyboard" className="h-full text-sm">
            <Pilcrow className="w-5 h-5 me-2" />
            Keyboard
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
