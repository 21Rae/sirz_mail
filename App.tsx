
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import { EmailOptions, LoadingState, SavedTemplate } from './types';
import { generateEmailTemplate } from './services/geminiService';
import { DEFAULT_TEMPLATE } from './constants';
import { AlertCircle } from 'lucide-react';

const STORAGE_KEY = 'sirz_saved_templates';

const App: React.FC = () => {
  const [templateContent, setTemplateContent] = useState<string>(DEFAULT_TEMPLATE);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [error, setError] = useState<string | null>(null);
  
  const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>([]);

  // Load templates from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedTemplates(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load saved templates", e);
    }
  }, []);

  // Save templates to local storage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedTemplates));
  }, [savedTemplates]);

  const handleGenerate = async (options: EmailOptions) => {
    setLoadingState(LoadingState.GENERATING);
    setError(null);

    try {
      const generatedHtml = await generateEmailTemplate(options);
      setTemplateContent(generatedHtml);
      setLoadingState(LoadingState.SUCCESS);
    } catch (err) {
      setLoadingState(LoadingState.ERROR);
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    }
  };

  const handleSaveTemplate = (name: string, content: string) => {
    const newTemplate: SavedTemplate = {
      id: crypto.randomUUID(),
      name,
      content,
      createdAt: Date.now()
    };
    setSavedTemplates(prev => [newTemplate, ...prev]);
  };

  const handleLoadTemplate = (template: SavedTemplate) => {
    setTemplateContent(template.content);
  };

  const handleDeleteTemplate = (id: string) => {
    if (window.confirm("Are you sure you want to delete this template?")) {
      setSavedTemplates(prev => prev.filter(t => t.id !== id));
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
      
      {/* Sidebar */}
      <Sidebar 
        onGenerate={handleGenerate} 
        loadingState={loadingState}
        savedTemplates={savedTemplates}
        onLoadTemplate={handleLoadTemplate}
        onDeleteTemplate={handleDeleteTemplate}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Error Notification */}
        {error && (
          <div className="bg-red-50 border-b border-red-200 px-6 py-3 flex items-center gap-3 text-red-700 animate-in slide-in-from-top duration-300">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
            <button 
              onClick={() => setError(null)} 
              className="ml-auto text-red-500 hover:text-red-800 text-sm underline"
            >
              Dismiss
            </button>
          </div>
        )}

        <Editor 
          initialContent={templateContent} 
          onSave={handleSaveTemplate}
        />
      </div>
    </div>
  );
};

export default App;
