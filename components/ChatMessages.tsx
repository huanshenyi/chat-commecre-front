import { SalesChart } from '@/components/SalesChart';
import { TrendChart } from '@/components/TrendChart';
import { type SalesItem, extractJsonData } from '@/utils/format';

interface ChatMessagesProps {
  messages: Array<{ role: string; content: string }>;
  trendData: Array<{ date: string; sales: string }>;
  salesItem: SalesItem[];
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, trendData, salesItem }) => {
  return (
    <div className="flex-1 overflow-y-auto mb-4 space-y-4 max-w-3xl mx-auto px-4 pb-8 pt-4">
      {messages.map((message, index) => {
        const content =
          message.role === 'user'
            ? message.content
            : extractJsonData(message.content)?.message || message.content;

        return (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            key={index}
            className={`p-4 rounded-lg max-w-max ${
              message.role === 'user'
                ? 'bg-blue-500 text-primary-foreground ml-auto'
                : 'bg-secondary mr-auto'
            }`}
          >
            <pre className="whitespace-pre-wrap break-words">{content}</pre>
          </div>
        );
      })}
      {trendData.length > 0 && <TrendChart trend_data={trendData} />}
      {salesItem.length > 0 && <SalesChart sales_data={salesItem} />}
    </div>
  );
};