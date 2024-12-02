import { type SalesItem, extractJsonData } from "@/utils/format";
import {
  ServiceQuotaExceededException,
  ThrottlingException,
  ValidationException,
} from "@aws-sdk/client-bedrock-agent-runtime";
import { useEffect, useState } from "react";

export const useChat = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    Array<{ role: string; content: string }>
  >([]);
  const [trendData, setTrendData] = useState<
    Array<{ date: string; sales: string }>
  >([]);
  const [salesItem, setSalesItem] = useState<SalesItem[]>([]);
  const [loading, setLoading] = useState(false);

  const addMessage = (role: string, content: string) => {
    setMessages((prev) => [...prev, { role, content }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    addMessage("user", input);
    const now = new Date();
    const formattedTime = `${now.getFullYear()}-${
      now.getMonth() + 1
    }-${now.getDate()}`;

    try {
      const response = await fetch("/api/bedrock-agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: `今は${formattedTime},${input}` }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch");
      }
      const data = await response.json();
      addMessage("assistant", data.result);
    } catch (error) {
      if (
        e instanceof ThrottlingException ||
        e instanceof ServiceQuotaExceededException
      ) {
        addMessage(
          "assistant",
          "ただいまアクセスが集中しているため時間をおいて試してみてください。"
        );
      } else if (e instanceof ValidationException) {
        addMessage(
          "assistant",
          `利用上限に達したか不正なリクエストです \n ${e}`
        );
      }
      console.error("Error calling Bedrock Agent:", error);
      addMessage(
        "assistant",
        "エラーが発生しました。時間をおいて試してみてください。"
      );
    } finally {
      setLoading(false);
    }

    setInput("");
  };

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === "assistant") {
      try {
        const jsonData = extractJsonData(lastMessage.content);
        if (jsonData) {
          if (jsonData.data.type === "trend")
            setTrendData(jsonData.data.data || []);
          if (jsonData.data.type === "sales")
            setSalesItem(jsonData.data.data || []);
        }
      } catch (error) {
        console.error("Error extracting JSON data from last message:", error);
      }
    }
  }, [messages]);

  return {
    input,
    setInput,
    messages,
    trendData,
    salesItem,
    loading,
    handleSubmit,
  };
};
