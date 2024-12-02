import { BedrockAgentRuntimeClient } from '@aws-sdk/client-bedrock-agent-runtime';

// AWSクライアントの初期化を関数化
export function initializeAWSClient() {
  const region = process.env.NEXT_PUBLIC_AWS_REGION || 'ap-northeast-1';
  // ローカル環境とECS環境の両方に対応
  if (process.env.NEXT_PUBLIC_IS_ECS === 'true') {
    // ECS環境用の設定（ECSの場合、認証情報は自動的に提供される）
    return new BedrockAgentRuntimeClient({
      region: region,
    });
  }
  /*
   * 本番agentに繋ぐ際にはSESSION_TOKEN必要ありません。
   */
  return new BedrockAgentRuntimeClient({
    region: region,
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY as string,
      // sessionToken: process.env.NEXT_PUBLIC_AWS_SESSION_TOKEN as string,
    },
  });
}
