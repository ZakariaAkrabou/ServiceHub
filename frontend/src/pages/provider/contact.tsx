import React, { useState } from 'react';
import ProviderLayouts from '../../components/provider/ProviderLayouts';
import { Send, MoreVertical, Search, Paperclip, Image as ImageIcon, Smile, ArrowLeft, MessageSquare } from 'lucide-react';

const mockConversations = [
    { id: '1', client: 'John Smith', service: 'Plumbing Repair', lastMessage: 'See you at 2 PM!', time: '10:42 AM', unread: 1, avatar: 'JS' },
    { id: '2', client: 'Emma Johnson', service: 'Deep Cleaning', lastMessage: 'Thank you so much.', time: 'Yesterday', unread: 0, avatar: 'EJ' },
    { id: '3', client: 'Michael Brown', service: 'Electrical Fix', lastMessage: 'Can I reschedule for tomorrow?', time: 'Mon', unread: 0, avatar: 'MB' },
];

const mockMessages = [
    { id: 1, sender: 'them', text: 'Hi! I need help with my kitchen sink.', time: '10:30 AM' },
    { id: 2, sender: 'me', text: 'Hello John! I can certainly help with that.', time: '10:32 AM' },
    { id: 3, sender: 'me', text: 'Are you available today around 2 PM?', time: '10:35 AM' },
    { id: 4, sender: 'them', text: 'Yes, 2 PM works perfectly.', time: '10:40 AM' },
    { id: 5, sender: 'them', text: 'See you at 2 PM!', time: '10:42 AM' },
];

