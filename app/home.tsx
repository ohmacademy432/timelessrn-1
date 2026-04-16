import { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Linking } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Svg, { Rect, Line, Ellipse, Circle, Path } from "react-native-svg";
import { supabase } from "@/lib/supabase";
import DrawerMenu from "@/components/DrawerMenu";
import BottomNav from "@/components/BottomNav";
import { colors, fonts } from "@/lib/theme";
import { initNotifications } from "@/lib/notifications";

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

function EnergyIcon() {
  return (
    <Svg width={36} height={36} viewBox="0 0 48 48" fill="none">
      <Rect x={16} y={6} width={16} height={12} rx={3} stroke="#B8895A" strokeWidth={1.2} fill="none" />
      <Line x1={19} y1={10} x2={19} y2={16} stroke="#B8895A" strokeWidth={0.8} opacity={0.4} />
      <Line x1={24} y1={18} x2={24} y2={26} stroke="#B8895A" strokeWidth={1.2} />
      <Ellipse cx={24} cy={27} rx={3} ry={2} stroke="#B8895A" strokeWidth={1} />
      <Line x1={24} y1={29} x2={24} y2={36} stroke="#B8895A" strokeWidth={1.2} />
      <Path d="M21 36 L24 36 L24 40 L22 40" stroke="#B8895A" strokeWidth={1} strokeLinejoin="round" fill="none" />
      <Path d="M28 32 Q28 35 26 35 Q24 35 24 33 Q24 31 26 30 Z" fill="#B8895A" opacity={0.35} />
      <Path d="M24 6 Q24 3 27 3 Q30 3 30 6" stroke="#B8895A" strokeWidth={1} fill="none" />
    </Svg>
  );
}

function SkinIcon() {
  return (
    <Svg width={36} height={36} viewBox="0 0 48 48" fill="none">
      <Ellipse cx={24} cy={22} rx={11} ry={14} stroke="#B8895A" strokeWidth={1.2} fill="none" />
      <Path d="M19 18 Q20.5 16.5 22 18" stroke="#B8895A" strokeWidth={1} fill="none" strokeLinecap="round" />
      <Path d="M26 18 Q27.5 16.5 29 18" stroke="#B8895A" strokeWidth={1} fill="none" strokeLinecap="round" />
      <Path d="M24 20 L24 25 Q22.5 26.5 21.5 26 Q22.5 26 26.5 26 Q25.5 26.5 24 25" stroke="#B8895A" strokeWidth={0.9} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M20.5 29.5 Q24 31.5 27.5 29.5" stroke="#B8895A" strokeWidth={1} fill="none" strokeLinecap="round" />
      <Path d="M20.5 29.5 Q24 28 27.5 29.5" stroke="#B8895A" strokeWidth={0.8} fill="none" strokeLinecap="round" />
      <Line x1={37} y1={8} x2={37} y2={14} stroke="#B8895A" strokeWidth={0.8} opacity={0.6} />
      <Line x1={34} y1={11} x2={40} y2={11} stroke="#B8895A" strokeWidth={0.8} opacity={0.6} />
      <Line x1={35} y1={9} x2={39} y2={13} stroke="#B8895A" strokeWidth={0.6} opacity={0.4} />
      <Line x1={39} y1={9} x2={35} y2={13} stroke="#B8895A" strokeWidth={0.6} opacity={0.4} />
    </Svg>
  );
}

function HairIcon() {
  return (
    <Svg width={36} height={36} viewBox="0 0 48 48" fill="none">
      <Path d="M17 20 Q17 10 24 10 Q31 10 31 20 L31 24 Q31 28 24 28 Q17 28 17 24 Z" stroke="#B8895A" strokeWidth={1.2} fill="none" />
      <Path d="M17 18 Q12 16 11 20 Q10 26 13 30 Q15 34 17 32" stroke="#B8895A" strokeWidth={1} fill="none" strokeLinecap="round" />
      <Path d="M31 18 Q36 16 37 20 Q38 26 35 30 Q33 34 31 32" stroke="#B8895A" strokeWidth={1} fill="none" strokeLinecap="round" />
      <Path d="M24 10 Q24 8 24 6" stroke="#B8895A" strokeWidth={1} fill="none" strokeLinecap="round" />
      <Path d="M20 10 Q19 7 20 5" stroke="#B8895A" strokeWidth={0.8} fill="none" strokeLinecap="round" opacity={0.7} />
      <Path d="M28 10 Q29 7 28 5" stroke="#B8895A" strokeWidth={0.8} fill="none" strokeLinecap="round" opacity={0.7} />
      <Line x1={21} y1={28} x2={20} y2={36} stroke="#B8895A" strokeWidth={1.2} strokeLinecap="round" />
      <Line x1={27} y1={28} x2={28} y2={36} stroke="#B8895A" strokeWidth={1.2} strokeLinecap="round" />
      <Path d="M20 36 Q24 38 28 36" stroke="#B8895A" strokeWidth={1.2} fill="none" strokeLinecap="round" />
      <Circle cx={38} cy={36} r={1} fill="#B8895A" opacity={0.5} />
      <Circle cx={41} cy={32} r={0.7} fill="#B8895A" opacity={0.4} />
      <Circle cx={40} cy={38} r={0.5} fill="#B8895A" opacity={0.3} />
    </Svg>
  );
}

