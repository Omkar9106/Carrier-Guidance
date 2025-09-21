'use client';

import { useState, useRef, useEffect } from 'react';

export default function Chatbot({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([
    { text: "Hello! I'm your AI assistant. How can I help you today?", isUser: false }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const message = inputValue.trim();
    if (!message || isLoading) return;

    // Add user message
    const userMessage = { text: message, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Raw Response:', {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          body: errorText
        });
        
        // Try to parse as JSON if possible
        let errorMessage = `API Error: ${response.status} - ${response.statusText}`;
        try {
          const errorData = JSON.parse(errorText);
          console.error('API Error Data:', errorData);
          errorMessage += ` - ${errorData.error?.message || errorText}`;
        } catch (e) {
          console.error('Could not parse error response as JSON');
          errorMessage += ` - ${errorText}`;
        }
        
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setMessages(prev => [...prev, { 
        text: data.reply || "I'm not sure how to respond to that.", 
        isUser: false 
      }]);
    } catch (error) {
      console.error('Chat error:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        name: error instanceof Error ? error.name : 'Unknown',
        stack: error instanceof Error ? error.stack : undefined
      });
      
      let errorMessage = "I'm having trouble connecting to the AI service. ";
      
      if (error instanceof Error) {
        if (error.message.includes('429') || error.message.includes('quota')) {
          errorMessage = "I've reached my usage limit for now. Please try again later or use a different API key in the settings.";
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage += "Please check your internet connection.";
        } else if (error.message.includes('API Error')) {
          errorMessage += "The AI service is currently unavailable.";
        } else {
          errorMessage += `Error: ${error.message}`;
        }
      }
      
      setMessages(prev => [...prev, { 
        text: errorMessage,
        isUser: false 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 inset-x-4 sm:bottom-6 sm:right-6 sm:left-auto w-full sm:w-96 max-w-full bg-slate-900 rounded-2xl shadow-xl border border-white/10 overflow-hidden flex flex-col z-50">
      <div className="bg-slate-800 p-4 flex justify-between items-center">
        <h3 className="font-semibold text-white">AI Assistant</h3>
        <button 
          onClick={onClose}
          className="text-slate-400 hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto max-h-[60vh] sm:max-h-96">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.isUser 
                    ? 'bg-blue-500 text-white rounded-br-none' 
                    : 'bg-slate-800 text-white rounded-bl-none'
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-slate-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[80px]"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
}
