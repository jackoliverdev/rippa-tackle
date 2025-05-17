"use client";

import React from "react";
import { FishingAssistantChat } from "@/components/website/FishingAssistantChat";
import { PageTitle } from "@/components/admin/page-title";
import { Fish } from "lucide-react";

export default function FishingAssistantPage() {
  return (
    <div className="space-y-6">
      <PageTitle 
        title="Fishing Assistant" 
        description="Get personalised advice on fishing locations, tackle, and techniques from our AI assistant"
        icon={<Fish className="w-8 h-8" />}
      />
      
        <FishingAssistantChat />
    </div>
  );
} 