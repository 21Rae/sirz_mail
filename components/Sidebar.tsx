
import React, { useState } from 'react';
import { EmailOptions, EmailType, EMAIL_TONES, LoadingState, SavedTemplate } from '../types';
import { EMAIL_TYPES_LIST } from '../constants';
import { Sparkles, Loader2, Library, Plus, Trash2, ChevronRight, Clock } from 'lucide-react';

interface SidebarProps {
  onGenerate: (options: EmailOptions) => void;
  loadingState: LoadingState;
  savedTemplates: SavedTemplate[];
  onLoadTemplate: (template: SavedTemplate) => void;
  onDeleteTemplate: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  onGenerate, 
  loadingState, 
  savedTemplates, 
  onLoadTemplate,
  onDeleteTemplate 
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'saved'>('create');
  const [options, setOptions] = useState<EmailOptions>({
    topic: '',
    audience: 'General',
    tone: 'Professional',
    type: EmailType.PROMOTIONAL,
    additionalContext: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(options);
  };

  const handleChange = (field: keyof EmailOptions, value: string) => {
    setOptions(prev => ({ ...prev, [field]: value }));
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="w-full md:w-80 lg:w-96 bg-white border-r border-gray-200 h-screen flex flex-col shadow-sm z-20">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5" />
          <h1 className="text-xl font-bold tracking-tight">Sirz Mail</h1>
        </div>
        <p className="text-blue-100 text-xs opacity-90">Template Generator</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('create')}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'create' 
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Plus className="w-4 h-4" />
          Create New
        </button>
        <button
          onClick={() => setActiveTab('saved')}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'saved' 
              ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Library className="w-4 h-4" />
          Saved ({savedTemplates.length})
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'create' ? (
          <div className="p-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Email Type</label>
                <select
                  value={options.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                >
                  {EMAIL_TYPES_LIST.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Topic / Subject</label>
                <input
                  type="text"
                  value={options.topic}
                  onChange={(e) => handleChange('topic', e.target.value)}
                  placeholder="e.g. Summer Sale"
                  required
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Audience</label>
                  <input
                    type="text"
                    value={options.audience}
                    onChange={(e) => handleChange('audience', e.target.value)}
                    placeholder="e.g. New Users"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Tone</label>
                  <select
                    value={options.tone}
                    onChange={(e) => handleChange('tone', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  >
                    {EMAIL_TONES.map(tone => (
                      <option key={tone} value={tone}>{tone}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Additional Context</label>
                <textarea
                  value={options.additionalContext}
                  onChange={(e) => handleChange('additionalContext', e.target.value)}
                  placeholder="Key points, special offers..."
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loadingState === LoadingState.GENERATING}
                className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-white font-medium transition-all shadow-md hover:shadow-lg
                  ${loadingState === LoadingState.GENERATING 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 active:scale-95'}`}
              >
                {loadingState === LoadingState.GENERATING ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Template
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {savedTemplates.length === 0 ? (
              <div className="text-center py-10 px-4 text-gray-400">
                <Library className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="text-sm font-medium">No saved templates</p>
                <p className="text-xs mt-1">Generate and save a template to see it here.</p>
              </div>
            ) : (
              savedTemplates.map((template) => (
                <div 
                  key={template.id}
                  className="group relative bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => onLoadTemplate(template)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800 line-clamp-1 pr-6">{template.name}</h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTemplate(template.id);
                      }}
                      className="text-gray-400 hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition-colors"
                      title="Delete Template"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    {formatDate(template.createdAt)}
                  </div>
                  <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="w-4 h-4 text-blue-500" />
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-500 text-center">
          Powered by Gemini 2.5 Flash
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
