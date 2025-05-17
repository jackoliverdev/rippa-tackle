import React from 'react';
import { FishingAssistantAdminTabs } from '@/components/admin/fishing-assistant/FishingAssistantAdminTabs';
import PageTitle from '@/components/admin/page-title';
import { Brain } from 'lucide-react';

export default function FishingAssistantAdminPage() {
  return (
    <div>
      <PageTitle 
        title="AI Fishing Assistant" 
        description="Configure how the fishing assistant behaves and manages its knowledge base"
        icon={<Brain className="w-6 h-6" />}
      />
      
      <div className="bg-white rounded-xl shadow-sm">
        <FishingAssistantAdminTabs />
      </div>
    </div>
  );
} 