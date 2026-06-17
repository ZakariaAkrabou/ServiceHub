import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../../../components/client/Header';
import { Send, Phone, Video, MoreVertical, Search, Paperclip, Image as ImageIcon, Smile, ArrowLeft } from 'lucide-react';

const mockConversations = [
  { id: '1', provider: 'Ahmed Ali', role: 'Plumbing Expert', lastMessage: 'I will be there in 30 minutes.', time: '10:42 AM', unread: 2, avatar: 'AA' },
  { id: '2', provider: 'Sara Smith', role: 'Cleaning Professional', lastMessage: 'Thanks for the booking!', time: 'Yesterday', unread: 0, avatar: 'SS' },
  { id: '3', provider: 'John Doe', role: 'Electrician', lastMessage: 'Can you send a picture of the panel?', time: 'Mon', unread: 0, avatar: 'JD' },
];

const mockMessages = [
  { id: 1, sender: 'them', text: 'Hello! I saw your booking request.', time: '10:30 AM' },
  { id: 2, sender: 'me', text: 'Hi! Yes, I need some help with my kitchen sink.', time: '10:32 AM' },
  { id: 3, sender: 'them', text: 'No problem. I can fix that today. Are you available around 2 PM?', time: '10:35 AM' },
  { id: 4, sender: 'me', text: 'Yes, 2 PM works perfectly.', time: '10:40 AM' },
  { id: 5, sender: 'them', text: 'Great! I will be there in 30 minutes.', time: '10:42 AM' },
];

