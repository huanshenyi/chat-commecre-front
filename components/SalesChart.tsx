import type { SalesItem } from '@/utils/format';
import { Crown, ShoppingCart, Users } from 'lucide-react';

interface SalesChartProps {
  sales_data: SalesItem[];
}

export function SalesChart({ sales_data }: SalesChartProps) {
  if (!Array.isArray(sales_data) || sales_data.length === 0) {
    return (
      <div className="w-full bg-white shadow-lg rounded-lg p-8 text-center text-gray-500">
        データが存在しません
      </div>
    );
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-400" />;
    if (rank === 2) return <Crown className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Crown className="h-5 w-5 text-amber-600" />;
    return null;
  };
  return (
    <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left">
                <span className="text-gray-600">順位</span>
              </th>
              <th className="px-6 py-3 text-left">商品名</th>
              <th className="px-6 py-3 text-right">
                <div className="flex items-center justify-end gap-2 text-gray-600">
                  <ShoppingCart className="h-4 w-4" />
                  売上
                </div>
              </th>
              <th className="px-6 py-3 text-right">
                <div className="flex items-center justify-end gap-2 text-gray-600">
                  <Users className="h-4 w-4" />
                  販売数
                </div>
              </th>
              <th className="px-6 py-3 text-right">
                <span className="text-gray-600">価格</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sales_data.map((item) => (
              <tr key={item.index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-gray-700">{item.index}</span>
                    {getRankIcon(item.index)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 line-clamp-2">{item.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-sm font-medium text-gray-900">¥{item.info.sales}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-sm text-gray-900">{item.info.num}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="text-sm text-gray-900">
                    ¥{Number.parseInt(item.info.price).toLocaleString()}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}