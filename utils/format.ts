interface TrendData {
    type: 'trend';
    data: Array<{
      date: string;
      sales: string;
    }>;
  }
  
  type SalesInfo = {
    price: string;
    sales: string;
    num: string;
  };
  
  export type SalesItem = {
    index: number;
    title: string;
    info: SalesInfo;
  };
  
  interface SalesData {
    type: 'sales';
    data: SalesItem[];
  }
  
  type ApiResponse = {
    code: number;
    message: string;
    data: TrendData | SalesData;
  };
  
  export function extractJsonData(input: string): ApiResponse | null {
    // const jsonStringMatch = input.match(/{\s*"code"\s*:\s*200[\s\S]*?}\s*}/);
    // const jsonStringMatch = input.match(/{[\s\S]*?"code"\s*:\s*200[\s\S]*?}\s*}/);
    const jsonStringMatch = input.match(/\{[\s\S]*\}/);
    if (jsonStringMatch) {
      try {
        // TODO: Messageの改行ここで削除された、messageの空欄は保留へ
        // biome-ignore lint/suspicious/noControlCharactersInRegex: <explanation>
        const cleanedJsonString = jsonStringMatch[0].replace(/[\x00-\x1F\x7F]/g, '');
        const salesData: ApiResponse = JSON.parse(cleanedJsonString);
        return salesData;
      } catch (error) {
        const messageMatch = input.match(/"message"\s*:\s*"([^"]*)"/);
        if (messageMatch) {
          const salesData: ApiResponse = {
            code: 200,
            message: messageMatch[1],
            data: { type: 'sales', data: [] },
          };
          return salesData;
        }
        return null;
      }
    } else {
      return null;
    }
  }