import { NextRequest, NextResponse } from 'next/server';
import { fishingAssistantService } from '@/lib/fishing-assistant-service';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { documentId: string } }
) {
  try {
    const documentId = params.documentId;
    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get('fileId');

    if (!fileId) {
      return NextResponse.json({ error: 'Missing fileId parameter' }, { status: 400 });
    }

    await fishingAssistantService.deleteKnowledgeDocument(documentId, fileId);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
} 