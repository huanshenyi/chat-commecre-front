import { initializeAWSClient } from '@/lib/bedrock-client';
import {
  InvokeAgentCommand,
  type InvokeAgentCommandOutput,
} from '@aws-sdk/client-bedrock-agent-runtime';
import { NextResponse } from 'next/server';

const client = initializeAWSClient();

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    const sessionId = Date.now().toString();
    const command = new InvokeAgentCommand({
      agentId: process.env.NEXT_PUBLIC_AWS_AGENTID,
      agentAliasId: process.env.NEXT_PUBLIC_AWS_AGENT_ALIASID,
      sessionId: sessionId,
      inputText: prompt,
    });

    const response: InvokeAgentCommandOutput = await client.send(command);
    let completion = '';

    if (response.completion) {
      // biome-ignore lint/style/useConst: <explanation>
      for await (let chunkEvent of response.completion) {
        const chunk = chunkEvent.chunk;
        if (chunk !== undefined) {
          const decodedResponse = new TextDecoder('utf-8').decode(chunk.bytes);
          completion += decodedResponse;
        }
      }
    }

    return NextResponse.json({ result: completion });
  } catch (error) {
    console.error('Error invoking Bedrock Agent:', error);
    return NextResponse.json({ error: 'Failed to invoke Bedrock Agent' }, { status: 500 });
  }
}