function JointIcon() {
  return (
    <Svg width={36} height={36} viewBox="0 0 48 48" fill="none">
      <Path d="M20 6 Q18 8 18 10 L18 20" stroke="#B8895A" strokeWidth={1.2} fill="none" strokeLinecap="round" />
      <Ellipse cx={20} cy={6} rx={3.5} ry={2.5} stroke="#B8895A" strokeWidth={1} fill="none" />
      <Path d="M20 28 L20 38 Q20 40 22 42" stroke="#B8895A" strokeWidth={1.2} fill="none" strokeLinecap="round" />
      <Ellipse cx={22} cy={42} rx={3.5} ry={2.5} stroke="#B8895A" strokeWidth={1} fill="none" />
      <Circle cx={22} cy={24} r={8} stroke="#B8895A" strokeWidth={1.2} fill="none" />
      <Path d="M15 22 Q22 20 29 22" stroke="#B8895A" strokeWidth={0.8} fill="none" opacity={0.5} />
      <Path d="M15 26 Q22 28 29 26" stroke="#B8895A" strokeWidth={0.8} fill="none" opacity={0.5} />
      <Circle cx={34} cy={14} r={1.2} fill="#B8895A" opacity={0.5} />
      <Circle cx={38} cy={18} r={0.8} fill="#B8895A" opacity={0.35} />
      <Circle cx={36} cy={10} r={0.6} fill="#B8895A" opacity={0.3} />
      <Path d="M30 17 L36 11" stroke="#B8895A" strokeWidth={0.8} strokeDasharray="1.5 1.5" opacity={0.4} />
    </Svg>
  );
}

const CONCERN_ICONS = [EnergyIcon, SkinIcon, HairIcon, JointIcon];

const CONCERNS = [
  { name: "Energy & Wellness", sub: "IV \u00b7 NAD+ \u00b7 Glutathione", cat: "IV" },
  { name: "Skin & Face", sub: "PRP \u00b7 Microneedling", cat: "PRP" },
  { name: "Hair Restoration", sub: "PRP Hair Growth", cat: "PRP" },
  { name: "Joint & Pain", sub: "PRP Joint Injection", cat: "PRP" },
];

const SERVICES = [
  { num: "01", name: "IV Hydration & Nutrient Therapy", desc: "Pharmaceutical-grade nutrients delivered directly into the bloodstream for maximum absorption and immediate results.", price: "From $150" },
  { num: "02", name: "Platelet Rich Plasma Therapy", desc: "Regenerative treatments using your own blood\u2019s growth factors for skin, hair, and joint restoration.", price: "From $249" },
  { num: "03", name: "Radio Frequency Microneedling", desc: "Advanced skin rejuvenation combining microneedling with RF energy to improve texture tone and collagen production.", price: "Book for pricing" },
  { num: "04", name: "NAD+ Infusions", desc: "Boost cellular energy cognitive function and longevity at the mitochondrial level.", price: "Book for pricing" },
];

const TIERS = [
  { name: "Essential Revive", price: "$199/month", featured: false },
  { name: "Advanced Restore", price: "$399/month", featured: true },
  { name: "Elite Renewal", price: "$699/month", featured: false },
];

