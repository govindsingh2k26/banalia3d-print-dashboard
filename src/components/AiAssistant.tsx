import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Loader2, 
  Sparkles, 
  Search, 
  ExternalLink, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  addDoc, 
  getDocs, 
  serverTimestamp 
} from 'firebase/firestore';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{ title: string; url: string }>;
  createdAt?: any;
}

const SUGGESTED_PROMPTS = [
  "What is the precision level of Banalia3D prints?",
  "Should I choose PLA or PETG for outdoor use?",
  "What's the best material for precision engineering prototypes?",
  "How can I order custom action figures via WhatsApp?"
];

export default function AiAssistant() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "👋 Greetings! I am Banalia3D Sentry, your AI Printing & Engineering Specialist. I am armed with real-time Google Search grounding. Ask me anything about filament specifications, custom design options, or engineering prototypes!"
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history from Firestore when user logs in
  useEffect(() => {
    if (user) {
      const loadHistory = async () => {
        try {
          const mRef = collection(db, 'chat_messages');
          const q = query(
            mRef, 
            orderBy('createdAt', 'asc'),
            limit(50)
          );
          const querySnapshot = await getDocs(q);
          const historyList: Message[] = [];
          
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.userId === user.uid) {
              historyList.push({
                role: data.role,
                content: data.content,
                sources: data.sources || []
              });
            }
          });

          if (historyList.length > 0) {
            setMessages(historyList);
          } else {
            // First time login - greet them
            setMessages([
              {
                role: 'assistant',
                content: `Greetings, ${user.displayName || 'Maker'}! I am Banalia3D Sentry. Talk to me! Since you are signed in, your workspace progress is backed up securely on our Firestore Cloud database.`
              }
            ]);
          }
        } catch (error) {
          console.error("Error loading chat history:", error);
        }
      };
      loadHistory();
    } else {
      // Clear history to guest default if sign-out
      setMessages([
        {
          role: 'assistant',
          content: "👋 Greetings! I am Banalia3D Sentry, your AI Printing & Engineering Specialist. I am armed with real-time Google Search grounding. Ask me anything about filament specifications, custom design options, or engineering prototypes!"
        }
      ]);
    }
  }, [user]);

  // Scroll to bottom when messages list changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  // Alert guest on hover / initial focus
  const handleSendMessage = async (customPrompt?: string | null) => {
    const textToSend = customPrompt || inputMessage.trim();
    if (!textToSend || isLoading) return;

    const userMsg: Message = { role: 'user', content: textToSend };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInputMessage('');
    setIsLoading(true);

    // Save user message to Firestore if logged in
    if (user) {
      try {
        await addDoc(collection(db, 'chat_messages'), {
          userId: user.uid,
          role: 'user',
          content: textToSend,
          createdAt: serverTimestamp()
        });
      } catch (error) {
        console.error("Error writing user msg to firestore:", error);
      }
    }

    try {
      // Call local backend endpoint with the conversation history
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages: newMsgs })
      });

      if (!response.ok) {
        throw new Error("Failed to contact Sentry backend");
      }

      const data = await response.json();
      
      const assistantMsg: Message = {
        role: 'assistant',
        content: data.text,
        sources: data.sources || []
      };

      setMessages(prev => [...prev, assistantMsg]);

      // Save model message to Firestore if logged in
      if (user) {
        await addDoc(collection(db, 'chat_messages'), {
          userId: user.uid,
          role: 'assistant',
          content: data.text,
          sources: data.sources || [],
          createdAt: serverTimestamp()
        });
      }
    } catch (error: any) {
      console.error(error);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: `⚠️ System link error: ${error.message || "Failed to reach search backend. Ensure server is initialized."}`
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setHasNewMessage(false);
  };

  return (
    <div id="ai-sentry-widget" className="fixed bottom-6 right-6 z-150 font-sans">
      
      {/* Floating Button Indicator */}
      {!isOpen && (
        <button
          id="btn-ai-widget-trigger"
          onClick={toggleChat}
          className="relative group p-4 rounded-full bg-gradient-to-tr from-cyan-400 via-blue-500 to-red-500 hover:scale-105 active:scale-95 text-white shadow-2xl transition-all duration-300 cursor-pointer flex items-center justify-center"
          title="Talk to Banalia3D AI Sentry (Live Search Grounded)"
        >
          {/* Pulsing surround rings */}
          <span className="animate-ping absolute inset-0 -m-1 rounded-full bg-cyan-400/40 opacity-75"></span>
          
          <Bot className="w-6 h-6 relative z-10" />
          
          <span className="absolute right-12 scale-0 group-hover:scale-100 bg-gray-950/90 text-cyan-400 border border-white/10 text-[10px] font-mono tracking-widest font-black uppercase px-3 py-1 rounded-lg transition-all duration-200 shadow-xl whitespace-nowrap">
            👾 ASK AI SENTRY
          </span>
        </button>
      )}

      {/* Main Chat Drawer */}
      {isOpen && (
        <div 
          id="ai-sentry-chatbox"
          className="w-[90vw] sm:w-[380px] h-[550px] max-h-[80vh] rounded-3xl glass-panel-heavy border border-white/15 bg-[#08080c]/95 shadow-2xl flex flex-col justify-between overflow-hidden animate-fade-in text-white"
        >
          {/* Header Panel */}
          <div className="p-4 border-b border-white/10 bg-gradient-to-r from-cyan-950/40 to-red-950/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-400 to-red-500 flex items-center justify-center p-[1px]">
                <div className="w-full h-full bg-[#05050a] rounded-[11px] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-cyan-400 animate-pulse" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider font-mono text-white">
                    BANALIA3D SENTRY
                  </h4>
                  <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-[8px] font-mono font-bold text-cyan-400 tracking-wide uppercase">
                    <Search className="w-2.5 h-2.5" /> LIVE SEARCH
                  </span>
                </div>
                <p className="text-[9px] font-mono text-gray-400">
                  {user ? `Connected workspace: ${user.email}` : 'Signed out • Guest sandbox'}
                </p>
              </div>
            </div>

            <button
              id="btn-close-ai-chat"
              onClick={toggleChat}
              className="p-1 px-2.5 rounded bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white text-xs font-mono transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Grid Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 border border-cyan-400/30 text-white rounded-tr-none'
                      : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line font-light">{msg.content}</p>

                  {/* Grounded Web Sources References */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-white/5 space-y-1.5">
                      <div className="text-[9px] font-mono uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                        <Search className="w-2.5 h-2.5" /> Google Seaerch Grounding Sources:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.sources.map((src, sIdx) => (
                          <a
                            key={sIdx}
                            href={src.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#0a0a14] border border-white/5 text-[9px] font-mono text-gray-400 hover:text-cyan-400 hover:border-cyan-400/30 transition-all font-medium py-1"
                          >
                            <span>{src.title.length > 25 ? src.title.slice(0, 25) + '...' : src.title}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <span className="text-[8px] font-mono text-gray-500 uppercase mt-1 tracking-wide">
                  {msg.role === 'user' ? (user?.displayName || 'USER') : 'AI SENTRY'}
                </span>
              </div>
            ))}

            {isLoading && (
              <div className="flex flex-col items-start">
                <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2 text-xs font-mono text-cyan-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Grounding web variables...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions container */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2 pt-1 border-t border-white/5 bg-gray-950/20">
              <span className="text-[9px] font-mono text-gray-500 uppercase block mb-1">SUGGESTED ENQUIRIES</span>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_PROMPTS.map((prompt, num) => (
                  <button
                    key={num}
                    onClick={() => handleSendMessage(prompt)}
                    className="text-left text-[10px] font-mono text-gray-400 hover:text-cyan-400 bg-white/5 border border-white/5 hover:border-cyan-400/20 rounded-lg px-2.5 py-1 text-xs truncate max-w-full cursor-pointer transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Guest Reminder alert */}
          {!user && (
            <div className="px-4 py-1 bg-red-500/5 border-t border-white/5 flex items-center gap-1.5 text-[10px] font-mono text-gray-400 justify-center">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
              <span>Sign in at navigation header to save conversation!</span>
            </div>
          )}

          {/* Footer Input Box */}
          <div className="p-3 border-t border-white/10 bg-[#06060a]/90 flex gap-2">
            <input
              id="input-ai-sentry-message"
              type="text"
              placeholder="Ask filament info or parameters..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs font-sans text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
            />
            <button
              id="btn-ai-send-message"
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputMessage.trim()}
              className="p-2 px-3 rounded-xl bg-cyan-400 hover:bg-cyan-500 disabled:opacity-40 disabled:hover:bg-cyan-400 text-[#050505] transition-all flex items-center justify-center font-bold"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
