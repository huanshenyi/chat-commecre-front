'use client';

import { motion } from 'framer-motion';
import { ArrowUp, BarChart3, Download, Squircle } from 'lucide-react';
import { useState } from 'react';

import { ChatMessages } from '@/components/ChatMessages';
import { PromptDialog } from '@/components/PromptDialog';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import { useToast } from '@/components/ui/use-toast';
import { useChat } from '@/hooks/use-chat';

const prompts = [
  '東京の天気教えて。',
  'ルームエアコン2024年1月から2024年6月までの売上ランキングを教えてほしい。',
  'ルームエアコンのcid_path教えて。',
  'ルームエアコンこれからの売れ行き予測してほしい。',
  'これからルームエアコンを販売したい、2024年6月から、2024年10月までの人気商品データを参考して、どんな商品を出した方が売上が高くなると見込めるのか？',
];

export default function ChatInterface() {
  const { input, setInput, messages, trendData, salesItem, loading, handleSubmit } = useChat();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const { toast } = useToast();

  const handleSaveData = () => {
    if (trendData.length > 0) {
      const dataStr = JSON.stringify(trendData);
      // biome-ignore lint/style/useTemplate: <explanation>
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      const exportFileDefaultName = 'trend_data.json';

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();

      toast({
        title: 'Data Saved',
        description: 'Sales data has been saved successfully.',
      });
    }
  };

  const handleSelectPrompt = (prompt: string) => {
    setInput(prompt);
    setIsDialogOpen(false);
  };

  return (
    <div className="flex flex-col h-full">
      <ChatMessages messages={messages} trendData={trendData} salesItem={salesItem} />
      <div className="max-w-3xl mx-auto px-4 py-8">
        {messages.length === 0 && (
          <motion.h1
            className="text-2xl font-bold text-center mb-8"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.6,
              ease: [0.6, -0.05, 0.01, 0.99],
              type: 'spring',
              bounce: 0.4,
            }}
          >
            お手伝いできることはありますか？
          </motion.h1>
        )}

        <div className="relative mb-6 min-w-[770px]">
          <div className="relative bg-gray-50 rounded-2xl p-4 min-h-[100px]">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-transparent border-none outline-none placeholder:text-gray-500 mb-6 min-h-[50px]"
              placeholder="ChatCommerceにメッセージを送信する"
            />
            <div className="absolute bottom-4 left-4 flex gap-2">
              <button
                type="button"
                onClick={handleSaveData}
                disabled={!trendData.length && !salesItem.length}
                className="p-1 hover:bg-gray-200 rounded-md transition-colors"
              >
                <Download className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="absolute bottom-4 right-4">
              <Tooltip content="入力が空です" isVisible={isTooltipVisible}>
                <Button
                  type="button"
                  className={`hover:bg-gray-200 ${input ? 'bg-gray-700' : 'bg-gray-300'} `}
                  disabled={loading}
                  variant="outline"
                  size="icon"
                  onClick={handleSubmit}
                  onFocus={() => !input.trim() && setIsTooltipVisible(true)}
                  onBlur={() => setIsTooltipVisible(false)}
                >
                  {loading ? (
                    <Squircle className="h-6 w-6 bg-gray-700" />
                  ) : (
                    <ArrowUp className="h-6 w-6 text-gray-50" strokeWidth={3} />
                  )}
                </Button>
              </Tooltip>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="rounded-full h-9 px-4 gap-2">
            <BarChart3 className="h-4 w-4 text-blue-500" />
            <span>商品分析する</span>
          </Button>

          <PromptDialog
            isOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            prompts={prompts}
            onSelectPrompt={handleSelectPrompt}
          />
        </div>
      </div>
    </div>
  );
}