const ProviderContact: React.FC = () => {
    const [activeChat, setActiveChat] = useState<string | null>('1');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState(mockMessages);

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
        <ProviderLayouts>
            <div className="flex flex-col gap-6 pb-2 h-[calc(100vh-120px)]">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                    <div className="min-w-0">
                        <h1
                            className="font-sans text-2xl font-bold tracking-tight text-[#1a1a1a] sm:text-3xl"
                            style={{ letterSpacing: "-0.5px" }}
                        >
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#c9a84c] to-[#e4c97c]">
                                Client
                            </span>{" "}
                            Messages
                        </h1>
                        <p className="mt-1 text-sm sm:text-base text-[#5f5f5f]">
                            Chat directly with your clients regarding their bookings.
                        </p>
                    </div>
                </div>

                {/* Chat UI */}
                <div className="flex-1 w-full bg-white rounded-2xl shadow-sm border border-[#e9e3d3] flex overflow-hidden">

                    {/* Sidebar */}
                    <div className={`w-full md:w-[320px] lg:w-[350px] border-r border-[#e9e3d3] flex flex-col ${activeChat ? 'hidden md:flex' : 'flex'}`}>
                        <div className="p-4 border-b border-[#e9e3d3]">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search clients..."
                                    className="w-full h-10 pl-9 pr-4 bg-[#f8f6f1] border border-transparent rounded-lg text-sm outline-none focus:border-[#c9a84c] focus:ring-1 focus:ring-[#c9a84c] transition-all"
                                />
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9a9a9a]" />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            {mockConversations.map((conv) => (
                                <div
                                    key={conv.id}
                                    onClick={() => setActiveChat(conv.id)}
                                    className={`flex items-center gap-3 p-4 cursor-pointer transition-colors border-b border-[#e9e3d3]/50 ${activeChat === conv.id ? 'bg-[#faf9f7]' : 'hover:bg-[#f8f6f1]'}`}
                                >
                                    <div className="relative shrink-0">
                                        <div className="w-11 h-11 rounded-full bg-[#081D3A] text-[#C9A84C] flex items-center justify-center font-bold text-sm">
                                            {conv.avatar}
                                        </div>
                                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#C9A84C] rounded-full border-2 border-white"></div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-0.5">
                                            <h3 className="text-sm font-bold text-[#1a1a2e] truncate">{conv.client}</h3>
                                            <span className="text-[11px] text-[#9a9a9a] whitespace-nowrap ml-2">{conv.time}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className={`text-xs truncate ${conv.unread ? 'font-bold text-[#1a1a2e]' : 'text-[#5f5f5f]'}`}>
                                                {conv.lastMessage}
                                            </p>
                                            {conv.unread > 0 && (
                                                <span className="w-4 h-4 shrink-0 rounded-full bg-[#C9A84C] text-white flex items-center justify-center text-[9px] font-bold ml-2">
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
                    <div className={`flex-1 flex flex-col bg-[#faf9f7] ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
                        {activeChat && activeConv ? (
                            <>
                                {/* Chat Header */}
                                <div className="h-16 px-5 border-b border-[#e9e3d3] bg-white flex items-center justify-between shadow-sm z-10 shrink-0">
                                    <div className="flex items-center gap-3">
                                        <button
                                            className="md:hidden p-1.5 -ml-1.5 text-[#5f5f5f] hover:bg-[#f8f6f1] rounded-full"
                                            onClick={() => setActiveChat(null)}
                                        >
                                            <ArrowLeft size={20} />
                                        </button>
                                        <div className="w-9 h-9 rounded-full bg-[#081D3A] text-[#C9A84C] flex items-center justify-center font-bold text-xs shrink-0">
                                            {activeConv.avatar}
                                        </div>
                                        <div>
                                            <h2 className="text-sm font-bold text-[#1a1a2e] leading-tight">{activeConv.client}</h2>
                                            <span className="text-[11px] text-[#C9A84C] font-medium">Online • {activeConv.service}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button className="w-8 h-8 rounded-full flex items-center justify-center text-[#5f5f5f] hover:bg-[#f8f6f1] transition-colors">
                                            <MoreVertical size={18} />
                                        </button>
                                    </div>
                                </div>

                                {/* Messages Area */}
                                <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar bg-[#faf9f7]">
                                    <div className="text-center">
                                        <span className="bg-[#e9e3d3]/50 text-[#5f5f5f] text-[11px] font-medium px-3 py-1 rounded-full">
                                            Today
                                        </span>
                                    </div>
                                    {messages.map((msg) => (
                                        <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[75%] ${msg.sender === 'me' ? 'order-1' : 'order-2'}`}>
                                                <div className={`p-3.5 rounded-2xl ${msg.sender === 'me'
                                                        ? 'bg-[#081D3A] text-[#f8f6f1] rounded-tr-sm shadow-sm'
                                                        : 'bg-white text-[#1a1a2e] border border-[#e9e3d3] rounded-tl-sm shadow-sm'
                                                    }`}>
                                                    <p className="text-sm leading-relaxed">{msg.text}</p>
                                                </div>
                                                <span className={`text-[10px] text-[#9a9a9a] mt-1 block ${msg.sender === 'me' ? 'text-right' : 'text-left'}`}>
                                                    {msg.time}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Input Area */}
                                <div className="p-3 bg-white border-t border-[#e9e3d3] shrink-0">
                                    <form onSubmit={handleSend} className="flex items-center gap-2">
                                        <div className="flex gap-0.5">
                                            <button type="button" className="p-2 text-[#9a9a9a] hover:text-[#081D3A] hover:bg-[#f8f6f1] rounded-full transition-colors">
                                                <Paperclip size={18} />
                                            </button>
                                            <button type="button" className="p-2 text-[#9a9a9a] hover:text-[#081D3A] hover:bg-[#f8f6f1] rounded-full transition-colors hidden sm:block">
                                                <ImageIcon size={18} />
                                            </button>
                                        </div>

                                        <div className="flex-1 relative bg-[#f8f6f1] rounded-xl border border-transparent focus-within:border-[#e9e3d3] transition-colors flex items-center h-10">
                                            <input
                                                type="text"
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                placeholder="Message client..."
                                                className="w-full h-full pl-4 pr-9 bg-transparent outline-none text-sm text-[#1a1a2e]"
                                            />
                                            <button type="button" className="absolute right-2.5 text-[#9a9a9a] hover:text-[#081D3A]">
                                                <Smile size={18} />
                                            </button>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={!message.trim()}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 ${message.trim()
                                                    ? 'bg-[#081D3A] text-[#C9A84C] shadow-sm hover:bg-[#0c2a54] hover:shadow hover:-translate-y-0.5'
                                                    : 'bg-[#e9e3d3] text-[#9a9a9a] cursor-not-allowed'
                                                }`}
                                        >
                                            <Send size={16} className={message.trim() ? 'ml-0.5' : ''} />
                                        </button>
                                    </form>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-[#5f5f5f]">
                                <div className="w-16 h-16 bg-[#f8f6f1] rounded-full flex items-center justify-center mb-3">
                                    <MessageSquare size={28} className="text-[#c9a84c]" />
                                </div>
                                <h3 className="text-lg font-bold text-[#1a1a2e] mb-1">Client Messages</h3>
                                <p className="text-sm">Select a client to start chatting</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </ProviderLayouts>
    );
};

export default ProviderContact;
