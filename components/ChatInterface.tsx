"use client";
import { BedrockAgentRuntimeClient, InvokeAgentCommand } from "@aws-sdk/client-bedrock-agent-runtime";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
  DialogHeader,
} from "@/components/ui/dialog";
import SalesChart from "@/components/SalesChart";
import { mockAIResponse } from "@/lib/mockData";

// AWSクライアントの初期化を関数化
const initializeAWSClient = () => {
  const region = process.env.NEXT_PUBLIC_AWS_REGION || 'ap-northeast-1';
  const credentials = {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY as string,
    sessionToken: process.env.NEXT_PUBLIC_AWS_SESSION_TOKEN as string,
  };

  // ローカル環境とECS環境の両方に対応
  if (process.env.IS_ECS === 'true') {
    // ECS環境用の設定（ECSの場合、認証情報は自動的に提供される）
    return new BedrockAgentRuntimeClient({ region });
  } else {
    // ローカル環境用の設定
    return new BedrockAgentRuntimeClient({ region, credentials });
  }
};

export default function ChatInterface() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [salesData, setSalesData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  // ダイアログ表示コントロール用
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  // メッセージを追加する共通関数
  const addMessage = (role: string, content: string) => {
    setMessages((prev) => [...prev, { role, content }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    addMessage("user", input);

    try {
      const client = initializeAWSClient();
      const sessionId = Date.now().toString(); // 簡単なセッションID生成
      const command = new InvokeAgentCommand({
        agentId: process.env.NEXT_PUBLIC_AWS_AGENTID as string,
        agentAliasId: process.env.NEXT_PUBLIC_AWS_AGENT_ALIASID as string,
        sessionId,
        inputText: input,
      });

      // ベドロックエージェントの呼び出し
      const response = await client.send(command);
      let completion = "";

      if (response.completion) {
        for await (let chunkEvent of response.completion) {
          const chunk = chunkEvent.chunk;
          if (chunk !== undefined) {
            const decodedResponse = new TextDecoder("utf-8").decode(chunk.bytes);
            completion += decodedResponse;
          }
        }
      }

      addMessage("assistant", completion);
    } catch (error) {
      console.error("Error calling Bedrock Agent:", error);
      addMessage("assistant", "エラーが発生しました。");
    } finally {
      setLoading(false);
    }

    setInput("");
    handleMockAIResponse(input); // モックデータを使った応答の呼び出し
  };

  // モックデータ応答の処理
  const handleMockAIResponse = async (input: string) => {
    const aiResponse = await mockAIResponse(input);
    setSalesData(aiResponse);
  };

  const handleSaveData = () => {
    if (salesData) {
      const dataStr = JSON.stringify(salesData);
      const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
      const exportFileDefaultName = "sales_data.json";

      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileDefaultName);
      linkElement.click();

      toast({
        title: "Data Saved",
        description: "Sales data has been saved successfully.",
      });
    }
  };

  const prompts = [
    "ルームエアコン2024年1月から2024年6月までの売上ランキングを教えてほしい",
    "冷蔵庫の2023年度の販売数を地域ごとに知りたい",
    "洗濯機の売上データを過去3年間の推移で示してほしい"
  ];

  const handleSelectPrompt = (prompt: string) => {
    setInput(prompt);
    setIsDialogOpen(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`p-4 rounded-lg ${message.role === "user" ? " text-primary-foreground bg-[#0f60c4cc]" : "bg-secondary"}`}>
            {message.content}
          </div>
        ))}
        {salesData && <SalesChart data={salesData} />}
      </div>
      <form onSubmit={handleSubmit} className="flex space-x-2">
        {loading && <p>読み込み中...</p>}
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="聞きたいことを入力してください..."
          className="flex-1"
        />
        <div className="flex flex-col space-y-2">
          <Button type="submit" disabled={loading} variant="default" className="bg-[#0f60c4cc]">
            メッセージ送信
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
        <Button type="button" variant="outline">
            サンプルプロンプト
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>プロンプトを選択してください</DialogTitle>
          </DialogHeader>
          <ul className="space-y-2">
            {prompts.map((prompt, index) => (
              <li key={index}>
                <button data-radix-dialog-close onClick={() => handleSelectPrompt(prompt)}
                  className="w-full p-2 text-left bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  {prompt}
                </button>
              </li>
            ))}
          </ul>
          <DialogClose asChild>
            <button className="mt-4 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              キャンセル
            </button>
          </DialogClose>
        </DialogContent>
      </Dialog>
          <Button type="button" variant="secondary" onClick={handleSaveData} disabled={!salesData}>
            データ保存
          </Button>
        </div>
      </form>
    </div>
  );
}
