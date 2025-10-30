import { openai } from '@ai-sdk/openai';
import { streamObject } from 'ai';
import { z } from 'zod';
import { StreamingTextResponse } from 'ai';

export const runtime = 'edge';

const illustrationSchema = z.object({
  library: z.enum(['lucide', 'heroicons']),
  iconName: z.string().describe('The name of the icon, e.g., "heart", "pill", "currency-dollar".'),
  keyword: z.string().describe('The keyword associated with this illustration.'),
  color: z.string().describe('A hex color code for the illustration.'),
  size: z.enum(['small', 'medium', 'large', 'extra-large']).describe('The size of the illustration.'),
  position: z.object({
    x: z.number().describe('The x-coordinate (0-100).'),
    y: z.number().describe('The y-coordinate (0-100).'),
  }).describe('The position of the illustration.'),
  rotation: z.number().describe('The rotation of the illustration in degrees (-5 to 5).'),
  aspectRatio: z.number().describe('The width/height ratio of the illustration (0.8-1.4).'),
});

export async function POST(req: Request) {
  const { sceneText, keywords } = await req.json();

  const systemPrompt = `You are an AI assistant that generates illustration suggestions for a storyboard scene. Based on the scene text and keywords, generate a list of illustrations.

Requirements:
1. For each keyword, suggest an appropriate icon from the Lucide or Heroicons libraries.
2. Generate random but visually pleasing values for color, size, position, rotation, and aspect ratio.
3. Ensure the output is a valid JSON array of illustrations.`;

  try {
    const { partialObjectStream } = await streamObject({
      model: openai('gpt-4o-mini'),
      system: systemPrompt,
      prompt: `Scene Text: "${sceneText}"\nKeywords: ${keywords.join(', ')}\n\nGenerate illustrations for this scene.`,
      schema: z.object({
        illustrations: z.array(illustrationSchema),
      }),
      onError: (error) => {
        console.error("Streaming error:", error);
      },
    });

    return new StreamingTextResponse(partialObjectStream);

  } catch (error) {
    console.error("API route error:", error);
    return new Response(JSON.stringify({ error: 'Failed to generate illustrations' }), { status: 500 });
  }
}
