// ─── Daily Wellness Tips ───
// 31 tips — one for each day of the month, cycling automatically

export const DAILY_TIPS: string[] = [
  "Hydration is the foundation of wellness. Aim for at least 64 ounces of water today — your cells will thank you.",
  "NAD+ levels naturally decline with age. Supporting them can boost energy, focus, and cellular repair.",
  "Glutathione is your body's master antioxidant. It supports detoxification, immunity, and glowing skin.",
  "Stress doesn't just affect your mind — it raises cortisol, disrupts sleep, and accelerates aging. Prioritize rest today.",
  "Vitamin C does more than fight colds. It supports collagen production, iron absorption, and tissue repair.",
  "Your skin renews itself every 28 days. What you put into your body now shows on your face next month.",
  "Magnesium supports over 300 enzyme reactions in your body — from muscle function to mood regulation.",
  "Sleep is when your body heals. Aim for 7-9 hours tonight to support recovery and mental clarity.",
  "B-vitamins are essential for energy production. If you feel sluggish, a nutrient infusion could help.",
  "PRP therapy uses your own blood to promote healing — regenerative medicine at its most natural.",
  "Chronic dehydration can mimic fatigue, brain fog, and headaches. IV hydration delivers fluids directly to your bloodstream.",
  "Collagen production peaks in your 20s and declines after. RF microneedling stimulates your body to produce more.",
  "Your gut produces 90% of your serotonin. A healthy gut means a healthier mind.",
  "Adaptogenic herbs like Ashwagandha help your body manage stress by regulating cortisol levels naturally.",
  "Zinc plays a key role in immune function, wound healing, and protein synthesis. Are you getting enough?",
  "Movement is medicine. Even a 20-minute walk improves circulation, mood, and lymphatic drainage.",
  "NAD+ isn't just about energy — it supports DNA repair and may slow biological aging at the cellular level.",
  "Inflammation is at the root of most chronic disease. Anti-inflammatory nutrients like omega-3s and vitamin C help.",
  "Your lymphatic system has no pump — it relies on movement and hydration to flush toxins. Stay active today.",
  "Iron deficiency is one of the most common causes of fatigue and hair loss, especially in women.",
  "Platelet-rich plasma contains growth factors that accelerate your body's natural healing process.",
  "Electrolytes aren't just for athletes. Sodium, potassium, and magnesium keep your muscles and nerves functioning.",
  "UV exposure breaks down collagen faster than aging. Protect your skin — even on cloudy days.",
  "Your mitochondria are your cellular power plants. NAD+ fuels them. More NAD+ means more energy.",
  "Hair loss often signals an internal imbalance — hormones, thyroid, nutrition, or stress. Address the root cause.",
  "Recovery isn't passive. IV therapy, rest, and proper nutrition actively accelerate your body's repair process.",
  "Vitamin D deficiency affects mood, immunity, and bone health. Most people don't get enough from sunlight alone.",
  "RF microneedling works beneath the surface — stimulating collagen deep in the dermis for lasting results.",
  "Your body is designed to heal itself. Our role is to give it the tools and nutrients it needs.",
  "Consistency beats intensity. Small, regular wellness investments compound into lasting health.",
  "Every treatment at Timeless RN is nurse-administered and medically supervised. Your safety is our standard.",
];

export function getDailyTip(): string {
  const day = new Date().getDate() - 1;
  return DAILY_TIPS[day % DAILY_TIPS.length];
}
