'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Lightbulb } from 'lucide-react';
import type { FC } from 'react';

interface PromptDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  prompts: string[];
  onSelectPrompt?: (prompt: string) => void;
}

export const PromptDialog: FC<PromptDialogProps> = ({
  isOpen,
  onOpenChange,
  prompts,
  onSelectPrompt,
}) => {
  const handleSelectPrompt = (prompt: string) => {
    onSelectPrompt?.(prompt); // プロンプト選択コールバックを実行
    onOpenChange(false); // プロンプト選択後にダイアログを閉じる
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" className="rounded-full h-9 px-4 gap-2">
          <Lightbulb className="h-4 w-4 text-yellow-400" />
          <span>サンプルプロンプト</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>プロンプトを選択してください</DialogTitle>
        </DialogHeader>
        <ul className="space-y-2">
          {prompts.map((prompt) => (
            <li key={prompt}>
              <button
                type="button"
                data-radix-dialog-close
                onClick={() => handleSelectPrompt(prompt)}
                className="w-full p-2 text-left bg-gray-100 rounded-md hover:bg-gray-200"
              >
                {prompt}
              </button>
            </li>
          ))}
        </ul>
        <DialogClose asChild>
          <button
            type="button"
            className="mt-4 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            キャンセル
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};