const RESOURCES = [
  { title: "What is PRP?", preview: "Regenerative therapy using your own blood to promote healing and tissue repair.", content: "PRP JOINT\nPRP helps heal joints by leveraging the body\u2019s natural healing processes through concentrated platelets and their growth factors, addressing inflammation, tissue repair, and pain. While research suggests significant benefits, especially for knee osteoarthritis, the evidence is not conclusive, and controversy exists regarding its effectiveness across all conditions. Patients are encouraged to discuss with healthcare providers to determine suitability, considering both potential benefits and limitations.\n\nPRP HAIR\nComplete a physical with your Primary Care Provider. Request blood work to check for anemia (ferritin, iron level, hemoglobin), thyroid disease (TSH, Free and Total T3 and T4, reverse T3 and thyroid antibodies), vitamin deficiency (common Vit D), hormone deficiency (excessive levels of androgen hormones including testosterone, DHEA, DHT), and PCOS testing. Also check for protein deficiency or low-calorie diets and consider a scalp biopsy.\n\nChronic stress causes dysregulated cortisol levels. High cortisol levels stop the growth cycle of hair (Telogen Effluvium). Adaptogenic herbs like Ashwagandha, Rhodiola Rosea, Eleuthero, and Althene Blend put the body in rest mode creating a parasympathetic hair growth scenario.\n\nFemale pattern baldness is often due to Dihydro-testosterone. DHT blockers include Saw Palmetto, Pumpkin Seed, and Nettle Seed (NOT Nettle Leaf). For DHEA and Testosterone: Licorice lowers elevated testosterone levels. Ashwagandha decreases DHEA due to PCOS or chronic stress.\n\nPRP FACIAL\nPlatelet Rich Plasma (PRP) microneedling is an innovative skincare treatment that combines the benefits of microneedling with the healing properties of your own blood. During the procedure, a small amount of your blood is drawn and processed to extract the PRP, which is rich in growth factors. This PRP is then applied to the skin while microneedling creates tiny channels, enhancing absorption and stimulating collagen production. The result is improved skin texture, reduced fine lines, and a rejuvenated appearance." },
  { title: "Prepare for PRP", preview: "What to do and avoid before your PRP treatment for the best results.", content: "INTRODUCTION\nPlatelet-Rich Plasma (PRP) therapy is a regenerative treatment that uses a concentrated form of your own blood to promote healing and tissue repair. It involves drawing a small amount of your blood, processing it to isolate the platelets and growth factors, and injecting it into the targeted area. PRP is commonly used for musculoskeletal injuries (tendonitis, ligament sprains), hair loss, skin rejuvenation, and chronic wounds. The procedure is minimally invasive and leverages your body\u2019s natural healing mechanisms.\n\nHOW TO PREPARE\nDrink plenty of water (at least 64\u201380 ounces) in the days leading up to your appointment. Eat a balanced nutrient-rich meal or light breakfast on the day of the procedure to prevent lightheadedness. Focus on lean proteins, fruits, vegetables, whole grains, and anti-inflammatory foods like leafy greens, berries, and fatty fish.\n\nGet a good night\u2019s sleep the night before. Avoid scheduling the procedure if you have a fever, cold, flu, or active inflammation in the treatment area. Plan the treatment at least 3\u20134 weeks before any special events. If you have a history of cold sores, start prophylactic antiviral medication no later than the day of treatment.\n\nWear comfortable loose-fitting clothing that allows easy access to the treatment area. Arrive early to complete paperwork and come with clean skin for facial procedures \u2014 no makeup, lotions, or creams.\n\nWHAT TO AVOID BEFORE PRP\n\nMedications and Supplements:\nStop ibuprofen (Advil, Motrin), naproxen (Aleve), aspirin, and other NSAIDs at least 5\u201310 days before as they inhibit platelet activity and inflammation needed for healing.\n\nStop warfarin, fish oil, omega-3s, vitamin E, vitamin A, garlic, ginkgo biloba, flax oil, cod liver oil, curcumin, turmeric, aloe, and astaxanthin 1\u20132 weeks before as they increase bruising and bleeding risks. Consult your doctor before stopping prescribed blood thinners.\n\nDiscontinue oral systemic steroids 1\u20132 weeks before and steroid injections at least 1 month before.\n\nDiet and Lifestyle:\nAvoid alcohol, caffeine, spicy foods, and cigarettes for at least 3\u20137 days before as they dehydrate you, constrict blood vessels, impair healing, and increase bruising. Limit inflammatory foods like processed meats, fried items, refined carbs, and sugary snacks. Minimize sun exposure, tanning, and heat for several weeks before.\n\nWHAT TO BRING\nA complete list of all current medications, supplements, and allergies. Comfortable clothing. Snacks or water if you tend to feel lightheaded after blood draws.\n\nWHAT TO EXPECT DURING THE PROCEDURE\nPRP therapy takes 30\u201360 minutes. A small amount of blood is drawn from your arm. The blood is placed in a centrifuge for 10\u201315 minutes to separate and concentrate the platelets. The site is cleaned and a local anesthetic may be applied. The PRP is injected into the targeted area. Multiple sessions (1\u20133, spaced weeks apart) may be needed for optimal results, with improvements appearing over weeks to months." },
  { title: "Hair Loss", preview: "Understanding the causes of hair loss and how PRP can help restore growth.", content: "HEREDITARY HAIR LOSS\nThe most common cause of hair loss worldwide. In men it appears as a receding hairline or bald spot. In women it shows as overall thinning or a widening part. Treatment can help stop or slow hair loss. The earlier treatment is started the better it works.\n\nAGE\nWith age most people notice hair loss because hair growth slows. At some point hair follicles stop growing hair causing the scalp to thin. Hair also starts to lose its color. Caught early treatment helps some people regrow their hair.\n\nALOPECIA AREATA\nA disease that develops when the body\u2019s immune system attacks hair follicles causing hair loss anywhere on the body including the scalp, inside the nose, and in the ears. Some people lose their eyelashes or eyebrows. Treatment may help stimulate regrowth.\n\nCANCER TREATMENT\nChemotherapy or radiation treatment to the head or neck may cause loss of all or most hair within a few weeks. Hair usually starts to regrow within months of finishing treatment. Wearing a cooling cap before, during, and after each chemotherapy session may help prevent hair loss.\n\nCHILDBIRTH, ILLNESS, OR STRESS\nA few months after giving birth, recovering from illness, or having an operation you may notice more hairs in your brush or on your pillow. This can also happen after a stressful time such as divorce or death of a loved one. When the stress stops the body readjusts and shedding stops. Most people see their hair regain normal fullness within 6 to 9 months.\n\nHORMONAL IMBALANCE\nPolycystic ovary syndrome (PCOS) leads to cysts on a woman\u2019s ovaries and can cause hair loss. Stopping some types of birth control pills can cause a temporary hormonal imbalance. Treatment may help.\n\nTHYROID DISEASE\nThyroid problems can cause thinning hair. Treating the thyroid disease can reverse the hair loss.\n\nNUTRITIONAL DEFICIENCY\nToo little biotin, iron, protein, or zinc can cause noticeable hair loss. When your body gets enough of the missing nutrients hair can regrow.\n\nMEDICATIONS\nSome medications cause hair loss as a side effect. Do not stop taking any medication before talking with your doctor. Abruptly stopping some medications can cause serious health problems.\n\nHAIR CARE AND STYLING\nColoring, perming, or relaxing hair can cause damage leading to hair loss over time. Wearing hair tightly pulled back can lead to permanent hair loss (traction alopecia).\n\nDISCLAIMER: Timeless RN Wellness Spa does not diagnose, cure, prevent or treat disease. If you have a medical condition or concern please consult an appropriate health care professional. Information has not been evaluated by the FDA." },
  { title: "Radio Frequency Microneedling", preview: "Advanced skin rejuvenation that significantly improves wrinkling, scars, and skin laxity.", content: "Radio frequency (RF) microneedling devices use specially insulated needles that deliver high-intensity radio frequency energy into the targeted tissue under your skin.\n\nThis procedure gives a uniform warming effect to the deep tissue which helps stimulate new collagen fibers to grow \u2014 leading to significant improvement to skin quality and texture.\n\nThe result is minimal downtime (or none at all) and a procedure that can significantly improve wrinkling, scars, and skin laxity.\n\nHOW TO PREPARE\nAvoid alcohol and any nonsteroidal anti-inflammatory medication (NSAIDs) before treatment as both may contribute to bruising after the procedure. Stop using products that have salicylic acid (often found in facial cleansers) before the procedure. Inform your provider if you are currently taking or have taken any blood-thinning medication as it may increase bleeding or bruising during and following the procedure.\n\nWHAT TO EXPECT\nAfter your consultation your provider performs the procedure under topical numbing. It takes about an hour. Typically two to four treatments are recommended for best results. Side effects following RF microneedling are mild resulting in minimal downtime. For some patients there may be mild pinpoint bleeding and slight bruising. Skin is typically mildly red for around 24 hours. Most people can resume their normal routine within a day.\n\nThese treatments are not a replacement for surgery and will not achieve surgical results. Not every patient is a candidate for these procedures.\n\nRESULTS\nBest results are typically achieved after three to six months from the first treatment as your skin continues to improve as new collagen is produced. Based on your consultation your provider will recommend a treatment plan. Most patients receive two to three treatments.\n\nWHY CHOOSE US\nOur specialists have extensive experience in all areas of cosmetic procedures and can help you explore options to rejuvenate or refine your appearance and your self-confidence. When considering any facial rejuvenation procedure always look for cosmetic experts with specialized training and significant experience." },
  { title: "PRP Joint Aftercare", preview: "How to care for yourself after a PRP joint injection for the best recovery.", content: "A platelet-rich plasma (PRP) injection uses your own blood to help heal a joint such as your knee, shoulder, or elbow \u2014 often for conditions like arthritis, tendonitis, or injuries. The process involves taking a small amount of your blood, concentrating the platelets, and injecting them into the joint.\n\nWHY AFTERCARE MATTERS\nAfter a PRP injection your body needs time to heal. The injection may cause some swelling or pain at first which is normal as your body starts the healing process. Following aftercare instructions helps reduce discomfort and lowers the risk of complications. Infection occurs in less than 1 in 200 cases.\n\n1. REST AND TAKE IT EASY\nAvoid strenuous activities such as sports, heavy lifting, or intense exercise for at least 48 hours. Discomfort may last up to a week due to your body\u2019s natural healing response. Avoid overusing the joint during this time.\n\n2. PROTECT YOUR JOINT\nFor the first few days try not to put too much weight on the joint. Your provider may recommend wearing a brace or splint for a few days to protect the joint and keep the area stable.\n\n3. MANAGE PAIN AND DISCOMFORT\nExpect some soreness or discomfort for 1\u20137 days. You can take acetaminophen (Tylenol) if needed. Avoid anti-inflammatory medications like ibuprofen (Advil) or naproxen (Aleve) unless your provider approves as these can interfere with the healing process. If pain worsens or lasts longer than a week contact your provider.\n\n4. WATCH FOR SIGNS OF INFECTION\nContact your provider immediately if you notice:\n\u2022 Redness around the injection site\n\u2022 Warmth \u2014 the area feels hotter than surrounding skin\n\u2022 Drainage or pus from the site\n\u2022 Fever above 99.5\u00b0F (37.5\u00b0C)\n\u2022 Severe or worsening pain that does not improve after a few days\n\u2022 Numbness, tingling, or weakness near the injection site\n\nRECOVERY TIMELINE\nDays 1\u20132: Pain, stiffness, or swelling. Rest and avoid strenuous activity.\nFirst week: Discomfort gradually improves. Use a brace as recommended.\nWeeks to months: Full benefits may take months and can last 6 months to a year or longer depending on your condition." },
  { title: "IV Revive & Restore", preview: "Evidence-based nurse-administered IV therapies to optimize your energy, immunity, and recovery.", content: "Timeless RN IV Revive and Restore offers evidence-based nurse-administered IV therapies and wellness solutions designed to help you look, feel, and perform your best.\n\nAll treatments are administered by Registered Nurses under the guidance of Medical Director Dr. Lawrence Jackson Jr. All therapies are medically supervised with a required Medical Screening Exam conducted by our Registered Nurses and approved by our medical director. This ensures every treatment is safe, effective, and personalized.\n\nOUR IV SERVICES\n\nIV Hydration Therapy \u2014 Replenish fluids and electrolytes for hydration, recovery, and performance.\n\nNAD+ Infusions \u2014 Boost cellular energy, cognitive function, and longevity.\n\nGlutathione Therapy \u2014 Antioxidant support for detoxification, immunity, and skin health.\n\nVitamin C Infusions \u2014 Immune support, collagen formation, and anti-inflammatory benefits.\n\nCustom IV Vitamin and Supplement Blends \u2014 Tailored to your lifestyle and health goals including Myers Cocktail with B-vitamins and magnesium.\n\nWellness Add-Ons \u2014 Targeted mineral, amino acid, and nutrient support to optimize results.\n\nMEMBERSHIP TIERS \u2014 REVIVE LOUNGE\n\nEssential Revive \u2014 $199 per month x 3 months\n1 IV Hydration session, 1 Glutathione IV push or Vitamin C infusion, unlimited basic consultations. NAD+ add-on at discounted rate $200 for 250mg. Saves approximately 25% compared to a la carte pricing.\n\nAdvanced Restore \u2014 $399 per month x 3 months\n2 IV Hydration sessions, 1 Glutathione IV plus 1 Vitamin C infusion, 1 Custom vitamin supplement IV (Myers Cocktail), monthly wellness check-in with a nurse coach. NAD+ add-on $300 for 500mg. Roll over unused sessions up to 1 per month. Saves approximately 35%.\n\nElite Renewal \u2014 $699 per month x 3 months\nUnlimited IV Hydration up to 4 per month, 2 Glutathione IVs plus 2 Vitamin C infusions high dose, 1 NAD+ infusion plus 1 custom vitamin IV, priority access to add-ons, quarterly biofeedback scan, 2 guest passes per year. Saves approximately 45%." },
];

