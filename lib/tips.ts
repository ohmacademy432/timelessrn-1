// ─── Daily Wellness Tips ───
// Index 0 = Sunday … 6 = Saturday

export const DAILY_TIPS: string[] = [
  // Sunday
  "Prepare your body for the week ahead. A hydration session sets the foundation.",
  // Monday
  "Start your week strong. Hydration is the foundation of everything. Book your next IV session.",
  // Tuesday
  "Your cells are working hard. Support them with NAD+ therapy. Book today.",
  // Wednesday
  "Midweek reset. How is your energy? A vitamin infusion could be exactly what you need.",
  // Thursday
  "Glutathione — your body's master antioxidant. Replenish it. Book a session this week.",
  // Friday
  "Finish the week feeling your best. Book a recovery IV before the weekend.",
  // Saturday
  "Weekend wellness. Our spa is open and ready for you. Book now.",
];

export function getDailyTip(): string {
  const day = new Date().getDay();
  return DAILY_TIPS[day] ?? DAILY_TIPS[0];
}
