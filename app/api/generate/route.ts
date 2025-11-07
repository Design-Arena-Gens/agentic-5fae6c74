import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

let openai: OpenAI | null = null;

function getOpenAI() {
  if (!openai && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
}

export async function POST(req: NextRequest) {
  try {
    const client = getOpenAI();

    if (!client) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.' },
        { status: 500 }
      );
    }

    const { color, style, background, variations } = await req.json();

    const numVariations = parseInt(variations) || 4;

    // Craft the perfect prompt for Aloha Nails photoshoot
    const basePrompt = `Ultra-realistic high-fashion editorial photography for luxury nail polish brand Aloha Nails.

Professional model with perfectly manicured hands displaying ${color} nail polish. The nail polish color EXACTLY matches the model's ${color} outfit/dress/clothing in perfect color harmony.

Model pose: elegant hand positioning, fingers gracefully displayed, professional hand model quality.

Style: ${style} fashion editorial, magazine-quality lighting, soft shadows, professional color grading.

Background: ${background}, luxury setting, high-end fashion photography aesthetic.

Technical specs: Sharp focus on hands and nails, professional studio lighting, shallow depth of field, 50mm lens equivalent, editorial retouching quality.

Hand quality: Flawless skin, perfect nail shape, professional manicure, realistic hand anatomy, natural poses.

IMPORTANT: The nail polish and outfit must be the exact same ${color} color. Perfect color coordination is essential.

Shot on medium format camera, professional beauty photography, ultra-sharp details, perfect exposure.`;

    const images = await Promise.all(
      Array.from({ length: numVariations }).map(async () => {
        const response = await client.images.generate({
          model: 'dall-e-3',
          prompt: basePrompt,
          n: 1,
          size: '1024x1024',
          quality: 'hd',
          style: 'vivid',
        });

        return response.data?.[0]?.url || '';
      })
    );

    return NextResponse.json({ images });
  } catch (error: any) {
    console.error('Error generating images:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate images' },
      { status: 500 }
    );
  }
}
