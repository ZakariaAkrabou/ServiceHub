import type { Booking } from "../app/api/BookingApi";

export function sortChatBookings(bookings: Booking[]): Booking[] {
  return [...bookings].sort((a, b) => {
    const unreadDiff = (b.unreadChatCount ?? 0) - (a.unreadChatCount ?? 0);
    if (unreadDiff !== 0) return unreadDiff;

    const aTime = a.lastChatMessage?.createdAt ?? a.updatedAt;
    const bTime = b.lastChatMessage?.createdAt ?? b.updatedAt;
    return new Date(bTime).getTime() - new Date(aTime).getTime();
  });
}

export function getLastMessagePreview(
  conv: Booking,
  currentUserId?: string,
  fallback?: string,
): string {
  const msg = conv.lastChatMessage;
  if (!msg?.message) return fallback ?? "No messages yet";

  const prefix = currentUserId && msg.sender_id === currentUserId ? "You: " : "";
  return `${prefix}${msg.message}`;
}

export function pickDefaultChatId(
  bookings: Booking[],
  preferredId?: string | null,
): string | null {
  if (bookings.length === 0) return null;

  if (preferredId && bookings.some((b) => b._id === preferredId)) {
    return preferredId;
  }

  const withUnread = bookings.find((b) => (b.unreadChatCount ?? 0) > 0);
  return withUnread?._id ?? bookings[0]._id;
}