const Chat: React.FC = () => {
  const { bookingId } = useParams<{ bookingId?: string }>();
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(mockMessages);

  useEffect(() => {
    // If we land with a bookingId, mock selecting the first chat or a specific chat
    if (bookingId) {
      setActiveChat('1');
    } else {
      setActiveChat('1'); // Default to first chat for demo purposes
    }
  }, [bookingId]);

  const activeConv = mockConversations.find(c => c.id === activeChat);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setMessages([...messages, {
      id: Date.now(),
      sender: 'me',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setMessage('');
  };

  return (
    <div className="h-screen bg-white font-sans text-[#222325] flex flex-col overflow-hidden">
      <Header />
      
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 pt-24 pb-6 flex overflow-hidden">
        <div className="w-full h-full bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-[#e4e5e7] flex overflow-hidden">
          
          {/* Sidebar */}
          <div className={`w-full md:w-[350px] lg:w-[400px] border-r border-[#e4e5e7] flex flex-col ${activeChat ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-4 border-b border-[#e4e5e7]">
              <h2 className="text-[24px] font-bold text-[#222325] mb-4">Messages</h2>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search conversations..." 
                  className="w-full h-11 pl-10 pr-4 bg-[#f5f5f5] border-transparent rounded-xl text-[15px] outline-none focus:border-[#222325] focus:bg-white border transition-colors"
                />
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#74767e]" />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {mockConversations.map((conv) => (
                <div 
                  key={conv.id}
                  onClick={() => setActiveChat(conv.id)}
                  className={`flex items-center gap-3 p-4 cursor-pointer transition-colors border-b border-[#e4e5e7]/50 ${activeChat === conv.id ? 'bg-[#f8f9fa]' : 'hover:bg-[#f5f5f5]'}`}
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-[#081D3A] text-[#C9A84C] flex items-center justify-center font-bold text-[16px]">
                      {conv.avatar}
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#C9A84C] rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="text-[16px] font-bold text-[#222325] truncate">{conv.provider}</h3>
                      <span className="text-[12px] text-[#74767e] whitespace-nowrap ml-2">{conv.time}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className={`text-[14px] truncate ${conv.unread ? 'font-bold text-[#222325]' : 'text-[#74767e]'}`}>
                        {conv.lastMessage}
                      </p>
                      {conv.unread > 0 && (
                        <span className="w-5 h-5 rounded-full bg-[#C9A84C] text-white flex items-center justify-center text-[10px] font-bold ml-2">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className={`flex-1 flex flex-col bg-[#fafafa] ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
            {activeChat && activeConv ? (
              <>
                {/* Chat Header */}
                <div className="h-20 px-6 border-b border-[#e4e5e7] bg-white flex items-center justify-between shadow-sm z-10">
                  <div className="flex items-center gap-4">
                    <button 
                      className="md:hidden p-2 -ml-2 text-[#404145] hover:bg-[#f5f5f5] rounded-full"
                      onClick={() => setActiveChat(null)}
                    >
                      <ArrowLeft size={24} />
                    </button>
                    <div className="w-10 h-10 rounded-full bg-[#081D3A] text-[#C9A84C] flex items-center justify-center font-bold text-[14px]">
                      {activeConv.avatar}
                    </div>
                    <div>
                      <h2 className="text-[16px] font-bold text-[#222325] leading-tight">{activeConv.provider}</h2>
                      <span className="text-[13px] text-[#C9A84C] font-medium">Online • {activeConv.role}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="w-10 h-10 rounded-full flex items-center justify-center text-[#404145] hover:bg-[#f5f5f5] transition-colors">
                      <MoreVertical size={20} />
                    </button>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[#fafafa]">
                  <div className="text-center">
                    <span className="bg-[#e4e5e7]/50 text-[#74767e] text-[12px] font-medium px-3 py-1 rounded-full">
                      Today
                    </span>
                  </div>
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] ${msg.sender === 'me' ? 'order-1' : 'order-2'}`}>
                        <div className={`p-4 rounded-2xl ${
                          msg.sender === 'me' 
                            ? 'bg-[#081D3A] text-white rounded-tr-sm shadow-md' 
                            : 'bg-white text-[#222325] border border-[#e4e5e7] rounded-tl-sm shadow-sm'
                        }`}>
                          <p className="text-[15px] leading-relaxed">{msg.text}</p>
                        </div>
                        <span className={`text-[11px] text-[#74767e] mt-1.5 block ${msg.sender === 'me' ? 'text-right' : 'text-left'}`}>
                          {msg.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-[#e4e5e7]">
                  <form onSubmit={handleSend} className="flex items-end gap-2">
                    <div className="flex gap-1 mb-1.5">
                      <button type="button" className="p-2 text-[#74767e] hover:text-[#081D3A] hover:bg-[#f5f5f5] rounded-full transition-colors">
                        <Paperclip size={20} />
                      </button>
                      <button type="button" className="p-2 text-[#74767e] hover:text-[#081D3A] hover:bg-[#f5f5f5] rounded-full transition-colors hidden sm:block">
                        <ImageIcon size={20} />
                      </button>
                    </div>
                    
                    <div className="flex-1 relative bg-[#f5f5f5] rounded-2xl border border-transparent focus-within:border-[#e4e5e7] transition-colors flex items-center">
                      <input 
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message..." 
                        className="w-full h-12 pl-4 pr-10 bg-transparent outline-none text-[15px]"
                      />
                      <button type="button" className="absolute right-3 text-[#74767e] hover:text-[#081D3A]">
                        <Smile size={20} />
                      </button>
                    </div>
                    
                    <button 
                      type="submit" 
                      disabled={!message.trim()}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        message.trim() 
                          ? 'bg-[#081D3A] text-[#C9A84C] shadow-md hover:bg-[#0c2a54] hover:shadow-lg hover:-translate-y-0.5' 
                          : 'bg-[#e4e5e7] text-[#a1a3a7] cursor-not-allowed'
                      }`}
                    >
                      <Send size={20} className={message.trim() ? 'ml-1' : ''} />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-[#74767e]">
                <div className="w-20 h-20 bg-[#f5f5f5] rounded-full flex items-center justify-center mb-4">
                  <Send size={32} className="text-[#c5c6c9]" />
                </div>
                <h3 className="text-[20px] font-bold text-[#222325] mb-2">Your Messages</h3>
                <p>Select a conversation to start chatting</p>
              </div>
            )}
          </div>
          
        </div>
      </main>
    </div>
  );
};

export default Chat;
