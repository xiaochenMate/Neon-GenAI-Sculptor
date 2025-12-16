import React, { useState, useEffect, useRef } from 'react';
import { Settings, Sparkles, Send, Box, Palette, Sliders, Menu, X } from 'lucide-react';
import Viewer from './components/Viewer';
import { INITIAL_MODELS } from './constants';
import { ModelDef, ChatMessage } from './types';
import { generateModelUpdate } from './services/geminiService';

export default function App() {
  const [models, setModels] = useState<ModelDef[]>(INITIAL_MODELS);
  const [selectedModel, setSelectedModel] = useState<ModelDef>(INITIAL_MODELS[0]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { role: 'model', text: 'Welcome to the Neon GenAI Sculptor. Select a model or describe a new one to begin!' }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSelectModel = (model: ModelDef) => {
    setSelectedModel(model);
    // On mobile, close sidebar after selection
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const handleParamChange = (key: string, value: number | string) => {
    setSelectedModel(prev => ({
      ...prev,
      params: {
        ...prev.params,
        [key]: value
      }
    }));
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isGenerating) return;

    const userMsg = chatInput;
    setChatInput('');
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsGenerating(true);

    try {
      const { model, message } = await generateModelUpdate(selectedModel, userMsg, models);
      
      // Update selected model immediately
      setSelectedModel(model);
      
      // Add to list if it's a new name we haven't seen, otherwise update existing in list
      setModels(prev => {
        const exists = prev.findIndex(m => m.name === model.name);
        if (exists >= 0) {
            const newModels = [...prev];
            newModels[exists] = model;
            return newModels;
        }
        return [...prev, model];
      });

      setChatHistory(prev => [...prev, { role: 'model', text: message }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { role: 'model', text: "I encountered an error connecting to the creative matrix. Please try again." }]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-black text-white overflow-hidden relative">
      
      {/* Mobile Header */}
      <div className="md:hidden absolute top-0 left-0 w-full z-50 p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-pink-500 drop-shadow-md">NeonAI</h1>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="pointer-events-auto p-2 rounded-full bg-slate-800/80 backdrop-blur text-white">
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar - Model List */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-slate-900/90 backdrop-blur-md border-r border-slate-700 transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 flex flex-col
      `}>
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-pink-500">
            Neon Sculptor
          </h1>
          <p className="text-xs text-slate-400 mt-1">Generative 3D Light Studio</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {models.map((model, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectModel(model)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 border ${
                selectedModel.name === model.name 
                  ? 'bg-slate-800 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
                  : 'bg-slate-800/30 border-transparent hover:bg-slate-800'
              }`}
            >
              <div 
                className="w-10 h-10 rounded-md bg-slate-900 flex items-center justify-center p-1 overflow-hidden"
                dangerouslySetInnerHTML={{ __html: model.thumbnail }}
              />
              <div className="text-left">
                <div className="font-medium text-sm text-slate-200">{model.name}</div>
                <div className="text-xs text-slate-500 capitalize">{model.type}</div>
              </div>
            </button>
          ))}
        </div>
        
        {/* Controls Section (Mini) */}
        <div className="p-4 border-t border-slate-700 bg-slate-900/50">
            <div className="flex items-center gap-2 mb-3 text-cyan-400 text-sm font-semibold">
                <Sliders size={14} />
                <span>Parameters</span>
            </div>
            <div className="space-y-3 max-h-40 overflow-y-auto pr-1">
                {Object.entries(selectedModel.params).map(([key, value]) => (
                    typeof value === 'number' && (
                        <div key={key} className="space-y-1">
                            <div className="flex justify-between text-xs text-slate-400">
                                <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                                <span>{value.toFixed(1)}</span>
                            </div>
                            <input 
                                type="range" 
                                min={0.1} 
                                max={20} 
                                step={0.1}
                                value={value} 
                                onChange={(e) => handleParamChange(key, parseFloat(e.target.value))}
                                className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                            />
                        </div>
                    )
                ))}
                 {selectedModel.params.color && (
                    <div className="space-y-1">
                         <div className="text-xs text-slate-400">Color</div>
                         <div className="flex gap-2">
                             <input 
                                type="color" 
                                value={selectedModel.params.color as string}
                                onChange={(e) => handleParamChange('color', e.target.value)}
                                className="h-6 w-full cursor-pointer bg-transparent border-none"
                             />
                         </div>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative flex flex-col">
        {/* 3D Canvas */}
        <div className="absolute inset-0 z-0">
          <Viewer model={selectedModel} />
        </div>

        {/* Chat Interface Overlay */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl z-20 flex flex-col gap-3">
          
          {/* Messages Bubble */}
          {chatHistory.length > 0 && (
             <div className="max-h-48 overflow-y-auto p-4 rounded-2xl bg-black/60 backdrop-blur-xl border border-slate-700/50 shadow-2xl flex flex-col gap-2 mask-gradient-top">
                {chatHistory.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-2 px-3 rounded-lg text-sm ${
                            msg.role === 'user' 
                                ? 'bg-cyan-600/20 text-cyan-100 border border-cyan-500/30 rounded-br-none' 
                                : 'bg-slate-700/40 text-slate-200 border border-slate-600/30 rounded-bl-none'
                        }`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                <div ref={chatEndRef} />
             </div>
          )}

          {/* Input Area */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-cyan-600 rounded-full opacity-75 group-hover:opacity-100 transition duration-200 blur"></div>
            <div className="relative flex items-center bg-slate-900 rounded-full p-1 pl-4 pr-1">
                <Sparkles className={`w-5 h-5 mr-3 ${isGenerating ? 'text-pink-500 animate-pulse' : 'text-slate-400'}`} />
                <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={isGenerating ? "Dreaming..." : "Describe a change (e.g. 'Make it a giant red star')"}
                    className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-500 text-sm h-10"
                    disabled={isGenerating}
                />
                <button 
                    onClick={handleSendMessage}
                    disabled={isGenerating || !chatInput.trim()}
                    className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 disabled:opacity-50 transition-colors text-cyan-400"
                >
                    <Send size={16} />
                </button>
            </div>
          </div>
        </div>

        {/* Top Right Stats/Info */}
        <div className="absolute top-6 right-6 z-10 hidden md:block">
            <div className="bg-black/30 backdrop-blur px-4 py-2 rounded-lg border border-white/10 text-xs text-white/50">
                AI Powered 3D Engine
            </div>
        </div>

      </div>
    </div>
  );
}
