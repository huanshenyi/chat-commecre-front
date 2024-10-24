"use client"

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Sidebar() {
  const [savedQueries, setSavedQueries] = useState<string[]>([]);

  const handleSaveQuery = (query: string) => {
    setSavedQueries(prev => [...prev, query]);
  };

  return (
    <div className="w-64 bg-secondary p-4">
    <div className="flex items-center w-full">
      <Image src="/icon.png" width={30} height={20} alt="icon" className="mr-2" />
      <div className="font-semibold">ChatCommerce</div>
      {/* <div className="font-semibold">Bedrock Agent</div> */}
    </div>
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