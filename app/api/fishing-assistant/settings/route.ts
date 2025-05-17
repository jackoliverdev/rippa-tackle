import { NextResponse } from 'next/server';
import { fishingAssistantService } from '@/lib/fishing-assistant-service';

export async function GET() {
  try {
    const settings = await fishingAssistantService.getSettings();
    
    // Return only the necessary public settings
    return NextResponse.json({
      id: settings.id,
      initial_question: settings.initial_question,
      language: settings.language,
      personality: settings.personality
    });
  } catch (error) {
    console.error('Error fetching public fishing assistant settings:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
} 