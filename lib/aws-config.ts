import { BedrockAgentRuntimeClient } from "@aws-sdk/client-bedrock-agent-runtime";

export function getBedrockClient() {
  const region = process.env.AWS_REGION || 'ap-northeast-1';
  const isEcs = process.env.IS_ECS === 'true';

  if (isEcs) {
    // ECS環境では、IAMロールを使用するため認証情報を明示的に指定しない
    return new BedrockAgentRuntimeClient({ region });
  } else {
    // ローカル環境では、認証情報を明示的に指定
    return new BedrockAgentRuntimeClient({
      region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
        sessionToken: process.env.AWS_SESSION_TOKEN,
      },
    });
  }
}