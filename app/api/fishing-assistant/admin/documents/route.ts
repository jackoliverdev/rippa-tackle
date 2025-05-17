import { NextRequest, NextResponse } from 'next/server';
import { fishingAssistantService } from '@/lib/fishing-assistant-service';

export async function GET() {
  try {
    const documents = await fishingAssistantService.listKnowledgeDocuments();
    return NextResponse.json(documents);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string | undefined;
    const uploadedByUserId = formData.get('uploadedByUserId') as string | undefined;

    if (!file || !title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const document = await fishingAssistantService.uploadKnowledgeDocument(
      file,
      title,
      description,
      uploadedByUserId
    );

    return NextResponse.json(document);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const documentId = searchParams.get('id');
    
    if (!documentId) {
      return NextResponse.json({ error: 'Missing document ID' }, { status: 400 });
    }
    
    const metadata = await req.json();
    const updatedDocument = await fishingAssistantService.updateKnowledgeDocumentMetadata(
      documentId,
      metadata
    );
    
    return NextResponse.json(updatedDocument);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
} 