/** Shared mock notifications (frontend-only) for header dropdown & notifications page. */

export type PreviewNotification = {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
};

export const allNotifications: PreviewNotification[] = [
  {
    id: "n1",
    title: "New booking request",
    body: "Jordan M. requested Home cleaning — Sat 10:00 AM.",
    time: "2 min ago",
    read: false,
  },
  {
    id: "n2",
    title: "Booking confirmed",
    body: "Maria L. confirmed Electrical repair for next Tuesday.",
    time: "1 hr ago",
    read: false,
  },
  {
    id: "n3",
    title: "Review received",
    body: "You received a 5★ review from Alex P.",
    time: "3 hrs ago",
    read: true,
  },
  {
    id: "n4",
    title: "Payout processed",
    body: "$240.00 was sent to your linked account.",
    time: "Yesterday",
    read: true,
  },
  {
    id: "n5",
    title: "Reminder",
    body: "Complete your tax profile before month end.",
    time: "Yesterday",
    read: true,
  },
  {
    id: "n6",
    title: "Message from client",
    body: "Sam K.: “Can we move the appointment to 3 PM?”",
    time: "2 days ago",
    read: true,
  },
];

export const latestNotificationPreviews = allNotifications.slice(0, 5);
