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
  const [isChatOptionsOpen, setIsChatOptionsOpen] = useState(false);

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
    const t = setTimeout(() => {
      setActiveChat((prev) => (prev !== bookingId ? bookingId : prev));
    }, 0);
    return () => clearTimeout(t);
  }, [bookingId]);

  useEffect(() => {
    if (!authReady || chatBookings.length === 0 || bookingId || activeChat) return;
    const nextChatId = pickDefaultChatId(chatBookings);
    if (nextChatId) {
      const t = setTimeout(() => setActiveChat(nextChatId), 0);
      return () => clearTimeout(t);
    }
  }, [authReady, bookingId, chatBookings, activeChat]);

  useEffect(() => {
    const t = setTimeout(() => {
      setPendingMessages([]);
      setIsChatOptionsOpen(false);
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

  /* ─── helpers ─── */
  const totalUnread = chatBookings.reduce((acc, b) => {
    const override = localUnreadOverrides[b._id];
    const count = b._id === activeChat ? 0 : (override !== undefined ? override : (b.unreadChatCount ?? 0));
    return acc + count;
  }, 0);

  return (
    <div className="h-screen bg-[#F5F0E8]/30 font-sans text-[#0A0E1C] flex flex-col overflow-hidden">
      <Header />

      <main className="flex-1 w-full px-4 md:px-8 lg:px-12 pt-[90px] pb-5 flex overflow-hidden">
        <div className="w-full h-full bg-white rounded-[1.5rem] shadow-[0_8px_32px_rgba(10,14,28,0.08)] border border-[#1A1A2E]/6 flex overflow-hidden">

          {/* ── Sidebar ── */}
          <div className={`w-full md:max-w-[300px] lg:w-[320px] border-r border-[#1A1A2E]/6 flex flex-col bg-white ${activeChat ? 'hidden md:flex' : 'flex'}`}>

            {/* Sidebar header */}
            <div className="px-5 pt-5 pb-4 border-b border-[#1A1A2E]/6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-[20px] font-bold text-[#0A0E1C] tracking-tight">Messages</h2>
                  {totalUnread > 0 && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FAC775] text-[#633806]">
                      {totalUnread} new
                    </span>
                  )}
                </div>
                <button className="w-8 h-8 flex items-center justify-center rounded-xl border border-[#1A1A2E]/8 bg-[#F5F0E8]/60 text-[#0A0E1C]/50 hover:text-[#0A0E1C] hover:bg-[#F5F0E8] transition-all">
                  <MoreVertical size={15} />
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={contactSearch}
                  onChange={(e) => setContactSearch(e.target.value)}
                  placeholder="Search contacts..."
                  className="w-full h-10 pl-10 pr-4 bg-[#F5F0E8]/60 border border-[#1A1A2E]/8 rounded-xl text-[13px] outline-none focus:border-[#C9A84C]/60 focus:bg-white transition-all text-[#0A0E1C] placeholder-[#0A0E1C]/35"
                />
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0A0E1C]/35" />
              </div>
            </div>

            {/* Contact list */}
            <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-0.5">
              {showBootstrapLoading ? (
                <p className="p-5 text-center text-[13px] text-[#0A0E1C]/40 font-medium">Loading conversations...</p>
              ) : chatBookings.length === 0 ? (
                <p className="p-5 text-center text-[13px] text-[#0A0E1C]/40 font-medium">No active chats.</p>
              ) : filteredChatBookings.length === 0 ? (
                <p className="p-5 text-center text-[13px] text-[#0A0E1C]/40 font-medium">No results found.</p>
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
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                        isActive
                          ? 'bg-[#FAEEDA] border border-[#FAC775]/60'
                          : 'hover:bg-[#F5F0E8]/60 border border-transparent'
                      }`}
                    >
                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <div className={`w-11 h-11 rounded-full flex items-center justify-center text-[13px] font-bold ${
                          isActive
                            ? 'bg-[#1A1A2E] text-[#C9A84C]'
                            : 'bg-[#F5F0E8] text-[#0A0E1C] border border-[#1A1A2E]/8'
                        }`}>
                          {getProviderInitials(conv)}
                        </div>
                        {unreadCount > 0 && (
                          <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#BA7517] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                            {unreadCount > 9 ? '9+' : unreadCount}
                          </div>
                        )}
                        <div className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center gap-1 mb-0.5">
                          <h3 className={`text-[14px] truncate ${unreadCount > 0 ? 'font-bold text-[#0A0E1C]' : 'font-semibold text-[#0A0E1C]/80'}`}>
                            {getProviderName(conv)}
                          </h3>
                          {conv.lastChatMessage?.createdAt && (
                            <span className={`text-[11px] shrink-0 ${unreadCount > 0 ? 'text-[#BA7517] font-bold' : 'text-[#0A0E1C]/35 font-medium'}`}>
                              {new Date(conv.lastChatMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                        </div>
                        <p className={`text-[12px] truncate ${unreadCount > 0 ? 'font-semibold text-[#0A0E1C]/70' : 'text-[#0A0E1C]/40 font-medium'}`}>
                          {preview}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* ── Main Chat Area ── */}
          <div className={`flex-1 flex flex-col bg-white relative ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
            {activeChat ? (
              activeConv || showChatLoading ? (
                <>
                  {/* Chat Header */}
                  <div className="h-[64px] px-6 border-b border-[#1A1A2E]/6 bg-white flex items-center justify-between z-10 sticky top-0">
                    <div className="flex items-center gap-3">
                      <button
                        className="md:hidden p-1.5 -ml-1.5 text-[#0A0E1C]/50 hover:bg-[#F5F0E8] hover:text-[#0A0E1C] rounded-lg transition-colors"
                        onClick={() => setActiveChat(null)}
                      >
                        <ArrowLeft size={20} />
                      </button>
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-[#1A1A2E] text-[#C9A84C] flex items-center justify-center font-bold text-[13px]">
                          {activeConv ? getProviderInitials(activeConv) : '…'}
                        </div>
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-[15px] font-bold text-[#0A0E1C] leading-tight">
                            {activeConv ? getProviderName(activeConv) : 'Loading…'}
                          </h2>
                          {activeConv?.service_id?.category && (
                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#F5F0E8] text-[#0A0E1C]/50 border border-[#1A1A2E]/8">
                              {activeConv.service_id.category}
                            </span>
                          )}
                        </div>
                        {activeConv && (
                          <span className="text-[12px] text-[#0A0E1C]/45 font-medium flex items-center gap-1.5 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block"></span>
                            Online now
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isSearchingMessages && (
                        <input
                          type="text"
                          placeholder="Search in chat…"
                          value={messageSearch}
                          onChange={(e) => setMessageSearch(e.target.value)}
                          autoFocus
                          className="h-9 w-44 px-4 rounded-full bg-[#F5F0E8]/60 border border-[#1A1A2E]/8 text-[13px] outline-none focus:border-[#C9A84C]/50 focus:bg-white text-[#0A0E1C] placeholder-[#0A0E1C]/35 transition-all"
                        />
                      )}
                      <button
                        onClick={() => { setIsSearchingMessages(!isSearchingMessages); if (isSearchingMessages) setMessageSearch(''); }}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors border ${
                          isSearchingMessages
                            ? 'bg-[#FAEEDA] border-[#FAC775]/60 text-[#BA7517]'
                            : 'border-[#1A1A2E]/8 text-[#0A0E1C]/45 hover:bg-[#F5F0E8] hover:text-[#0A0E1C]'
                        }`}
                      >
                        <Search size={16} />
                      </button>
                      <div className="relative">
                        <button 
                          onClick={() => setIsChatOptionsOpen(!isChatOptionsOpen)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors border border-transparent hover:border-[#1A1A2E]/5 ${isChatOptionsOpen ? 'bg-[#F5F0E8] text-[#0A0E1C]' : 'text-[#0A0E1C]/60 hover:bg-[#F5F0E8] hover:text-[#0A0E1C]'}`}
                        >
                          <MoreVertical size={18} />
                        </button>
                        
                        {isChatOptionsOpen && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setIsChatOptionsOpen(false)}></div>
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-[0_10px_40px_rgba(10,14,28,0.08)] border border-[#1A1A2E]/5 py-2 z-50">
                              <button 
                                onClick={() => {
                                  setActiveChat(null);
                                  setIsChatOptionsOpen(false);
                                }}
                                className="w-full text-left px-4 py-2.5 text-[14px] font-semibold text-[#ef4444] hover:bg-[#ef4444]/5 transition-colors"
                              >
                                Close Chat
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 bg-[#F5F0E8]/20">
                    {showChatLoading ? (
                      <p className="text-center text-[13px] text-[#0A0E1C]/40 font-medium mt-10">Loading messages…</p>
                    ) : messages.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center mt-16">
                        <div className="w-20 h-20 mb-5 rounded-full bg-white border border-[#1A1A2E]/8 flex items-center justify-center shadow-sm">
                          <MessageSquare size={32} className="text-[#C9A84C]" />
                        </div>
                        <h3 className="text-[17px] font-bold text-[#0A0E1C] mb-1.5">No messages yet</h3>
                        <p className="text-[13px] text-[#0A0E1C]/45 max-w-xs font-medium">
                          Send a message to start the conversation with {activeConv ? getProviderName(activeConv) : 'this provider'}.
                        </p>
                      </div>
                    ) : isSearchingMessages && messageSearch.trim() && filteredMessages.length === 0 ? (
                      <p className="text-center text-[13px] text-[#0A0E1C]/40 font-medium mt-10">
                        No messages found for "{messageSearch}".
                      </p>
                    ) : (
                      filteredMessages.map((msg, index) => {
                        const isMe = msg.sender_id === user?._id;
                        const showAvatar = !isMe && (index === 0 || filteredMessages[index - 1].sender_id !== msg.sender_id);
                        const isLastInGroup = index === filteredMessages.length - 1 || filteredMessages[index + 1].sender_id !== msg.sender_id;

                        return (
                          <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                            {/* Other-user avatar */}
                            {!isMe && (
                              <div className="w-7 shrink-0">
                                {showAvatar || isLastInGroup ? (
                                  <div className="w-7 h-7 rounded-full bg-[#F5F0E8] text-[#1A1A2E] border border-[#1A1A2E]/8 flex items-center justify-center text-[11px] font-bold">
                                    {activeConv ? getProviderInitials(activeConv) : 'U'}
                                  </div>
                                ) : null}
                              </div>
                            )}

                            <div className={`max-w-[68%] lg:max-w-[60%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                              <div
                                className={`px-4 py-2.5 ${
                                  isMe
                                    ? 'bg-[#1A1A2E] text-[#FAC775] rounded-[18px] rounded-tr-[4px]'
                                    : 'bg-white text-[#0A0E1C] border border-[#1A1A2E]/8 rounded-[18px] rounded-tl-[4px]'
                                }`}
                              >
                                <p className="text-[14px] leading-relaxed font-normal">{msg.message}</p>
                              </div>
                              <div className={`flex items-center gap-1 text-[11px] mt-1 px-0.5 text-[#0A0E1C]/35 font-medium`}>
                                <span>
                                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                {isMe && (
                                  <span className={`text-[12px] ${msg.isRead ? 'text-[#C9A84C]' : 'text-[#0A0E1C]/25'}`}>
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
                  <div className="px-5 py-4 bg-white border-t border-[#1A1A2E]/6">
                    <form onSubmit={handleSend} className="flex items-center gap-2.5 max-w-4xl mx-auto">
                      {/* Attach */}
                      <button
                        type="button"
                        className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl border border-[#1A1A2E]/8 bg-[#F5F0E8]/60 text-[#0A0E1C]/45 hover:text-[#C9A84C] hover:border-[#FAC775]/60 hover:bg-[#FAEEDA] transition-all"
                      >
                        <Paperclip size={18} />
                      </button>
                      <button
                        type="button"
                        className="w-10 h-10 shrink-0 hidden sm:flex items-center justify-center rounded-xl border border-[#1A1A2E]/8 bg-[#F5F0E8]/60 text-[#0A0E1C]/45 hover:text-[#C9A84C] hover:border-[#FAC775]/60 hover:bg-[#FAEEDA] transition-all"
                      >
                        <ImageIcon size={18} />
                      </button>

                      {/* Input */}
                      <div className="flex-1 flex items-center h-11 px-4 bg-[#F5F0E8]/50 border border-[#1A1A2E]/8 rounded-full focus-within:border-[#C9A84C]/60 focus-within:bg-white transition-all">
                        <input
                          type="text"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Type a message…"
                          className="flex-1 bg-transparent outline-none text-[14px] text-[#0A0E1C] placeholder-[#0A0E1C]/35 font-medium"
                        />
                        <button type="button" className="ml-2 text-[#0A0E1C]/35 hover:text-[#C9A84C] transition-colors">
                          <Smile size={20} />
                        </button>
                      </div>

                      {/* Send */}
                      <button
                        type="submit"
                        disabled={!message.trim()}
                        className={`w-11 h-11 shrink-0 rounded-full flex items-center justify-center transition-all duration-200 ${
                          message.trim()
                            ? 'bg-[#1A1A2E] text-[#C9A84C] hover:bg-[#0A0E1C] hover:scale-105 shadow-[0_4px_12px_rgba(26,26,46,0.2)]'
                            : 'bg-[#F5F0E8] text-[#0A0E1C]/20 cursor-not-allowed border border-[#1A1A2E]/6'
                        }`}
                      >
                        <Send size={18} className={message.trim() ? 'ml-0.5' : ''} />
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-[13px] text-[#0A0E1C]/40 font-medium">
                  Conversation not found.
                </div>
              )
            ) : (
              /* Empty state */
              <div className="flex-1 flex flex-col items-center justify-center bg-white">
                <div className="w-24 h-24 bg-[#F5F0E8] rounded-full flex items-center justify-center mb-6 border border-[#1A1A2E]/6">
                  <MessageSquare size={38} className="text-[#1A1A2E]" />
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-[20px] font-bold text-[#0A0E1C]">Welcome to Messages</h3>
                  <span className="text-[20px]">✨</span>
                </div>
                <p className="text-[14px] text-[#0A0E1C]/45 max-w-sm text-center leading-relaxed font-medium mb-8">
                  Choose a conversation from the sidebar to get started.
                </p>
                <button className="flex items-center gap-2 px-6 py-3 bg-[#1A1A2E] text-white font-bold text-[14px] rounded-xl shadow-[0_4px_16px_rgba(26,26,46,0.2)] hover:bg-[#0A0E1C] hover:-translate-y-0.5 transition-all duration-200">
                  <Send size={16} />
                  <span>Invite Contacts</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default Chat;