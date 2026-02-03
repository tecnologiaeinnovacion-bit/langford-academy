
import React, { useState, useRef, useEffect } from 'react';
import { getTutorResponse } from '../services/geminiService';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIAssistantProps {
  courseContext: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ courseContext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "¡Hola! Soy tu Tutor IA de Langford. Estoy aquí para resolver cualquier duda sobre este curso. ¿En qué puedo ayudarte?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    const response = await getTutorResponse(userMsg, courseContext);
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setIsLoading(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {isOpen ? (
        <div className="bg-white w-80 sm:w-96 h-[550px] shadow-2xl rounded-3xl flex flex-col border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
          <div className="bg-blue-900 p-5 text-white flex justify-between items-center shadow-lg">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-cyan-400 rounded-xl flex items-center justify-center mr-3 shadow-inner">
                <i className="fas fa-robot text-blue-900"></i>
              </div>
              <div>
                <span className="font-black text-sm block leading-none tracking-tight">Tutor IA Langford</span>
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">En línea ahora</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-lg transition-colors">
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm shadow-sm leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-blue-900 text-white rounded-tr-none' 
                    : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none font-medium'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 rounded-tl-none flex space-x-1">
                  <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-blue-900 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-5 border-t border-gray-100 bg-white">
            <div className="flex space-x-3">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe tu duda académica..." 
                className="flex-1 border border-gray-200 rounded-xl px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900 bg-gray-50 font-medium"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="bg-blue-900 text-white w-12 h-12 rounded-xl flex items-center justify-center hover:bg-black disabled:bg-gray-200 transition-all shadow-lg active:scale-90"
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-blue-900 text-white w-16 h-16 rounded-2xl shadow-2xl hover:bg-black transition-all hover:scale-110 flex items-center justify-center group relative border-4 border-white"
        >
          <i className="fas fa-magic text-2xl"></i>
          <span className="absolute -top-12 right-0 bg-white text-blue-900 text-[10px] font-black px-4 py-2 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-gray-100 uppercase tracking-widest">
            ¿Dudas? Pregúntale a la IA
          </span>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
        </button>
      )}
    </div>
  );
};

export default AIAssistant;
