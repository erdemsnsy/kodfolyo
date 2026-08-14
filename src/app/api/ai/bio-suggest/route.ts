import { NextResponse } from 'next/server';
import { generateBioSuggestions, IS_AI_ENABLED } from '../../../../lib/ai/bio';

export async function POST(request: Request) {
  if (!IS_AI_ENABLED) {
    return NextResponse.json(
      {
        success: false,
        error: 'AI biyografi uretici ozelligi su an kapali.',
        suggestedBios: [],
      },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
    const result = await generateBioSuggestions(body);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { success: false, error: 'AI servisinde bir hata olustu.' },
      { status: 500 }
    );
  }
}
