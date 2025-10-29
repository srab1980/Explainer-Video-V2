import { openai } from '@ai-sdk/openai';
import { streamObject } from 'ai';
import { z } from 'zod';
import { StreamingTextResponse } from 'ai';

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

const sceneSchema = z.object({
  text: z.string().describe('The text for this scene, 1-3 sentences max.'),
  keywords: z.array(z.string()).describe('2-3 visual keywords representing key concepts in the scene.'),
  suggestedIcons: z.array(z.object({
    library: z.enum(['lucide', 'heroicons']),
    name: z.string(),
  })).describe('Suggested icon names from Lucide or Heroicons libraries based on keywords.'),
  animation: z.enum(['fade', 'slide', 'zoom', 'bounce']).describe('Animation type based on scene energy and mood.'),
  duration: z.number().default(5).describe('Default duration of the scene in seconds.'),
});

export async function POST(req: Request) {
  const { script, maxScenes = 20 } = await req.json();

  const systemPrompt = `You are a storyboard assistant for explainer videos. Analyze the provided script and break it into visual scenes suitable for a video storyboard.

Requirements:
1. Split the script at natural sentence or thought boundaries (not mid-sentence).
2. Each scene should be 1-3 sentences max.
3. Extract 2-3 visual keywords per scene that represent key concepts.
4. Suggest appropriate icon names from Lucide or Heroicons libraries that are likely to exist.
5. Choose an animation type (fade/slide/zoom/bounce) based on the scene's energy and mood.
6. Limit the output to a maximum of ${maxScenes} scenes.
7. Ensure the output is a valid JSON array of scenes.`;

  try {
    const { partialObjectStream } = await streamObject({
      model: openai('gpt-4o-mini'),
      system: systemPrompt,
      prompt: `Script: ${script}\n\nBreak this into visual scenes for an explainer video storyboard.`,
      schema: z.object({
        scenes: z.array(sceneSchema),
      }),
      onError: (error) => {
        console.error("Streaming error:", error);
      },
    });

    return new StreamingTextResponse(partialObjectStream);

  } catch (error) {
    console.error("API route error:", error);
    return new Response(JSON.stringify({ error: 'Failed to generate scenes' }), { status: 500 });
  }
}
