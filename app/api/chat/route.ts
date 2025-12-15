import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { groq } from '@ai-sdk/groq';
import { mistral } from '@ai-sdk/mistral';
export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: groq('qwen/qwen3-32b'),
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}