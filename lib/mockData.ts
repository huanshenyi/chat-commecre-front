interface SalesData {
  product_name: string;
  brand_name: string;
  price: number;
  sales_data: Array<{ date: string; sales: number }>;
  ai_send: string;
}

export async function mockAIResponse(query: string): Promise<SalesData> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const randomSales = Array.from({ length: 12 }, (_, i) => ({
    date: `2023-${String(i + 1).padStart(2, '0')}`,
    sales: Math.floor(Math.random() * 1000) + 500
  }));

  return {
    product_name: "Eco-Friendly Water Bottle",
    brand_name: "GreenDrink",
    price: 25.99,
    sales_data: randomSales,
    ai_send: `Based on the sales data for eco-friendly water bottles in the last quarter, we can observe a positive trend. The average monthly sales have increased by 15% compared to the previous quarter. The peak sales were recorded in August, likely due to the summer season. The brand "GreenDrink" has been particularly successful, with their $25.99 model being the top seller. I recommend focusing marketing efforts on highlighting the eco-friendly aspects and durability of the product to maintain this growth trend.`
  };
}