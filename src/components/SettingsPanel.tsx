import React, { useState, useEffect } from 'react';
import { Key, Save, Check, Server, Sparkles } from 'lucide-react';

export const SettingsPanel: React.FC = () => {
  const [provider, setProvider] = useState<'gemini' | 'openai'>('gemini');
  const [geminiKey, setGeminiKey] = useState('');
  const [openAiUrl, setOpenAiUrl] = useState('https://openrouter.ai/api/v1');
  const [openAiKey, setOpenAiKey] = useState('');
  const [openAiModel, setOpenAiModel] = useState('google/gemini-2.5-flash');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setProvider((localStorage.getItem('nekonihongo_provider') as 'gemini' | 'openai') || 'gemini');
    setGeminiKey(localStorage.getItem('nekonihongo_api_key') || '');
    setOpenAiUrl(localStorage.getItem('nekonihongo_openai_url') || 'https://openrouter.ai/api/v1');
    setOpenAiKey(localStorage.getItem('nekonihongo_openai_key') || '');
    setOpenAiModel(localStorage.getItem('nekonihongo_openai_model') || 'google/gemini-2.5-flash');
  }, []);

  const handleSave = () => {
    localStorage.setItem('nekonihongo_provider', provider);
    
    if (geminiKey.trim()) localStorage.setItem('nekonihongo_api_key', geminiKey.trim());
    else localStorage.removeItem('nekonihongo_api_key');

    if (openAiUrl.trim()) localStorage.setItem('nekonihongo_openai_url', openAiUrl.trim());
    else localStorage.removeItem('nekonihongo_openai_url');

    if (openAiKey.trim()) localStorage.setItem('nekonihongo_openai_key', openAiKey.trim());
    else localStorage.removeItem('nekonihongo_openai_key');

    if (openAiModel.trim()) localStorage.setItem('nekonihongo_openai_model', openAiModel.trim());
    else localStorage.removeItem('nekonihongo_openai_model');

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-3xl p-8 shadow-sm border border-amber-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
          <Key size={20} />
        </div>
        <h2 className="text-2xl font-bold text-amber-900">Settings</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">API Provider</label>
          <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
            <button
              onClick={() => setProvider('gemini')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${provider === 'gemini' ? 'bg-white text-amber-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Sparkles size={16} /> Gemini API
            </button>
            <button
              onClick={() => setProvider('openai')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${provider === 'openai' ? 'bg-white text-amber-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Server size={16} /> OpenAI-Compatible
            </button>
          </div>
        </div>

        {provider === 'gemini' ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div>
              <label htmlFor="geminiKey" className="block text-sm font-medium text-gray-700 mb-2">
                Custom Gemini API Key (Optional)
              </label>
              <p className="text-xs text-gray-500 mb-3">
                If you want to use your own Google Gemini API key, enter it below. Otherwise, the default key will be used.
              </p>
              <input
                type="password"
                id="geminiKey"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div>
              <label htmlFor="openAiUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Base URL
              </label>
              <input
                type="text"
                id="openAiUrl"
                value={openAiUrl}
                onChange={(e) => setOpenAiUrl(e.target.value)}
                placeholder="https://openrouter.ai/api/v1"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all"
              />
            </div>
            <div>
              <label htmlFor="openAiKey" className="block text-sm font-medium text-gray-700 mb-1">
                API Key
              </label>
              <input
                type="password"
                id="openAiKey"
                value={openAiKey}
                onChange={(e) => setOpenAiKey(e.target.value)}
                placeholder="sk-or-v1-..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all"
              />
            </div>
            <div>
              <label htmlFor="openAiModel" className="block text-sm font-medium text-gray-700 mb-1">
                Model Name
              </label>
              <input
                type="text"
                id="openAiModel"
                value={openAiModel}
                onChange={(e) => setOpenAiModel(e.target.value)}
                placeholder="google/gemini-2.5-flash"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 outline-none transition-all"
              />
            </div>
          </div>
        )}

        <button
          onClick={handleSave}
          className="w-full flex items-center justify-center gap-2 py-3 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600 transition-colors mt-4"
        >
          {isSaved ? (
            <>
              <Check size={18} />
              Saved!
            </>
          ) : (
            <>
              <Save size={18} />
              Save Settings
            </>
          )}
        </button>
      </div>
    </div>
  );
};
