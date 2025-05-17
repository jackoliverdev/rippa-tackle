'use client';

import React, { useState } from 'react';
import { Settings, FileText, BarChart2 } from 'lucide-react';
import { AdminFishingAssistantSettings } from '@/components/admin/fishing-assistant/AdminFishingAssistantSettings';
import { AdminFishingAssistantDocuments } from '@/components/admin/fishing-assistant/AdminFishingAssistantDocuments';

type Tab = 'settings' | 'documents' | 'analytics';

export const FishingAssistantAdminTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('settings');

  const tabs = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'documents', label: 'Knowledge Documents', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  ] as const;

  return (
    <>
      {/* Tabs */}
      <div className="bg-blue-50 border border-b-0 border-gray-200 rounded-t-xl p-2">
        <nav className="flex">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as Tab)}
              className={`
                flex items-center gap-2 py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 mx-1
                ${
                  activeTab === id
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:text-blue-700 hover:bg-white/50'
                }
              `}
            >
              <Icon className={`w-5 h-5 ${activeTab === id ? 'text-blue-600' : 'text-gray-400'}`} />
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white rounded-b-xl shadow-sm p-6 border border-t-0 border-gray-200">
        {activeTab === 'settings' && (
          <>
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-3 rounded-lg mr-4">
                <Settings className="w-6 h-6 text-blue-700" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-blue-900">AI Instructions</h2>
                <p className="text-gray-600 mt-1">
                  Configure how the fishing assistant should behave and respond to users.
                </p>
              </div>
            </div>
            <AdminFishingAssistantSettings />
          </>
        )}

        {activeTab === 'documents' && (
          <>
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-3 rounded-lg mr-4">
                <FileText className="w-6 h-6 text-blue-700" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-blue-900">Knowledge Management</h2>
                <p className="text-gray-600 mt-1">
                  Upload and manage documents for the AI fishing assistant knowledge base.
                </p>
              </div>
            </div>
            <AdminFishingAssistantDocuments />
          </>
        )}

        {activeTab === 'analytics' && (
          <>
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-3 rounded-lg mr-4">
                <BarChart2 className="w-6 h-6 text-blue-700" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-blue-900">Analytics</h2>
                <p className="text-gray-600 mt-1">
                  Monitor usage and performance metrics for the AI Fishing Assistant.
                </p>
              </div>
            </div>
            <div className="text-center p-12 bg-gray-50 border border-dashed border-gray-200 rounded-xl">
              <BarChart2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Analytics will be available in a future update.</p>
              <p className="text-gray-500 text-sm mt-1">Check back soon for user conversation statistics.</p>
            </div>
          </>
        )}
      </div>
    </>
  );
}; 