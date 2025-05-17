'use client';

import React, { useEffect, useState } from 'react';
import { Save, Loader2, CheckCircle, AlertCircle, Pencil } from 'lucide-react';

export const AdminFishingAssistantSettings: React.FC = () => {
  const [settings, setSettings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    instructions: '',
    context: '',
    language: '',
    personality: '',
    avoid_topics: '',
    initial_question: '',
    openai_vector_store_id: ''
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchSettings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/fishing-assistant/admin/settings');
      if (!response.ok) throw new Error('Failed to fetch settings');
      const data = await response.json();
      setSettings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (settings: any) => {
    const response = await fetch('/api/fishing-assistant/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    
    if (!response.ok) {
      throw new Error('Failed to save settings');
    }
    
    return await response.json();
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (settings) {
      setForm({
        instructions: settings.instructions || '',
        context: settings.context || '',
        language: settings.language || '',
        personality: settings.personality || '',
        avoid_topics: settings.avoid_topics || '',
        initial_question: settings.initial_question || '',
        openai_vector_store_id: settings.openai_vector_store_id || 'vs_68278c0e6dac819181a76e9350a95eac'
      });
    }
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      const updatedSettings = await saveSettings({ ...form, id: settings?.id });
      setSettings(updatedSettings);
      setSaveSuccess(true);
      setTimeout(() => {
        setEditing(false);
        setSaveSuccess(false);
      }, 1500);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-48 bg-white dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500 mb-2" />
        <p className="text-slate-600 dark:text-slate-300 text-sm">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="relative z-10">
        {editing ? (
          <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleSave(); }}>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md border border-slate-100 dark:border-slate-700">
              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  <span className="flex items-center">
                    <span className="bg-primary-100 dark:bg-primary-900/30 p-1 rounded-md mr-2">
                      <span className="block h-1 w-4 bg-primary-500 dark:bg-primary-400 rounded-sm"></span>
                    </span>
                    Instructions
                  </span>
                </label>
                <textarea
                  name="instructions"
                  className="w-full border-2 border-slate-200 dark:border-slate-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-300 shadow-sm dark:bg-slate-700 dark:text-white text-sm"
                  rows={3}
                  placeholder="Instructions for the AI fishing assistant"
                  value={form.instructions}
                  onChange={handleChange}
                  disabled={saving}
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 ml-2">
                  Detailed instructions that guide how the AI should respond to fishing questions.
                </p>
              </div>
              
              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  <span className="flex items-center">
                    <span className="bg-primary-100 dark:bg-primary-900/30 p-1 rounded-md mr-2">
                      <span className="block h-1 w-4 bg-primary-500 dark:bg-primary-400 rounded-sm"></span>
                    </span>
                    Context
                  </span>
                </label>
                <textarea
                  name="context"
                  className="w-full border-2 border-slate-200 dark:border-slate-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-300 shadow-sm dark:bg-slate-700 dark:text-white text-sm"
                  rows={3}
                  placeholder="Context (e.g., focus on carp fishing in the UK)"
                  value={form.context}
                  onChange={handleChange}
                  disabled={saving}
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 ml-2">
                  Background information that helps the AI understand the context of fishing questions.
                </p>
              </div>
              
              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  <span className="flex items-center">
                    <span className="bg-primary-100 dark:bg-primary-900/30 p-1 rounded-md mr-2">
                      <span className="block h-1 w-4 bg-primary-500 dark:bg-primary-400 rounded-sm"></span>
                    </span>
                    Initial Question
                  </span>
                </label>
                <textarea
                  name="initial_question"
                  className="w-full border-2 border-slate-200 dark:border-slate-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-300 shadow-sm dark:bg-slate-700 dark:text-white text-sm"
                  rows={2}
                  placeholder="👋 Hello! I'm the Rippa Tackle fishing assistant. I can help with fishing advice, locations, gear, and techniques. What would you like to know about fishing today?"
                  value={form.initial_question}
                  onChange={handleChange}
                  disabled={saving}
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 ml-2">
                  This is the first message users will see from the fishing assistant.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    <span className="flex items-center">
                      <span className="bg-primary-100 dark:bg-primary-900/30 p-1 rounded-md mr-2">
                        <span className="block h-1 w-4 bg-primary-500 dark:bg-primary-400 rounded-sm"></span>
                      </span>
                      Language
                    </span>
                  </label>
                  <input
                    name="language"
                    className="w-full border-2 border-slate-200 dark:border-slate-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-300 shadow-sm dark:bg-slate-700 dark:text-white text-sm"
                    placeholder="British English"
                    value={form.language}
                    onChange={handleChange}
                    disabled={saving}
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    <span className="flex items-center">
                      <span className="bg-primary-100 dark:bg-primary-900/30 p-1 rounded-md mr-2">
                        <span className="block h-1 w-4 bg-primary-500 dark:bg-primary-400 rounded-sm"></span>
                      </span>
                      Personality
                    </span>
                  </label>
                  <input
                    name="personality"
                    className="w-full border-2 border-slate-200 dark:border-slate-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-300 shadow-sm dark:bg-slate-700 dark:text-white text-sm"
                    placeholder="Knowledgeable, friendly"
                    value={form.personality}
                    onChange={handleChange}
                    disabled={saving}
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                    <span className="flex items-center">
                      <span className="bg-primary-100 dark:bg-primary-900/30 p-1 rounded-md mr-2">
                        <span className="block h-1 w-4 bg-primary-500 dark:bg-primary-400 rounded-sm"></span>
                      </span>
                      Topics to Avoid
                    </span>
                  </label>
                  <input
                    name="avoid_topics"
                    className="w-full border-2 border-slate-200 dark:border-slate-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-300 shadow-sm dark:bg-slate-700 dark:text-white text-sm"
                    placeholder="Politics, controversial subjects"
                    value={form.avoid_topics}
                    onChange={handleChange}
                    disabled={saving}
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1">
                  <span className="flex items-center">
                    <span className="bg-slate-100 dark:bg-slate-700 p-1 rounded-md mr-2">
                      <span className="block h-1 w-4 bg-slate-400 dark:bg-slate-500 rounded-sm"></span>
                    </span>
                    OpenAI Vector Store ID
                  </span>
                </label>
                <div className="relative">
                  <input
                    name="openai_vector_store_id"
                    className="w-full border-2 border-slate-200 dark:border-slate-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-300 shadow-sm bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 font-mono text-xs cursor-not-allowed"
                    value={form.openai_vector_store_id}
                    disabled={true}
                    title="This value is hardcoded and cannot be changed"
                  />
                  <div className="absolute right-3 top-2 px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded font-medium">
                    Read-only
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 ml-2">
                  This is the vector store ID used for knowledge retrieval. It is preset and cannot be changed.
                </p>
              </div>
            </div>
            
            <div className="flex gap-2 justify-end">
              {saveSuccess && (
                <div className="flex items-center px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg text-sm">
                  <CheckCircle className="w-4 h-4 mr-1.5" />
                  Settings saved successfully!
                </div>
              )}
              
              {saveError && (
                <div className="flex items-center px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm">
                  <AlertCircle className="w-4 h-4 mr-1.5" />
                  {saveError}
                </div>
              )}
              
              <button
                type="button"
                className="px-3 py-1.5 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-white font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-all text-sm"
                onClick={() => setEditing(false)}
                disabled={saving}
              >
                Cancel
              </button>
              
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all disabled:opacity-70 flex items-center text-sm"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-1.5" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-100 dark:border-slate-700 overflow-hidden">
              <div className="border-b border-slate-100 dark:border-slate-700">
                <div className="p-3 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center">
                      <span className="bg-primary-100 dark:bg-primary-900/30 p-1 rounded-md mr-2">
                        <span className="block h-1 w-4 bg-primary-500 dark:bg-primary-400 rounded-sm"></span>
                      </span>
                      Instructions
                    </h3>
                    <div className="text-xs text-slate-500 dark:text-slate-400 px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded-md">
                      Required
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 ml-7">How the AI should respond to fishing questions</p>
                </div>
                <div className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-700 dark:to-slate-800 p-3 m-2 rounded-lg border border-slate-100 dark:border-slate-600 min-h-[80px] overflow-y-auto whitespace-pre-line text-slate-700 dark:text-slate-200 text-sm">
                  {form.instructions || <span className="text-slate-400 dark:text-slate-500 italic">No instructions set</span>}
                </div>
              </div>
              
              <div className="border-b border-slate-100 dark:border-slate-700">
                <div className="p-3 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center">
                      <span className="bg-primary-100 dark:bg-primary-900/30 p-1 rounded-md mr-2">
                        <span className="block h-1 w-4 bg-primary-500 dark:bg-primary-400 rounded-sm"></span>
                      </span>
                      Context
                    </h3>
                    <div className="text-xs text-slate-500 dark:text-slate-400 px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded-md">
                      Recommended
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 ml-7">Background information for AI responses</p>
                </div>
                <div className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-700 dark:to-slate-800 p-3 m-2 rounded-lg border border-slate-100 dark:border-slate-600 min-h-[80px] overflow-y-auto whitespace-pre-line text-slate-700 dark:text-slate-200 text-sm">
                  {form.context || <span className="text-slate-400 dark:text-slate-500 italic">No context set</span>}
                </div>
              </div>
              
              <div className="border-b border-slate-100 dark:border-slate-700">
                <div className="p-3 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center">
                      <span className="bg-primary-100 dark:bg-primary-900/30 p-1 rounded-md mr-2">
                        <span className="block h-1 w-4 bg-primary-500 dark:bg-primary-400 rounded-sm"></span>
                      </span>
                      Initial Question
                    </h3>
                    <div className="text-xs text-slate-500 dark:text-slate-400 px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded-md">
                      Recommended
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 ml-7">First message shown to users</p>
                </div>
                <div className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-700 dark:to-slate-800 p-3 m-2 rounded-lg border border-slate-100 dark:border-slate-600 min-h-[60px] overflow-y-auto whitespace-pre-line text-slate-700 dark:text-slate-200 text-sm">
                  {form.initial_question || <span className="text-slate-400 dark:text-slate-500 italic">Default greeting will be used</span>}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-700">
                <div className="p-3">
                  <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-1.5 flex items-center">
                    <span className="bg-primary-100 dark:bg-primary-900/30 p-1 rounded-md mr-2">
                      <span className="block h-1 w-3 bg-primary-500 dark:bg-primary-400 rounded-sm"></span>
                    </span>
                    Language
                  </h3>
                  <div className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-700 dark:to-slate-800 p-2 mt-1 rounded-lg border border-slate-100 dark:border-slate-600 text-slate-700 dark:text-slate-200 min-h-[40px] flex items-center text-sm">
                    {form.language || <span className="text-slate-400 dark:text-slate-500 italic">Not specified</span>}
                  </div>
                </div>
                
                <div className="p-3">
                  <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-1.5 flex items-center">
                    <span className="bg-primary-100 dark:bg-primary-900/30 p-1 rounded-md mr-2">
                      <span className="block h-1 w-3 bg-primary-500 dark:bg-primary-400 rounded-sm"></span>
                    </span>
                    Personality
                  </h3>
                  <div className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-700 dark:to-slate-800 p-2 mt-1 rounded-lg border border-slate-100 dark:border-slate-600 text-slate-700 dark:text-slate-200 min-h-[40px] flex items-center text-sm">
                    {form.personality || <span className="text-slate-400 dark:text-slate-500 italic">Not specified</span>}
                  </div>
                </div>
                
                <div className="p-3">
                  <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-1.5 flex items-center">
                    <span className="bg-primary-100 dark:bg-primary-900/30 p-1 rounded-md mr-2">
                      <span className="block h-1 w-3 bg-primary-500 dark:bg-primary-400 rounded-sm"></span>
                    </span>
                    Topics to Avoid
                  </h3>
                  <div className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-700 dark:to-slate-800 p-2 mt-1 rounded-lg border border-slate-100 dark:border-slate-600 text-slate-700 dark:text-slate-200 min-h-[40px] flex items-center text-sm">
                    {form.avoid_topics || <span className="text-slate-400 dark:text-slate-500 italic">Not specified</span>}
                  </div>
                </div>
              </div>
              
              <div className="p-3 border-t border-slate-100 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-0.5 flex items-center">
                      <span className="bg-slate-100 dark:bg-slate-700 p-1 rounded-md mr-2">
                        <span className="block h-1 w-3 bg-slate-400 dark:bg-slate-500 rounded-sm"></span>
                      </span>
                      OpenAI Vector Store ID
                    </h3>
                    <div className="text-xs text-slate-500 dark:text-slate-400 ml-6">Vector database for AI knowledge retrieval</div>
                  </div>
                  <div className="font-mono text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-lg">
                    {form.openai_vector_store_id}
                  </div>
                </div>
              </div>
              
              <div className="p-3 border-t border-slate-100 dark:border-slate-700 flex justify-end">
                <button
                  onClick={() => setEditing(true)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all flex items-center text-sm"
                >
                  <Pencil className="w-4 h-4 mr-1.5" />
                  Edit Settings
                </button>
              </div>
            </div>
            
            {error && (
              <div className="flex items-center p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg border border-red-100 dark:border-red-900/50 text-sm">
                <AlertCircle className="w-4 h-4 mr-2" />
                <div className="text-xs font-medium">{error}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}; 