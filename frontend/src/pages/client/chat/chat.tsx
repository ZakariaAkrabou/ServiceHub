import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../../components/client/Header';
import { Send, MoreVertical, Search, Paperclip, Image as ImageIcon, Smile, ArrowLeft, MessageSquare } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuthToken, selectCurrentUser } from '../../../app/slices/AuthSlice';
import { useBootstrapping } from '../../../app/BootContext';
import {
  bookingApi,
  useGetCustomerBookingsQuery,
  useGetChatMessagesQuery,
  useMarkChatMessagesAsReadMutation,
  type ChatMessage,
  type Booking,
} from '../../../app/api/BookingApi';
import { getLastMessagePreview, pickDefaultChatId, sortChatBookings } from '../../../utils/chatHelpers';
import { getSocket } from '../../../hooks/useSocket';

const Chat: React.FC = () => {
  const { bookingId } = useParams<{ bookingId?: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectAuthToken);
  const bootstrapping = useBootstrapping();
  const authReady = !!token && !bootstrapping;

  const [activeChat, setActiveChat] = useState<string | null>(bookingId || null);
  const [message, setMessage] = useState('');
  const [pendingMessages, setPendingMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [contactSearch, setContactSearch] = useState('');
  const [messageSearch, setMessageSearch] = useState('');
  const [isSearchingMessages, setIsSearchingMessages] = useState(false);
  const [localUnreadOverrides, setLocalUnreadOverrides] = useState<Record<string, number>>({});

  const { data: bookingsData, isLoading: isLoadingBookings } = useGetCustomerBookingsQuery(undefined, {
    skip: !authReady,
  });
  const [markAsRead] = useMarkChatMessagesAsReadMutation();

  const chatBookings = useMemo(() => {
    if (!bookingsData?.data) return [];
    return sortChatBookings(
      bookingsData.data.filter((b) => b.status === 'confirmed' && b.chosenContactMethod === 'chat'),
    );
  }, [bookingsData]);

  const activeConv = chatBookings.find((b) => b._id === activeChat);

  const {
    data: chatHistory,
    isLoading: isLoadingMessages,
    isFetching: isFetchingMessages,
  } = useGetChatMessagesQuery(activeChat as string, {
    skip: !authReady || !activeChat,
  });

  const messages = useMemo(() => {
    const history = chatHistory?.success && Array.isArray(chatHistory.chat) ? chatHistory.chat : [];
    const merged = [...history];

    for (const pending of pendingMessages) {
      const existingIndex = merged.findIndex(
        (m) =>
          m._id === pending._id ||
          (m._id.startsWith('temp_') &&
            pending._id.startsWith('temp_') &&
            m.message === pending.message),
      );

      if (existingIndex !== -1) {
        merged[existingIndex] = pending._id.startsWith('temp_') ? merged[existingIndex] : pending;
      } else if (!merged.some((m) => m._id === pending._id)) {
        merged.push(pending);
      }
    }

    return merged.sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  }, [chatHistory, pendingMessages]);

  const filteredChatBookings = useMemo(() => {
    if (!contactSearch.trim()) return chatBookings;
    const lowerSearch = contactSearch.toLowerCase();
    return chatBookings.filter((conv) => {
      const p = conv?.service_id?.provider_id;
      const name = p ? `${p.firstName} ${p.lastName}`.toLowerCase() : 'provider';
      const preview = getLastMessagePreview(conv, user?._id, conv.service_id?.name)?.toLowerCase() || '';
      return name.includes(lowerSearch) || preview.includes(lowerSearch);
    });
  }, [chatBookings, contactSearch, user?._id]);

  const filteredMessages = useMemo(() => {
    if (!messageSearch.trim() || !isSearchingMessages) return messages;
    const lowerSearch = messageSearch.toLowerCase();
    return messages.filter((m) => m.message.toLowerCase().includes(lowerSearch));
  }, [messages, messageSearch, isSearchingMessages]);

  useEffect(() => {
    if (!bookingId) return;
    // Defer the state update to avoid synchronous setState within the effect
    const t = setTimeout(() => {
      setActiveChat((prev) => (prev !== bookingId ? bookingId : prev));
    }, 0);
    return () => clearTimeout(t);
  }, [bookingId]);

  useEffect(() => {
    if (!authReady || chatBookings.length === 0 || bookingId || activeChat) return;

    const nextChatId = pickDefaultChatId(chatBookings);
    if (nextChatId) {
      // Defer to avoid synchronous setState inside effect
      const t = setTimeout(() => setActiveChat(nextChatId), 0);
      return () => clearTimeout(t);
    }
  }, [authReady, bookingId, chatBookings, activeChat]);

  useEffect(() => {
    // Defer clearing pending messages and updating unread overrides
    // to avoid calling setState synchronously inside the effect.
    const t = setTimeout(() => {
      setPendingMessages([]);
      if (activeChat) {
        setLocalUnreadOverrides((prev) => ({ ...prev, [activeChat]: 0 }));
      }
    }, 0);
    return () => clearTimeout(t);
  }, [activeChat]);

  useEffect(() => {
    if (activeChat && activeChat !== bookingId) {
      navigate(`/chat/${activeChat}`, { replace: true });
    }
  }, [activeChat, bookingId, navigate]);

  const handleSend = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!message.trim() || !activeChat || !user?._id) return;

      const socket = getSocket();
      if (!socket.connected) socket.connect();

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

      setPendingMessages((prev) => [...prev, optimisticMessage]);
      setMessage('');

      socket.emit('sendMessage', {
        data: {
          bookingId: activeChat,
          senderId: user._id,
          message: optimisticMessage.message,
        },
      });
    },
    [activeChat, message, user],
  );

  const getProviderName = (conv: Booking): string => {
    const p = conv?.service_id?.provider_id;
    if (p) return `${p.firstName} ${p.lastName}`;
    return 'Provider';
  };

  const getProviderInitials = (conv: Booking): string => {
    const p = conv?.service_id?.provider_id;
    if (p) return `${p.firstName?.[0] || ''}${p.lastName?.[0] || ''}`.toUpperCase();
    return 'P';
  };

  useEffect(() => {
    if (!authReady || !user?._id) return;

    const socket = getSocket();
    if (!socket.connected) socket.connect();

    if (activeChat) {
      socket.emit('joinRoom', activeChat, user._id);
      socket.emit('mark_read', { bookingId: activeChat, userId: user._id });
      markAsRead(activeChat);
    }

    const onReceiveMessage = (response: { success: boolean; message: ChatMessage }) => {
      if (!response.success || !response.message) return;

      dispatch(bookingApi.util.invalidateTags([{ type: 'Booking', id: 'LIST' }]));

      if (response.message.booking_id !== activeChat) {
        setLocalUnreadOverrides((prev) => {
          const next = { ...prev };
          delete next[response.message.booking_id];
          return next;
        });
        return;
      }

      setPendingMessages((prev) => {
        const tempIndex = prev.findIndex(
          (m) =>
            m._id.startsWith('temp_') &&
            m.message === response.message.message &&
            Math.abs(
              new Date(m.createdAt).getTime() - new Date(response.message.createdAt).getTime(),
            ) < 5000,
        );

        if (tempIndex !== -1) {
          const updated = [...prev];
          updated[tempIndex] = response.message;
          return updated;
        }

        if (prev.some((m) => m._id === response.message._id)) return prev;
        return [...prev, response.message];
      });

      if (response.message.receiver_id === user._id && activeChat) {
        socket.emit('mark_read', { bookingId: activeChat, userId: user._id });
        markAsRead(activeChat);
      }
    };

    const onMessagesRead = ({ bookingId: readBookingId }: { bookingId: string }) => {
      if (readBookingId === activeChat) {
        setPendingMessages((prev) => prev.map((m) => ({ ...m, isRead: true })));
        dispatch(bookingApi.util.invalidateTags([{ type: 'Booking', id: `CHAT_${activeChat}` }]));
      }
    };

    socket.on('receive_message', onReceiveMessage);
    socket.on('messages_read', onMessagesRead);

    return () => {
      socket.off('receive_message', onReceiveMessage);
      socket.off('messages_read', onMessagesRead);
    };
  }, [activeChat, authReady, dispatch, markAsRead, user?._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const showChatLoading = authReady && !!activeChat && (isLoadingMessages || isFetchingMessages) && messages.length === 0;
  const showBootstrapLoading = bootstrapping || (authReady && isLoadingBookings && chatBookings.length === 0);

  return (
    <div className="h-screen bg-[#F5F0E8]/20 font-sans text-[#0A0E1C] flex flex-col overflow-hidden">
      <Header />

      <main className="flex-1 w-full px-[24px] md:px-[32px] lg:px-[48px] pt-[90px] pb-6 flex overflow-hidden">
        <div className="w-full h-full bg-white rounded-[2rem] shadow-[0_10px_40px_rgba(10,14,28,0.06)] border border-[#1A1A2E]/5 flex overflow-hidden">
          
          {/* Sidebar */}
          <div className={`w-full md:max-w-xs lg:w-[380px] border-r border-[#1A1A2E]/5 flex flex-col bg-[#F5F0E8]/30 ${activeChat ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-6 border-b border-[#1A1A2E]/5 bg-white/50 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-[22px] font-extrabold text-[#0A0E1C] tracking-tight">Chats</h2>
                <div className="p-2.5 bg-white shadow-sm rounded-full cursor-pointer hover:bg-[#C9A84C] hover:text-white transition-all text-[#0A0E1C] border border-[#1A1A2E]/5">
                   <MoreVertical size={18} />
                </div>
              </div>
              <div className="relative group">
                <input
                  type="text"
                  value={contactSearch}
                  onChange={(e) => setContactSearch(e.target.value)}
                  placeholder="Search For Contacts or Messages"
                  className="w-full h-12 pl-12 pr-4 bg-white border border-[#1A1A2E]/10 rounded-2xl text-[14px] outline-none focus:border-[#C9A84C] focus:ring-4 focus:ring-[#C9A84C]/10 text-[#0A0E1C] placeholder-[#0A0E1C]/40 transition-all shadow-sm"
                />
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0A0E1C]/40 group-focus-within:text-[#C9A84C] transition-colors" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-4 space-y-1">
              {showBootstrapLoading ? (
                <div className="p-6 text-center text-[#0A0E1C]/50 font-medium">Loading conversations...</div>
              ) : chatBookings.length === 0 ? (
                <div className="p-6 text-center text-[#0A0E1C]/50 font-medium">No active chats available.</div>
              ) : filteredChatBookings.length === 0 ? (
                <div className="p-6 text-center text-[#0A0E1C]/50 font-medium">No results found.</div>
              ) : (
                filteredChatBookings.map((conv) => {
                  const isActive = activeChat === conv._id;
                  const overrideCount = localUnreadOverrides[conv._id];
                  const unreadCount = isActive ? 0 : (overrideCount !== undefined ? overrideCount : (conv.unreadChatCount ?? 0));
                  const preview = getLastMessagePreview(conv, user?._id, conv.service_id?.name);

                  return (
                    <div
                      key={conv._id}
                      onClick={() => setActiveChat(conv._id)}
                      className={`flex items-center gap-4 p-3.5 rounded-2xl cursor-pointer transition-all duration-300 ${
                        isActive 
                          ? 'bg-white shadow-[0_4px_20px_rgba(10,14,28,0.05)] border border-[#C9A84C]/20 scale-[1.02]' 
                          : 'hover:bg-white/60 border border-transparent hover:scale-[1.01]'
                      }`}
                    >
                      <div className="relative shrink-0">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg shadow-sm ${
                          isActive 
                            ? 'bg-[#1A1A2E] text-[#C9A84C]' 
                            : 'bg-[#F5F0E8] text-[#0A0E1C] border border-[#1A1A2E]/5'
                        }`}>
                          {getProviderInitials(conv)}
                        </div>
                        {unreadCount > 0 && (
                          <div className="absolute -top-1 -right-1 min-w-[22px] h-[22px] px-1.5 bg-[#C9A84C] text-white text-[11px] font-extrabold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                            {unreadCount > 9 ? '9+' : unreadCount}
                          </div>
                        )}
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1 gap-2">
                          <h3 className={`text-[15px] truncate ${unreadCount > 0 || isActive ? 'font-bold text-[#000000]' : 'font-semibold text-[#0A0E1C]/80'}`}>
                            {getProviderName(conv)}
                          </h3>
                          {conv.lastChatMessage?.createdAt && (
                            <span className={`text-[11px] shrink-0 ${unreadCount > 0 ? 'text-[#C9A84C] font-bold' : 'text-[#0A0E1C]/40 font-medium'}`}>
                              {new Date(conv.lastChatMessage.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          )}
                        </div>
                        <p className={`text-[13px] truncate ${unreadCount > 0 ? 'font-semibold text-[#0A0E1C]/80' : 'text-[#0A0E1C]/50 font-medium'}`}>
                          {preview}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Main Chat Area */}
          <div className={`flex-1 flex flex-col bg-white relative ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
            {activeChat ? (
              activeConv || showChatLoading ? (
                <>
                  {/* Chat Header */}
                  <div className="h-20 px-8 border-b border-[#1A1A2E]/5 bg-white/90 backdrop-blur-md flex items-center justify-between z-10 sticky top-0">
                    <div className="flex items-center gap-4">
                      <button
                        className="md:hidden p-2 -ml-2 text-[#0A0E1C]/60 hover:bg-[#F5F0E8] hover:text-[#0A0E1C] rounded-full transition-colors"
                        onClick={() => setActiveChat(null)}
                      >
                        <ArrowLeft size={24} />
                      </button>
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-[#1A1A2E] text-white flex items-center justify-center font-bold text-[16px] shadow-md shadow-[#1A1A2E]/10">
                          {activeConv ? getProviderInitials(activeConv) : '...'}
                        </div>
                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                      <div>
                        <h2 className="text-[17px] font-extrabold text-[#0A0E1C] leading-tight tracking-wide">
                          {activeConv ? getProviderName(activeConv) : 'Loading chat...'}
                        </h2>
                        {activeConv && (
                          <span className="text-[13px] text-[#0A0E1C]/50 font-semibold flex items-center gap-1.5 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            Online • {activeConv.service_id?.category}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {isSearchingMessages && (
                        <input
                          type="text"
                          placeholder="Search in chat..."
                          value={messageSearch}
                          onChange={(e) => setMessageSearch(e.target.value)}
                          autoFocus
                          className="h-10 w-48 px-4 rounded-full bg-[#F5F0E8]/50 border border-[#1A1A2E]/5 text-[13px] outline-none focus:border-[#C9A84C]/50 focus:bg-white focus:shadow-sm text-[#0A0E1C] placeholder-[#0A0E1C]/40 transition-all"
                        />
                      )}
                      <button 
                        onClick={() => {
                          setIsSearchingMessages(!isSearchingMessages);
                          if (isSearchingMessages) setMessageSearch('');
                        }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors border border-transparent hover:border-[#1A1A2E]/5 ${isSearchingMessages ? 'bg-[#F5F0E8] text-[#C9A84C]' : 'text-[#0A0E1C]/60 hover:bg-[#F5F0E8] hover:text-[#0A0E1C]'}`}
                      >
                        <Search size={18} />
                      </button>
                      <button className="w-10 h-10 rounded-full flex items-center justify-center text-[#0A0E1C]/60 hover:bg-[#F5F0E8] hover:text-[#0A0E1C] transition-colors border border-transparent hover:border-[#1A1A2E]/5">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed relative">
                    <div className="absolute inset-0 bg-white/95"></div>
                    <div className="relative z-10 space-y-6">
                      {showChatLoading ? (
                        <div className="text-center text-[#0A0E1C]/50 font-medium mt-10">Loading messages...</div>
                      ) : messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center mt-20">
                          <div className="w-24 h-24 mb-6 rounded-full bg-[#F5F0E8] flex items-center justify-center shadow-inner">
                             <MessageSquare size={40} className="text-[#C9A84C]" />
                          </div>
                          <h3 className="text-xl font-bold text-[#0A0E1C] mb-2">No messages yet</h3>
                          <p className="text-[#0A0E1C]/50 max-w-sm font-medium">Send a message to start the conversation with {activeConv ? getProviderName(activeConv) : 'this user'}.</p>
                        </div>
                      ) : isSearchingMessages && messageSearch.trim() && filteredMessages.length === 0 ? (
                        <div className="text-center text-[#0A0E1C]/50 font-medium mt-10">No messages found matching "{messageSearch}".</div>
                      ) : (
                        filteredMessages.map((msg, index) => {
                          const isMe = msg.sender_id === user?._id;
                          const showAvatar = !isMe && (index === 0 || filteredMessages[index - 1].sender_id !== msg.sender_id);
                          
                          return (
                            <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group`}>
                              {!isMe && (
                                  <div className="w-8 shrink-0 mr-3">
                                    {showAvatar && (
                                      <div className="w-8 h-8 rounded-full bg-[#F5F0E8] text-[#1A1A2E] flex items-center justify-center text-xs font-bold shadow-sm mt-1 border border-[#1A1A2E]/5">
                                        {activeConv ? getProviderInitials(activeConv) : 'U'}
                                      </div>
                                    )}
                                  </div>
                              )}
                              <div className={`max-w-[75%] lg:max-w-[65%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                <div
                                  className={`px-5 py-3.5 relative ${
                                    isMe
                                      ? 'bg-[#1A1A2E] text-white rounded-[20px] rounded-tr-[4px] shadow-[0_4px_15px_rgba(26,26,46,0.15)]'
                                      : 'bg-white text-[#0A0E1C] border border-[#1A1A2E]/10 rounded-[20px] rounded-tl-[4px] shadow-sm'
                                  }`}
                                >
                                  <p className={`text-[15px] leading-relaxed ${isMe ? 'font-normal' : 'font-medium'}`}>{msg.message}</p>
                                </div>
                                <div className={`flex items-center gap-1.5 text-[11px] mt-2 px-1 ${isMe ? 'text-[#0A0E1C]/40' : 'text-[#0A0E1C]/40'} font-medium`}>
                                  <span>
                                    {new Date(msg.createdAt).toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </span>
                                  {isMe && (
                                    <span className={msg.isRead ? 'text-[#C9A84C]' : 'text-[#0A0E1C]/30'}>
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
                  </div>

                  {/* Input Area */}
                  <div className="p-4 md:p-6 bg-white border-t border-[#1A1A2E]/5 relative z-20">
                    <form onSubmit={handleSend} className="flex items-end gap-3 max-w-4xl mx-auto">
                      <div className="flex gap-1 mb-1.5">
                        <button type="button" className="p-2.5 text-[#0A0E1C]/40 hover:text-[#C9A84C] hover:bg-[#F5F0E8] rounded-xl transition-all">
                          <Paperclip size={22} />
                        </button>
                        <button type="button" className="p-2.5 text-[#0A0E1C]/40 hover:text-[#C9A84C] hover:bg-[#F5F0E8] rounded-xl transition-all hidden sm:block">
                          <ImageIcon size={22} />
                        </button>
                      </div>

                      <div className="flex-1 relative bg-[#F5F0E8]/50 rounded-2xl border border-[#1A1A2E]/5 focus-within:border-[#C9A84C]/50 focus-within:bg-white focus-within:shadow-[0_4px_20px_rgba(201,168,76,0.08)] transition-all flex items-center">
                        <input
                          type="text"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Type your message here..."
                          className="w-full h-14 pl-5 pr-12 bg-transparent outline-none text-[15px] text-[#0A0E1C] placeholder-[#0A0E1C]/40 font-medium"
                        />
                        <button type="button" className="absolute right-4 text-[#0A0E1C]/40 hover:text-[#C9A84C] transition-colors">
                          <Smile size={22} />
                        </button>
                      </div>

                      <button
                        type="submit"
                        disabled={!message.trim()}
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                          message.trim()
                            ? 'bg-[#C9A84C] text-white shadow-[0_4px_15px_rgba(201,168,76,0.3)] hover:bg-[#b09341] hover:shadow-[0_6px_20px_rgba(201,168,76,0.4)] hover:-translate-y-1'
                            : 'bg-[#F5F0E8] text-[#0A0E1C]/20 cursor-not-allowed border border-[#1A1A2E]/5'
                        }`}
                      >
                        <Send size={22} className={message.trim() ? 'ml-1' : ''} />
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-[#0A0E1C]/50 bg-[#F5F0E8]/10 font-medium">
                  <p>Conversation not found.</p>
                </div>
              )
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center bg-white relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#F5F0E8] via-white to-white opacity-60"></div>
                
                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-28 h-28 bg-[#F5F0E8] rounded-full flex items-center justify-center mb-8 shadow-inner relative group">
                      <div className="absolute inset-0 rounded-full border border-[#C9A84C]/20 scale-[1.15] opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-700"></div>
                      <div className="absolute inset-0 rounded-full border border-[#1A1A2E]/5 scale-[1.3] opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-1000 delay-100"></div>
                      <MessageSquare size={44} className="text-[#1A1A2E]" />
                    </div>
                    
                    <div className="bg-white px-8 py-4 rounded-full border border-[#1A1A2E]/5 mb-6 shadow-[0_8px_30px_rgba(10,14,28,0.06)] flex items-center gap-3 transform hover:-translate-y-1 transition-transform cursor-default">
                        <div className="w-8 h-8 rounded-full bg-[#F5F0E8] flex items-center justify-center text-[#C9A84C]">
                             <Smile size={18} />
                        </div>
                        <h3 className="text-[20px] font-extrabold text-[#0A0E1C]">Welcome to Messages! ✨</h3>
                    </div>
                    
                    <p className="text-[#0A0E1C]/50 text-[15px] mb-10 max-w-md text-center leading-relaxed font-medium">
                        Choose a person or group from the sidebar to start a conversation, or invite someone new.
                    </p>
                    
                    <button className="px-8 py-4 bg-[#1A1A2E] text-white font-bold rounded-2xl shadow-[0_8px_25px_rgba(26,26,46,0.25)] hover:shadow-[0_12px_30px_rgba(26,26,46,0.35)] hover:bg-[#0A0E1C] hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 group">
                        <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                        <span>Invite Contacts</span>
                    </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;
