import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../../components/client/Header';
import { Send, MoreVertical, Search, Paperclip, Image as ImageIcon, Smile, ArrowLeft, MessageSquare } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../../app/slices/AuthSlice';
import { useGetCustomerBookingsQuery, useGetChatMessagesQuery, useMarkChatMessagesAsReadMutation, type ChatMessage, type Booking } from '../../../app/api/BookingApi';
import { io, type Socket } from 'socket.io-client';

const Chat: React.FC = () => {
  const { bookingId } = useParams<{ bookingId?: string }>();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const [activeChat, setActiveChat] = useState<string | null>(bookingId || null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: bookingsData } = useGetCustomerBookingsQuery();
  const [markAsRead] = useMarkChatMessagesAsReadMutation();
  
  const chatBookings = useMemo(() => {
    if (!bookingsData?.data) return [];
    return bookingsData.data.filter(b => b.status === 'confirmed' && b.chosenContactMethod === 'chat');
  }, [bookingsData]);

  const activeConv = chatBookings.find(b => b._id === activeChat);

  const { data: chatHistory, refetch: refetchChatHistory } = useGetChatMessagesQuery(activeChat as string, {
    skip: !activeChat
  });


  useEffect(() => {
    if (bookingId && bookingId !== activeChat) {
      setActiveChat(bookingId);
    }
  }, [bookingId, activeChat]);

 
  useEffect(() => {
    if (activeChat && activeChat !== bookingId) {
      navigate(`/chat/${activeChat}`, { replace: true });
    }
  }, [activeChat, bookingId, navigate]);


  useEffect(() => {
    if (chatHistory?.success && chatHistory.chat && chatHistory.chat.length > 0) {
      setMessages(prev => {

        if (JSON.stringify(prev) !== JSON.stringify(chatHistory.chat)) {
          return chatHistory.chat;
        }
        return prev;
      });
    } else if (chatHistory?.success && chatHistory.chat?.length === 0) {
      setMessages([]);
    }
  }, [chatHistory?.success, chatHistory?.chat]);


  useEffect(() => {
    if (activeChat) {
      refetchChatHistory();
    }
  }, [activeChat, refetchChatHistory]);

  const handleSend = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !activeChat || !user?._id || !socketRef.current) return;

    const tempId = `temp_${Date.now()}`;
    const optimisticMessage: ChatMessage = {
      _id: tempId,
      booking_id: activeChat,
      sender_id: user._id,
      receiver_id: '', 
      message: message.trim(),
      isRead: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

  
    setMessages(prev => [...prev, optimisticMessage]);
    setMessage('');

    socketRef.current.emit("sendMessage", {
      data: {
        bookingId: activeChat,
        senderId: user._id,
        message: message.trim()
      }
    });
  }, [activeChat, message, user]);

  const getProviderName = (conv: Booking): string => {
    const p = conv?.service_id?.provider_id;
    if (p) return `${p.firstName} ${p.lastName}`;
    return "Provider";
  };

  const getProviderInitials = (conv: Booking): string => {
    const p = conv?.service_id?.provider_id;
    if (p) return `${p.firstName?.[0] || ''}${p.lastName?.[0] || ''}`.toUpperCase();
    return "P";
  };


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
       
          const tempIndex = prev.findIndex(m => m._id === response.message._id || 
            (m._id.startsWith('temp_') && m.message === response.message.message && 
             Math.abs(new Date(m.createdAt).getTime() - new Date(response.message.createdAt).getTime()) < 1000));
          
          if (tempIndex !== -1) {
            const updated = [...prev];
            updated[tempIndex] = response.message;
            return updated;
          }
          
          if (prev.some(m => m._id === response.message._id)) return prev;
          return [...prev, response.message];
        });


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

  return (
    <div className="h-screen bg-white font-sans text-[#222325] flex flex-col overflow-hidden">
      <Header />
      
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-24 pb-6 flex overflow-hidden">
        <div className="w-full h-full bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-[#e4e5e7] flex overflow-hidden">
          
          {/* Sidebar */}
          <div className={`w-full md:max-w-xs lg:w-96 border-r border-[#e4e5e7] flex flex-col ${activeChat ? 'hidden md:flex' : 'flex'}`}>
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
              {chatBookings.length === 0 ? (
                <div className="p-6 text-center text-[#74767e]">
                  No active chats available.
                </div>
              ) : (
                chatBookings.map((conv) => (
                  <div 
                    key={conv._id}
                    onClick={() => setActiveChat(conv._id)}
                    className={`flex items-center gap-3 p-4 cursor-pointer transition-colors border-b border-[#e4e5e7]/50 ${activeChat === conv._id ? 'bg-[#f8f9fa]' : 'hover:bg-[#f5f5f5]'}`}
                  >
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-brand-blue text-accent flex items-center justify-center font-bold text-[16px]">
                        {getProviderInitials(conv)}
                      </div>
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-accent rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="text-[16px] font-bold text-[#222325] truncate">{getProviderName(conv)}</h3>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-[14px] truncate text-[#74767e]">
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
                    <div className="w-10 h-10 rounded-full bg-brand-blue text-accent flex items-center justify-center font-bold text-[14px]">
                      {getProviderInitials(activeConv)}
                    </div>
                    <div>
                      <h2 className="text-[16px] font-bold text-[#222325] leading-tight">{getProviderName(activeConv)}</h2>
                      <span className="text-[13px] text-accent font-medium">Online • {activeConv.service_id?.category}</span>
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
                  {messages.length === 0 ? (
                    <div className="text-center text-[#74767e] mt-10">
                      No messages yet. Send a message to start the conversation!
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isMe = msg.sender_id === user?._id;
                      return (
                        <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[70%] ${isMe ? 'order-1' : 'order-2'}`}>
                            <div className={`p-4 rounded-2xl ${
                              isMe 
                                ? 'bg-brand-blue text-white rounded-tr-sm shadow-md' 
                                : 'bg-white text-[#222325] border border-[#e4e5e7] rounded-tl-sm shadow-sm'
                            }`}>
                              <p className="text-[15px] leading-relaxed">{msg.message}</p>
                            </div>
                            <div className={`flex items-center gap-1 text-[11px] text-[#74767e] mt-1.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
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
                <div className="p-4 bg-white border-t border-[#e4e5e7]">
                  <form onSubmit={handleSend} className="flex items-end gap-2">
                    <div className="flex gap-1 mb-1.5">
                      <button type="button" className="p-2 text-[#74767e] hover:text-brand-blue hover:bg-[#f5f5f5] rounded-full transition-colors">
                        <Paperclip size={20} />
                      </button>
                      <button type="button" className="p-2 text-[#74767e] hover:text-brand-blue hover:bg-[#f5f5f5] rounded-full transition-colors hidden sm:block">
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
                      <button type="button" className="absolute right-3 text-[#74767e] hover:text-brand-blue">
                        <Smile size={20} />
                      </button>
                    </div>
                    
                    <button 
                      type="submit" 
                      disabled={!message.trim()}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        message.trim() 
                          ? 'bg-brand-blue text-accent shadow-md hover:bg-[#0c2a54] hover:shadow-lg hover:-translate-y-0.5' 
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
                  <MessageSquare size={32} className="text-[#c5c6c9]" />
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
