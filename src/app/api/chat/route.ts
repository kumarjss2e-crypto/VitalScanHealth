import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { AI_PROMPTS } from '@/lib/ai/prompts';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages, wellnessData } = await req.json();

  const result = await streamText({
    model: openai('gpt-4o'),
    system: `${AI_PROMPTS.SYSTEM_ROLE}\n\nCurrent User Wellness Context: ${JSON.stringify(wellnessData)}`,
    messages,
  });

  return result.toTextStreamResponse();
}
