import { NextRequest, NextResponse } from 'next/server';
import { fishingAssistantService } from '@/lib/fishing-assistant-service';

export async function GET() {
  try {
    const settings = await fishingAssistantService.getSettings();
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const settings = await req.json();
    const updatedSettings = await fishingAssistantService.updateSettings(settings);
    return NextResponse.json(updatedSettings);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
} 