export default function HomeScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedResource, setExpandedResource] = useState<number | null>(null);

  useFocusEffect(useCallback(() => { loadData(); }, []));
  const loadData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single();
      if (profile?.full_name) setFirstName(profile.full_name.split(" ")[0]);
      initNotifications().catch(() => {});
    } catch (e) { console.log("[Home]", e); }
    setLoading(false);
  };

  if (loading) return <View style={st.loadWrap}><StatusBar style="light" /><ActivityIndicator size="large" color={colors.gold} /></View>;

  return (
    <View style={st.container}>
      <StatusBar style="light" />
      <ScrollView style={st.scroll} contentContainerStyle={st.scrollC}>

        {/* ── DARK HERO ── */}
        <View style={st.hero}>
          <View style={st.heroWarm} />
          <View style={st.heroTop}>
            <Text style={st.heroBrand}>TIMELESS RN</Text>
            <TouchableOpacity onPress={() => setMenuOpen(true)} activeOpacity={0.7} style={st.heroMenuBtn}>
              <View style={st.heroMenuL} /><View style={st.heroMenuL} /><View style={st.heroMenuL} />
            </TouchableOpacity>
          </View>
          <Text style={st.heroWelcome}>Welcome back,</Text>
          <Text style={st.heroGreet}>{getGreeting()}{firstName ? `, ${firstName}` : ""}</Text>
          <Text style={st.heroCred}>NURSE-ADMINISTERED · MD SUPERVISED · EST. 2017</Text>
        </View>

        {/* ── GOLD BOOKING BAND ── */}
        <TouchableOpacity style={st.band} onPress={() => router.push("/booking")} activeOpacity={0.85}>
          <Text style={st.bandT}>Reserve Your Treatment</Text>
          <Text style={st.bandA}>{"\u2192"}</Text>
        </TouchableOpacity>

        {/* ── CONCERN SELECTOR ── */}
        <View style={st.concernWrap}>
          <Text style={st.secLbl}>WHAT BRINGS YOU IN?</Text>
          <View style={st.concernGrid}>
            {CONCERNS.map((c, i) => {
              const Icon = CONCERN_ICONS[i];
              return (
                <TouchableOpacity key={i} style={st.concernCard} onPress={() => router.push({ pathname: "/services", params: { category: c.cat } })} activeOpacity={0.9}>
                  <View style={st.concernIconWrap}><Icon /></View>
                  <View style={{flex:1}}>
                    <Text style={st.concernName}>{c.name}</Text>
                    <Text style={st.concernSub}>{c.sub}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── FEATURED TREATMENTS ── */}
        <View style={st.svcWrap}>
          <Text style={st.secLbl}>FEATURED TREATMENTS</Text>
          {SERVICES.map((svc) => (
            <TouchableOpacity key={svc.num} style={st.svcCard} onPress={() => Linking.openURL("sms:16159702015")} activeOpacity={0.9}>
              <Text style={st.svcNum}>{svc.num}</Text>
              <Text style={st.svcName}>{svc.name}</Text>
              <Text style={st.svcDesc}>{svc.desc}</Text>
              <View style={st.svcFoot}>
                <Text style={st.svcPrice}>{svc.price}</Text>
                <Text style={st.svcLearn}>BOOK NOW {"\u2192"}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── MEMBERSHIP ── */}
        <View style={st.memberWrap}>
          <Text style={st.memberLbl}>REVIVE LOUNGE · MEMBERSHIP</Text>
          {TIERS.map((t, i) => (
            <TouchableOpacity key={i} style={st.tierRow} onPress={() => router.push("/membership")} activeOpacity={0.9}>
              <View style={{flex:1}}>
                <Text style={st.tierName}>{t.name}</Text>
                <Text style={st.tierPrice}>{t.price}</Text>
              </View>
              {t.featured ? <View style={st.tierBadge}><Text style={st.tierBadgeT}>POPULAR</Text></View> : <Text style={st.tierArrow}>{"\u2192"}</Text>}
            </TouchableOpacity>
          ))}
        </View>

        {/* ── QUOTE ── */}
        <View style={st.quoteWrap}>
          <Text style={st.quoteMark}>{"\u201C"}</Text>
          <Text style={st.quoteT}>Medical precision meets spa-level comfort. Your wellness is an experience, not a chore.</Text>
          <Text style={st.quoteAttr}>TIMELESS RN · WEST NASHVILLE · EST. 2017</Text>
        </View>

        {/* ── TESTIMONIALS ── */}
        <View style={st.testWrap}>
          <Text style={st.secLbl}>CLIENT EXPERIENCES</Text>
          <View style={st.testCard}>
            <Text style={st.testStars}>{"\u2605\u2605\u2605\u2605\u2605"}</Text>
            <Text style={st.testQuote}>The NAD+ infusion completely changed my energy levels. April and her team made me feel completely at ease.</Text>
            <Text style={st.testName}>SARAH M. · NASHVILLE</Text>
          </View>
          <View style={st.testCard}>
            <Text style={st.testStars}>{"\u2605\u2605\u2605\u2605\u2605"}</Text>
            <Text style={st.testQuote}>My PRP hair treatment has shown incredible results after just three sessions. The expertise here is unmatched.</Text>
            <Text style={st.testName}>JAMES T. · BRENTWOOD</Text>
          </View>
        </View>

        {/* ── BEFORE AFTER PLACEHOLDER ── */}
        <View style={st.baWrap}>
          <Text style={st.secLbl}>RESULTS</Text>
          <View style={st.baCard}>
            <Text style={st.baTitle}>Before & After Gallery</Text>
            <Text style={st.baSub}>COMING SOON</Text>
          </View>
        </View>

        {/* ── PATIENT RESOURCES ── */}
        <View style={st.resWrap}>
          <Text style={st.resLbl}>PATIENT RESOURCES</Text>
          {RESOURCES.map((r, idx) => {
            const open = expandedResource === idx;
            return (
              <TouchableOpacity key={idx} style={st.resCard} onPress={() => setExpandedResource(open ? null : idx)} activeOpacity={0.9}>
                <View style={st.resHead}>
                  <Text style={st.resTitle}>{r.title}</Text>
                  <Text style={st.resChev}>{open ? "\u25BC" : "\u25B6"}</Text>
                </View>
                {!open && <Text style={st.resPrev}>{r.preview}</Text>}
                {open && <View>
                  <Text style={st.resCont}>{r.content}</Text>
                  <TouchableOpacity style={st.resBookBtn} onPress={() => Linking.openURL("sms:16159702015")} activeOpacity={0.85}>
                    <Text style={st.resBookT}>BOOK NOW</Text>
                  </TouchableOpacity>
                </View>}
              </TouchableOpacity>
            );
          })}
        </View>

      </ScrollView>
      <BottomNav active="home" onMenuPress={() => setMenuOpen(true)} />
      <DrawerMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </View>
  );
}

const st = StyleSheet.create({
  container:{flex:1,backgroundColor:colors.cream},
  loadWrap:{flex:1,backgroundColor:colors.ink,justifyContent:"center",alignItems:"center"},
  scroll:{flex:1},scrollC:{paddingBottom:20},

  // Hero
  hero:{backgroundColor:colors.warmDark,paddingTop:56,paddingBottom:28,paddingHorizontal:18},
  heroWarm:{...StyleSheet.absoluteFillObject,backgroundColor:"rgba(184,137,90,0.08)"},
  heroTop:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginBottom:16},
  heroBrand:{fontFamily:fonts.serifLight,fontSize:34,color:colors.creamText,letterSpacing:3,textTransform:"uppercase",flexShrink:1,lineHeight:46},
  heroMenuBtn:{padding:6},heroMenuL:{width:20,height:1.5,backgroundColor:colors.gold,marginVertical:2.5,borderRadius:1},
  heroWelcome:{fontFamily:fonts.serifLightItalic,fontSize:20,color:colors.gold,marginBottom:4,lineHeight:28,textShadowColor:"rgba(255,255,255,0.6)",textShadowOffset:{width:0,height:0},textShadowRadius:2},
  heroGreet:{fontFamily:fonts.serifLight,fontSize:26,color:colors.creamText,letterSpacing:1,marginBottom:10,lineHeight:34},
  heroCred:{fontFamily:fonts.sansLight,fontSize:14,letterSpacing:3,color:colors.gold,textTransform:"uppercase",lineHeight:20,textShadowColor:"rgba(255,255,255,0.6)",textShadowOffset:{width:0,height:0},textShadowRadius:2},

  // Band
  band:{backgroundColor:colors.gold,flexDirection:"row",justifyContent:"space-between",alignItems:"center",paddingVertical:16,paddingHorizontal:20},
  bandT:{fontFamily:fonts.serifLightItalic,fontSize:26,color:colors.ink,lineHeight:34,flexShrink:1},bandA:{fontSize:32,color:colors.ink,marginLeft:12},

  // Concerns
  concernWrap:{backgroundColor:colors.cream,paddingHorizontal:20,paddingTop:24,paddingBottom:14},
  secLbl:{fontFamily:fonts.sans,fontSize:14,letterSpacing:4,color:colors.textMuted,textTransform:"uppercase",marginBottom:14,lineHeight:20},
  concernGrid:{flexDirection:"row",flexWrap:"wrap",gap:8},
  concernCard:{width:"48%",backgroundColor:colors.white,borderWidth:1,borderColor:"rgba(184,137,90,0.15)",borderRadius:8,padding:14,flexDirection:"row",alignItems:"center",gap:10},
  concernIconWrap:{width:36,height:36,justifyContent:"center",alignItems:"center"},concernName:{fontFamily:fonts.serifLight,fontSize:20,color:colors.text,lineHeight:26,flexShrink:1},
  concernSub:{fontFamily:fonts.sansLight,fontSize:14,color:colors.textMuted,lineHeight:20,marginTop:2,flexShrink:1},

  // Services
  svcWrap:{backgroundColor:colors.cream,paddingHorizontal:20,paddingTop:8,paddingBottom:14},
  svcCard:{backgroundColor:colors.white,padding:16,paddingHorizontal:20,paddingBottom:16,marginBottom:14,borderBottomWidth:1,borderBottomColor:"rgba(237,227,210,0.6)"},
  svcNum:{fontFamily:fonts.serifLight,fontSize:18,color:"rgba(184,137,90,0.4)",letterSpacing:2,marginBottom:6,lineHeight:24},
  svcName:{fontFamily:fonts.serifLight,fontSize:26,color:colors.text,lineHeight:34,marginBottom:6},
  svcDesc:{fontFamily:fonts.sansLight,fontSize:16,color:colors.textMuted,lineHeight:26,marginBottom:14},
  svcFoot:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8},
  svcPrice:{fontFamily:fonts.serifLight,fontSize:22,color:colors.gold,lineHeight:30},
  svcLearn:{fontFamily:fonts.sans,fontSize:14,letterSpacing:2,color:colors.textMuted,textTransform:"uppercase",lineHeight:20},

  // Membership
  memberWrap:{backgroundColor:colors.warmDark,paddingHorizontal:20,paddingTop:24,paddingBottom:18},
  memberLbl:{fontFamily:fonts.sans,fontSize:14,letterSpacing:4,color:"rgba(184,137,90,0.5)",textTransform:"uppercase",marginBottom:14,lineHeight:20},
  tierRow:{flexDirection:"row",alignItems:"center",borderWidth:1,borderColor:"rgba(184,137,90,0.2)",borderRadius:8,paddingVertical:16,paddingHorizontal:16,marginBottom:10,backgroundColor:colors.warmDark,gap:10},
  tierName:{fontFamily:fonts.serifLight,fontSize:26,color:colors.creamText,lineHeight:34},
  tierPrice:{fontFamily:fonts.sansLight,fontSize:16,color:colors.gold,letterSpacing:1,lineHeight:22,marginTop:2},
  tierArrow:{fontSize:28,color:"rgba(184,137,90,0.4)",lineHeight:34},
  tierBadge:{backgroundColor:colors.gold,paddingHorizontal:10,paddingVertical:5,borderRadius:10},
  tierBadgeT:{fontFamily:fonts.sansMedium,fontSize:14,letterSpacing:2,color:colors.ink,textTransform:"uppercase",lineHeight:18},

  // Quote
  quoteWrap:{backgroundColor:colors.ink,padding:24},
  quoteMark:{fontFamily:fonts.serif,fontSize:56,color:colors.gold,opacity:0.4,lineHeight:64},
  quoteT:{fontFamily:fonts.serifLightItalic,fontSize:22,color:"rgba(245,239,228,0.65)",lineHeight:34,marginBottom:16},
  quoteAttr:{fontFamily:fonts.sans,fontSize:14,letterSpacing:2,color:"rgba(184,137,90,0.45)",textTransform:"uppercase",lineHeight:20},

  // Testimonials
  testWrap:{backgroundColor:colors.creamDark,paddingHorizontal:20,paddingTop:24,paddingBottom:18},
  testCard:{backgroundColor:colors.white,borderLeftWidth:3,borderLeftColor:colors.gold,padding:16,paddingHorizontal:18,marginBottom:12,borderRadius:4},
  testStars:{fontSize:18,color:colors.gold,letterSpacing:2,marginBottom:8,lineHeight:24},
  testQuote:{fontFamily:fonts.serifLightItalic,fontSize:20,color:colors.text,lineHeight:32,marginBottom:10},
  testName:{fontFamily:fonts.sans,fontSize:14,letterSpacing:2,color:colors.textMuted,textTransform:"uppercase",lineHeight:20},

  // Before After
  baWrap:{backgroundColor:colors.cream,paddingHorizontal:20,paddingTop:24,paddingBottom:18},
  baCard:{backgroundColor:colors.white,borderWidth:1,borderColor:"rgba(184,137,90,0.25)",borderStyle:"dashed",borderRadius:8,padding:24,alignItems:"center"},
  baTitle:{fontFamily:fonts.serifLightItalic,fontSize:24,color:colors.textMuted,marginBottom:8,lineHeight:32},
  baSub:{fontFamily:fonts.sans,fontSize:14,letterSpacing:2,color:"rgba(184,137,90,0.35)",textTransform:"uppercase",lineHeight:20},

  // Resources
  resWrap:{paddingHorizontal:20,paddingTop:24,paddingBottom:14},
  resLbl:{fontFamily:fonts.sans,fontSize:14,letterSpacing:4,color:colors.gold,textTransform:"uppercase",marginBottom:14,lineHeight:20},
  resCard:{backgroundColor:colors.warmDark,borderWidth:1,borderColor:"rgba(184,137,90,0.2)",borderLeftWidth:3,borderLeftColor:colors.gold,borderRadius:10,padding:18,marginBottom:12},
  resHead:{flexDirection:"row",justifyContent:"space-between",alignItems:"center"},
  resTitle:{fontFamily:fonts.serifLight,fontSize:24,color:colors.creamText,flex:1,marginRight:12,lineHeight:32},
  resChev:{fontSize:20,color:colors.gold,lineHeight:28},
  resPrev:{fontFamily:fonts.serifLightItalic,fontSize:19,color:"rgba(245,239,228,0.8)",marginTop:8,lineHeight:30},
  resCont:{fontFamily:fonts.serifLightItalic,fontSize:19,color:"rgba(245,239,228,0.6)",lineHeight:30,marginTop:12},
  resBookBtn:{borderWidth:1,borderColor:colors.gold,backgroundColor:"transparent",borderRadius:4,paddingVertical:12,alignItems:"center",marginTop:16},
  resBookT:{fontFamily:fonts.sansMedium,fontSize:16,letterSpacing:4,color:colors.gold,textTransform:"uppercase",lineHeight:22},
});
