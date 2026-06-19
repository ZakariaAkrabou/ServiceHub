import React, { useState, useEffect, useRef, useMemo } from 'react';
import ProviderLayouts from '../../components/provider/ProviderLayouts';
import { Send, MoreVertical, Search, Paperclip, Image as ImageIcon, Smile, ArrowLeft, MessageSquare } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../app/slices/AuthSlice';
import { useGetProviderBookingsQuery, useGetChatMessagesQuery, useMarkChatMessagesAsReadMutation, ChatMessage } from '../../app/api/BookingApi';
import { io, Socket } from 'socket.io-client';

const ProviderContact: React.FC = () => {
    const user = useSelector(selectCurrentUser);
    const [activeChat, setActiveChat] = useState<string | null>(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const socketRef = useRef<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const { data: bookingsData } = useGetProviderBookingsQuery();
    const [markAsRead] = useMarkChatMessagesAsReadMutation();

    const chatBookings = useMemo(() => {
        if (!bookingsData?.data) return [];
        return bookingsData.data.filter(b => b.status === 'confirmed' && b.chosenContactMethod === 'chat');
    }, [bookingsData]);

    const activeConv = chatBookings.find(b => b._id === activeChat);

    useEffect(() => {
        if (!activeChat && chatBookings.length > 0) {
            setActiveChat(chatBookings[0]._id);
        }
    }, [chatBookings, activeChat]);

    const { data: chatHistory, refetch: refetchChatHistory } = useGetChatMessagesQuery(activeChat as string, {
        skip: !activeChat
    });

    useEffect(() => {
        if (chatHistory?.success && chatHistory.chat) {
            setMessages(chatHistory.chat);
        }
    }, [chatHistory]);

    useEffect(() => {
        if (activeChat) {
            refetchChatHistory();
        }
    }, [activeChat, refetchChatHistory]);

    useEffect(() => {
        if (!socketRef.current) {
            socketRef.current = io("http://localhost:5000", { withCredentials: true });
        }
        const socket = socketRef.current;

        if (activeChat && user?._id) {
            socket.emit("joinRoom", activeChat, user._id);
            socket.emit("mark_read", { bookingId: activeChat, userId: user._id });
            markAsRead(activeChat);
        }

        const onReceiveMessage = (response: { success: boolean, message: ChatMessage }) => {
            if (response.success && response.message && response.message.booking_id === activeChat) {
                setMessages(prev => {
                    if (prev.some(m => m._id === response.message._id)) return prev;
                    return [...prev, response.message];
                });

                // If we received a message while in chat, mark it read immediately
                if (response.message.receiver_id === user?._id) {
                    socket.emit("mark_read", { bookingId: activeChat, userId: user._id });
                    markAsRead(activeChat);
                }
            }
        };

        const onMessagesRead = ({ bookingId }: { bookingId: string }) => {
            if (bookingId === activeChat) {
                setMessages(prev => prev.map(m => ({ ...m, isRead: true })));
            }
        };

        socket.on("receive_message", onReceiveMessage);
        socket.on("messages_read", onMessagesRead);

        return () => {
            socket.off("receive_message", onReceiveMessage);
            socket.off("messages_read", onMessagesRead);
        };
    }, [activeChat, user?._id, markAsRead]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || !activeChat || !user?._id || !socketRef.current) return;

        socketRef.current.emit("sendMessage", {
            data: {
                bookingId: activeChat,
                senderId: user._id,
                message: message.trim()
            }
        });

        setMessage('');
    };

    const getClientName = (conv: any) => {
        const c = conv?.customer_id;
        if (c) return `${c.firstName} ${c.lastName}`;
        return "Client";
    };

    const getClientInitials = (conv: any) => {
        const c = conv?.customer_id;
        if (c) return `${c.firstName?.[0] || ''}${c.lastName?.[0] || ''}`.toUpperCase();
        return "C";
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
                    <div className={`w-full md:w-[320px] lg:w-87.5 border-r border-[#e9e3d3] flex flex-col ${activeChat ? 'hidden md:flex' : 'flex'}`}>
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
                            {chatBookings.length === 0 ? (
                                <div className="p-5 text-center text-[#9a9a9a] text-sm">
                                    No active client messages.
                                </div>
                            ) : (
                                chatBookings.map((conv) => (
                                    <div
                                        key={conv._id}
                                        onClick={() => setActiveChat(conv._id)}
                                        className={`flex items-center gap-3 p-4 cursor-pointer transition-colors border-b border-[#e9e3d3]/50 ${activeChat === conv._id ? 'bg-[#faf9f7]' : 'hover:bg-[#f8f6f1]'}`}
                                    >
                                        <div className="relative shrink-0">
                                            <div className="w-11 h-11 rounded-full bg-brand-blue text-[#C9A84C] flex items-center justify-center font-bold text-sm">
                                                {getClientInitials(conv)}
                                            </div>
                                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#C9A84C] rounded-full border-2 border-white"></div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline mb-0.5">
                                                <h3 className="text-sm font-bold text-[#1a1a2e] truncate">{getClientName(conv)}</h3>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <p className="text-xs truncate text-[#5f5f5f]">
                                                    {conv.service_id?.name}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
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
                                        <div className="w-9 h-9 rounded-full bg-brand-blue text-[#C9A84C] flex items-center justify-center font-bold text-xs shrink-0">
                                            {getClientInitials(activeConv)}
                                        </div>
                                        <div>
                                            <h2 className="text-sm font-bold text-[#1a1a2e] leading-tight">{getClientName(activeConv)}</h2>
                                            <span className="text-[11px] text-[#C9A84C] font-medium">Online • Client</span>
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
                                    {messages.length === 0 ? (
                                        <div className="text-center text-[#9a9a9a] text-sm mt-10">
                                            No messages yet. Send a message to the client.
                                        </div>
                                    ) : (
                                        messages.map((msg) => {
                                            const isMe = msg.sender_id === user?._id;
                                            return (
                                                <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                    <div className={`max-w-[75%] ${isMe ? 'order-1' : 'order-2'}`}>
                                                        <div className={`p-3.5 rounded-2xl ${isMe
                                                                ? 'bg-brand-blue text-[#f8f6f1] rounded-tr-sm shadow-sm'
                                                                : 'bg-white text-[#1a1a2e] border border-[#e9e3d3] rounded-tl-sm shadow-sm'
                                                            }`}>
                                                            <p className="text-sm leading-relaxed">{msg.message}</p>
                                                        </div>
                                                        <div className={`flex items-center gap-1 text-[10px] text-[#9a9a9a] mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                            <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                            {isMe && (
                                                                <span className={msg.isRead ? 'text-[#34b7f1]' : 'text-[#a1a3a7]'}>
                                                                    {msg.isRead ? '✓✓' : '✓'}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input Area */}
                                <div className="p-3 bg-white border-t border-[#e9e3d3] shrink-0">
                                    <form onSubmit={handleSend} className="flex items-center gap-2">
                                        <div className="flex gap-0.5">
                                            <button type="button" className="p-2 text-[#9a9a9a] hover:text-brand-blue hover:bg-[#f8f6f1] rounded-full transition-colors">
                                                <Paperclip size={18} />
                                            </button>
                                            <button type="button" className="p-2 text-[#9a9a9a] hover:text-brand-blue hover:bg-[#f8f6f1] rounded-full transition-colors hidden sm:block">
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
                                            <button type="button" className="absolute right-2.5 text-[#9a9a9a] hover:text-brand-blue">
                                                <Smile size={18} />
                                            </button>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={!message.trim()}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 ${message.trim()
                                                    ? 'bg-brand-blue text-[#C9A84C] shadow-sm hover:bg-[#0c2a54] hover:shadow hover:-translate-y-0.5'
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
