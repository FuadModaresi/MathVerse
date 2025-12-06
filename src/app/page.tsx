'use client';

import { Header } from '@/components/mathverse/header';
import { GraphPage } from '@/components/mathverse/graph-page';

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header />
      <main className="flex flex-1 overflow-hidden p-4 md:p-6">
        <GraphPage />
      </main>
    </div>
  );
}
