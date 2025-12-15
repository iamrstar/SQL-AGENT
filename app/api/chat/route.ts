import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { groq } from '@ai-sdk/groq';
import { mistral } from '@ai-sdk/mistral';
export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: groq('qwen/qwen3-32b'),
     messages: [
    {
      role: 'system',
      content: 'Do not reveal your internal reasoning or chain-of-thought. Respond with only the final answer.',
    },
    ...convertToModelMessages(messages),
  ],
    
    
  });

  return result.toUIMessageStreamResponse();
}