import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

type SalesData = {
  code: number;
  message: string;
  data: {
    sales_data?: Array<{ date: string; sales: string }>
  };
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractJsonData(input: string): SalesData | null {
  const jsonStringMatch = input.match(/{\s*"code"\s*:\s*200[\s\S]*?}\s*}/);
  if (jsonStringMatch) {
    try {
      // JSON文字列をパースしてSalesData型にマウントする
      const cleanedJsonString = jsonStringMatch[0].replace(/[\x00-\x1F\x7F]/g, "");
      const salesData: SalesData = JSON.parse(cleanedJsonString);
      return salesData
    } catch (error) {
      console.error('JSONのパースに失敗しました:', error);
      return null
    }
  } else {
    console.error('適切なJSONが見つかりませんでした');
    return null
  }
}