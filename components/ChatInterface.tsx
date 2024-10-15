"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import SalesChart from '@/components/SalesChart';
import { mockAIResponse } from '@/lib/mockData';

export default function ChatInterface() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [salesData, setSalesData] = useState<any>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');

    // Simulate AI response
    const aiResponse = await mockAIResponse(input);
    setMessages(prev => [...prev, { role: 'assistant', content: aiResponse.ai_send }]);
    setSalesData(aiResponse);
  };

  const handleSaveData = () => {
    if (salesData) {
      const dataStr = JSON.stringify(salesData);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = 'sales_data.json';

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();

      toast({
        title: "Data Saved",
        description: "Sales data has been saved successfully.",
      });
    }
  };

  const handleSamplePrompt = () => {
    setInput("What's the sales trend for eco-friendly water bottles in the last quarter?");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`p-4 rounded-lg ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
            {message.content}
          </div>
        ))}
        {salesData && <SalesChart data={salesData} />}
      </div>
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter your product sales query..."
          className="flex-1"
        />
        <div className="flex flex-col space-y-2">
          <Button type="submit">Send</Button>
          <Button type="button" variant="outline" onClick={handleSamplePrompt}>Sample Prompt</Button>
          <Button type="button" variant="secondary" onClick={handleSaveData} disabled={!salesData}>Save Data</Button>
        </div>
      </form>
    </div>
  );
}