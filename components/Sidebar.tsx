"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Sidebar() {
  const [savedQueries, setSavedQueries] = useState<string[]>([]);

  const handleSaveQuery = (query: string) => {
    setSavedQueries(prev => [...prev, query]);
  };

  return (
    <div className="w-64 bg-secondary p-4">
      <h2 className="text-lg font-semibold mb-4">Saved Queries</h2>
      <ScrollArea className="h-[calc(100vh-8rem)]">
        {savedQueries.map((query, index) => (
          <Button
            key={index}
            variant="ghost"
            className="w-full justify-start mb-2 text-left"
            onClick={() => {/* Implement query reload logic */}}
          >
            {query}
          </Button>
        ))}
      </ScrollArea>
    </div>
  );
}