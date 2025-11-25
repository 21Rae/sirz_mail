
import React, { useState, useRef, useEffect } from 'react';
import { Code, Eye, Monitor, Smartphone, Copy, Download, Check, Image as ImageIcon, Upload, Link as LinkIcon, X, Save, Send, Mail } from 'lucide-react';

interface EditorProps {
  initialContent: string;
  onSave: (name: string, content: string) => void;
}

const Editor: React.FC<EditorProps> = ({ initialContent, onSave }) => {
  const [content, setContent] = useState(initialContent);
  const [viewMode, setViewMode] = useState<'visual' | 'code'>('visual');
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [copied, setCopied] = useState(false);
  
  // Modal States
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [sendEmailAddress, setSendEmailAddress] = useState('');
  const [sendSubject, setSendSubject] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  // Image Editing State
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null);
  const [imgUrlInput, setImgUrlInput] = useState('');
  const [toolbarPosition, setToolbarPosition] = useState<{top: number, left: number} | null>(null);
  
  const visualEditorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync prop changes to state
  useEffect(() => {
    setContent(initialContent);
    if (visualEditorRef.current) {
      visualEditorRef.current.innerHTML = initialContent;
    }
  }, [initialContent]);

  // Handle updates from Visual Editor
  const handleVisualInput = (e: React.FormEvent<HTMLDivElement>) => {
    setContent(e.currentTarget.innerHTML);
    updateToolbarPosition();
  };

  // Handle updates from Code Editor
  const handleCodeInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  // Sync content when switching back to visual mode
  useEffect(() => {
    if (viewMode === 'visual' && visualEditorRef.current) {
      visualEditorRef.current.innerHTML = content;
    }
    // Deselect image when switching modes
    setSelectedImage(null);
  }, [viewMode]);

  // Update toolbar position if window resizes or scrolls
  useEffect(() => {
    window.addEventListener('scroll', updateToolbarPosition, true);
    window.addEventListener('resize', updateToolbarPosition);
    return () => {
      window.removeEventListener('scroll', updateToolbarPosition, true);
      window.removeEventListener('resize', updateToolbarPosition);
    };
  }, [selectedImage]);

  const updateToolbarPosition = () => {
    if (selectedImage) {
      const rect = selectedImage.getBoundingClientRect();
      setToolbarPosition({
        top: rect.bottom + 10,
        left: rect.left
      });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const downloadHtml = () => {
    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/html'});
    element.href = URL.createObjectURL(file);
    element.download = "email_template.html";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleSaveClick = () => {
    setTemplateName('');
    setShowSaveModal(true);
  };

  const handleSaveConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (templateName.trim()) {
      onSave(templateName, content);
      setShowSaveModal(false);
    }
  };

  const handleSendClick = () => {
    setSendEmailAddress('');
    setSendSubject('My Email Template');
    setSendSuccess(false);
    setShowSendModal(true);
  };

  const handleSendConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSending(false);
    setSendSuccess(true);
    
    setTimeout(() => {
      setShowSendModal(false);
      setSendSuccess(false);
    }, 2000);
  };

  const openMailClient = () => {
    const mailtoLink = `mailto:${sendEmailAddress}?subject=${encodeURIComponent(sendSubject)}`;
    window.open(mailtoLink, '_blank');
  };

  // --- Image Handling ---

  const handleEditorClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;

    // Handle Link Click - prevent navigation
    if (target.tagName === 'A' || target.closest('a')) {
      e.preventDefault();
    }

    // Handle Image Click
    if (target.tagName === 'IMG') {
      e.stopPropagation();
      const img = target as HTMLImageElement;
      setSelectedImage(img);
      setImgUrlInput(img.src);
      
      const rect = img.getBoundingClientRect();
      setToolbarPosition({
        top: rect.bottom + 10,
        left: rect.left
      });
    } else {
      // Clicked elsewhere - deselect unless clicking toolbar
      if (!(e.target as Element).closest('.image-toolbar')) {
        setSelectedImage(null);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedImage) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          selectedImage.src = ev.target.result as string;
          // Trigger content update
          if (visualEditorRef.current) {
            setContent(visualEditorRef.current.innerHTML);
          }
          // Reset input
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedImage && imgUrlInput) {
      selectedImage.src = imgUrlInput;
      if (visualEditorRef.current) {
        setContent(visualEditorRef.current.innerHTML);
      }
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-50 relative">
      {/* Toolbar */}
      <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-10 shrink-0">
        
        {/* View Toggles */}
        <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setViewMode('visual')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              viewMode === 'visual' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Eye className="w-4 h-4" />
            Visual
          </button>
          <button
            onClick={() => setViewMode('code')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
              viewMode === 'code' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Code className="w-4 h-4" />
            Code
          </button>
        </div>

        {/* Device Toggles (Visual Mode Only) */}
        {viewMode === 'visual' && (
           <div className="hidden md:flex items-center space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`p-1.5 rounded-md transition-all ${
                deviceMode === 'desktop' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}
              title="Desktop View"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`p-1.5 rounded-md transition-all ${
                deviceMode === 'mobile' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}
              title="Mobile View"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleSaveClick}
            className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
          
          <button
            onClick={copyToClipboard}
            className="hidden sm:flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          
          <button
            onClick={handleSendClick}
            className="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <Send className="w-4 h-4" />
            Send
          </button>

          <button
            onClick={downloadHtml}
            className="flex items-center gap-2 px-3 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto p-8 relative flex justify-center bg-gray-100/50">
        {viewMode === 'visual' ? (
          <>
            <div 
              className={`bg-white shadow-xl transition-all duration-300 relative ${
                deviceMode === 'mobile' ? 'w-[375px] h-[812px] rounded-[32px] border-8 border-gray-800 overflow-hidden' : 'w-full max-w-4xl min-h-[800px] rounded-lg border border-gray-200'
              }`}
            >
              {/* Visual Editor */}
              <div 
                ref={visualEditorRef}
                contentEditable
                onInput={handleVisualInput}
                onClick={handleEditorClick}
                suppressContentEditableWarning
                className={`visual-editor w-full h-full outline-none overflow-y-auto ${deviceMode === 'mobile' ? 'p-0' : 'p-0'}`}
                style={{ minHeight: '100%' }}
              />

              {/* Selection Ring Overlay for Image */}
              {selectedImage && toolbarPosition && (
                <div 
                  className="absolute pointer-events-none border-2 border-blue-500 z-10"
                  style={{
                    top: selectedImage.offsetTop,
                    left: selectedImage.offsetLeft,
                    width: selectedImage.offsetWidth,
                    height: selectedImage.offsetHeight,
                  }}
                />
              )}
            </div>

            {/* Floating Image Toolbar */}
            {selectedImage && toolbarPosition && (
              <div 
                className="image-toolbar fixed bg-white rounded-lg shadow-xl border border-gray-200 p-3 z-50 animate-in fade-in zoom-in-95 duration-200 flex flex-col gap-3 w-72"
                style={{ top: toolbarPosition.top, left: toolbarPosition.left }}
              >
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" /> Edit Image
                  </span>
                  <button onClick={() => setSelectedImage(null)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={triggerFileUpload}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium py-2 rounded-md transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Upload
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden" 
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                    <LinkIcon className="h-3.5 w-3.5 text-gray-400" />
                  </div>
                  <form onSubmit={handleUrlSubmit}>
                    <input
                      type="text"
                      value={imgUrlInput}
                      onChange={(e) => setImgUrlInput(e.target.value)}
                      placeholder="Or paste image URL..."
                      className="block w-full pl-8 pr-2 py-1.5 border border-gray-200 rounded-md text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </form>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="w-full max-w-5xl h-full shadow-lg rounded-lg overflow-hidden border border-gray-200">
            {/* Code Editor */}
            <textarea
              value={content}
              onChange={handleCodeInput}
              className="w-full h-full p-6 font-mono text-sm bg-[#1e1e1e] text-[#d4d4d4] resize-none outline-none leading-relaxed"
              spellCheck={false}
            />
          </div>
        )}
      </div>
      
      {/* Help / Footer Strip */}
      <div className="bg-white border-t border-gray-200 py-2 px-6 text-xs text-gray-500 flex justify-between">
        <span>{viewMode === 'visual' ? 'Tip: Click text to edit. Click images to replace them.' : 'Editing raw HTML source code.'}</span>
        <span>{content.length} chars</span>
      </div>

      {/* --- MODALS --- */}

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Save Template</h3>
              <button onClick={() => setShowSaveModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveConfirm}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Template Name</label>
                  <input 
                    type="text" 
                    required
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="e.g. Summer Sale V1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    autoFocus
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowSaveModal(false)}
                    className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Save to Library
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Send Modal */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Send Test Email</h3>
              <button onClick={() => setShowSendModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {sendSuccess ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Email Sent!</h4>
                <p className="text-gray-500 text-sm">Your test email has been successfully queued.</p>
              </div>
            ) : (
              <form onSubmit={handleSendConfirm}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Recipient</label>
                    <input 
                      type="email" 
                      required
                      value={sendEmailAddress}
                      onChange={(e) => setSendEmailAddress(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input 
                      type="text" 
                      required
                      value={sendSubject}
                      onChange={(e) => setSendSubject(e.target.value)}
                      placeholder="My Awesome Template"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-xs text-yellow-800 flex gap-2">
                    <Mail className="w-4 h-4 shrink-0 mt-0.5" />
                    <p>This is a preview simulation. To send real emails, you would typically integrate with an ESP (Mailchimp, SendGrid, etc). You can also try opening your default mail client below.</p>
                  </div>

                  <div className="flex flex-col gap-3 pt-2">
                    <button 
                      type="submit" 
                      disabled={isSending}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      {isSending ? (
                        <>Sending...</>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Test
                        </>
                      )}
                    </button>
                    
                    <div className="relative flex py-1 items-center">
                      <div className="flex-grow border-t border-gray-200"></div>
                      <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">OR</span>
                      <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    <button 
                      type="button"
                      onClick={openMailClient}
                      className="w-full py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors text-sm"
                    >
                      Open in Default Mail App
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Editor;
