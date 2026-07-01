/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, AlertCircle, HelpCircle } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

const QUICK_SUGGESTIONS = [
  "وضعیت بازار مسکن در نیاوران چگونه است؟",
  "مدارک لازم برای نوشتن قولنامه ملکی چیست؟",
  "حق کمیسیون قانونی چقدر است؟",
  "بهترین محله‌های اصفهان برای خرید خانه کدامند؟"
];

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      content: 'سلام! من آشیون‌یار، مشاور هوشمند املاک شما هستم. چطور می‌توانم در خرید، فروش، اجاره یا مشاوره بازار مسکن به شما کمک کنم؟'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMessage: ChatMessage = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.concat(userMessage)
        })
      });

      if (!response.ok) {
        throw new Error('خطا در ارتباط با سرور هوش مصنوعی');
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'model', content: data.text }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          content: 'پوزش می‌خواهم، مشکلی در پردازش گفتگو پیش آمد. لطفاً مجدداً تلاش کنید.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Trigger Button */}
      {!isOpen && (
        <button
          id="ai-chat-trigger"
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3 border border-slate-700/50 group"
        >
          <div className="relative">
            <MessageSquare className="w-6 h-6 text-emerald-400 group-hover:rotate-12 transition-transform duration-300" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>
          </div>
          <span className="font-bold text-sm tracking-wide pl-1">آشیون‌یار (هوش مصنوعی)</span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          id="ai-chat-window"
          className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-96 h-[500px] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-4 text-white flex items-center justify-between border-b border-slate-700">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-emerald-400 to-teal-500 p-2 rounded-xl text-slate-900 shadow-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm">دستیار هوشمند آشیون</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                  <span className="text-[10px] text-emerald-300">پاسخگویی آنی مجهز به هوش مصنوعی</span>
                </div>
              </div>
            </div>
            <button
              id="ai-chat-close"
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages list */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-slate-900 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-end">
                <div className="bg-white text-slate-800 border border-slate-100 rounded-2xl rounded-tl-none p-3.5 text-sm shadow-sm flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  <span className="text-xs text-slate-400 font-medium">درحال تحلیل بازار...</span>
                </div>
              </div>
            )}
            <div ref={scrollToBottom} />
          </div>

          {/* Quick suggestions */}
          {messages.length === 1 && (
            <div className="px-4 py-2 bg-slate-50 border-t border-slate-100">
              <p className="text-[11px] text-slate-400 font-bold mb-2 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-emerald-500" /> سوالات پیشنهادی:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_SUGGESTIONS.map((s, idx) => (
                  <button
                    key={idx}
                    id={`quick-suggestion-${idx}`}
                    onClick={() => handleSend(s)}
                    className="text-[11px] bg-white border border-slate-200 text-slate-700 px-2.5 py-1.5 rounded-xl hover:border-slate-400 hover:bg-slate-50 transition text-right w-full block truncate"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Footer input */}
          <form
            id="ai-chat-form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="p-3 border-t border-slate-100 bg-white flex gap-2"
          >
            <input
              type="text"
              id="ai-chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="سوال خود را درباره بازار املاک بپرسید..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
            />
            <button
              type="submit"
              id="ai-chat-submit"
              disabled={loading || !input.trim()}
              className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white p-2.5 rounded-xl shadow-md transition"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
