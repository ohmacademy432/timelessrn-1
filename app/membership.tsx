import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import DrawerMenu from "@/components/DrawerMenu";
import BottomNav from "@/components/BottomNav";
import { colors, fonts } from "@/lib/theme";

type Tier={id:string;name:string;price:string;term:string;savings:string;tagline:string;features:string[];addon:string;featured?:boolean};
const TIERS:Tier[]=[
  {id:"essential",name:"Essential Revive",price:"$199",term:"/month \u00d7 3 months",savings:"Saves ~25%",tagline:"Ideal for beginners focused on hydration and antioxidant support",features:["1 IV Hydration session","1 Glutathione IV push or Vitamin C infusion","Unlimited basic consultations"],addon:"NAD+ add-on at discounted rate ($200 for 250mg)"},
  {id:"advanced",name:"Advanced Restore",price:"$399",term:"/month \u00d7 3 months",savings:"Saves ~35%",tagline:"For those ready to take their wellness deeper",features:["2 IV Hydration sessions","1 Glutathione IV + 1 Vitamin C infusion","1 Custom vitamin / supplement IV (Myers Cocktail)","Monthly wellness check-in with nurse coach","Roll over unused sessions up to 1 per month"],addon:"NAD+ add-on $300 for 500mg",featured:true},
  {id:"elite",name:"Elite Renewal",price:"$699",term:"/month \u00d7 3 months",savings:"Saves ~45%",tagline:"Our highest tier of care \u2014 concierge wellness",features:["Unlimited IV Hydration (up to 4/month)","2 Glutathione IVs + 2 Vitamin C infusions (high dose)","1 NAD+ infusion + 1 custom vitamin IV","Priority access to add-ons","Quarterly biofeedback scan","2 Guest passes per year"],addon:"All premium add-ons included at member rate"},
];

export default function MembershipScreen(){
  const router=useRouter();const[menuOpen,setMenuOpen]=useState(false);
  return(
    <View style={s.container}><StatusBar style="light"/>
      <View style={s.header}>
        <TouchableOpacity style={s.back} onPress={()=>router.back()}><Text style={s.backT}>{"\u2039"}</Text></TouchableOpacity>
        <TouchableOpacity style={s.menuBtn} onPress={()=>setMenuOpen(true)}><View style={s.menuL}/><View style={s.menuL}/><View style={s.menuL}/></TouchableOpacity>
        <Text style={s.headerT}>Revive Lounge</Text><Text style={s.headerS}>Membership Tiers</Text>
      </View>
      <ScrollView style={s.body} contentContainerStyle={s.bodyC}>
        <Text style={s.intro}>Three tiers of ongoing care. Each membership is a 3-month commitment with meaningful savings.</Text>
        {TIERS.map(t=>(
          <View key={t.id} style={[s.card,t.featured&&s.cardF]}>
            {t.featured&&<View style={s.badge}><Text style={s.badgeT}>MOST POPULAR</Text></View>}
            <Text style={s.tierName}>{t.name}</Text><Text style={s.tierTag}>{t.tagline}</Text>
            <View style={s.priceRow}><Text style={s.tierPrice}>{t.price}</Text><Text style={s.tierTerm}>{t.term}</Text></View>
            <Text style={s.tierSave}>{t.savings}</Text><View style={s.div}/>
            {t.features.map((f,i)=><View key={i} style={s.featRow}><Text style={s.featDot}>{"\u2022"}</Text><Text style={s.featT}>{f}</Text></View>)}
            <View style={s.addonBox}><Text style={s.addonT}>{t.addon}</Text></View>
            <TouchableOpacity style={[s.selBtn,t.featured&&s.selBtnF]} onPress={()=>router.push("/booking")} activeOpacity={0.85}>
              <Text style={[s.selBtnT,t.featured&&s.selBtnTF]}>SELECT PLAN</Text>
            </TouchableOpacity>
          </View>))}
        <Text style={s.footer}>All memberships require an initial nurse consultation. Pricing is billed monthly for 3 months.</Text>
      </ScrollView>
      <BottomNav onMenuPress={()=>setMenuOpen(true)}/><DrawerMenu isOpen={menuOpen} onClose={()=>setMenuOpen(false)}/>
    </View>);
}
const s=StyleSheet.create({
  container:{flex:1,backgroundColor:colors.cream},
  header:{backgroundColor:colors.warmDark,paddingTop:56,paddingBottom:24,paddingHorizontal:64,alignItems:"center"},
  back:{position:"absolute",top:56,left:20,zIndex:10,padding:8},backT:{fontSize:49,color:colors.gold,lineHeight:52},
  menuBtn:{position:"absolute",top:58,right:24,zIndex:10,padding:6},menuL:{width:20,height:1.5,backgroundColor:colors.gold,marginVertical:2.5,borderRadius:1},
  headerT:{fontFamily:fonts.serifLight,fontSize:40,color:colors.creamText,letterSpacing:2,marginBottom:6,lineHeight:48,textAlign:"center"},
  headerS:{fontFamily:fonts.serifLightItalic,fontSize:20,color:colors.gold,letterSpacing:2,lineHeight:26,textAlign:"center"},
  body:{flex:1},bodyC:{padding:20,paddingBottom:40},
  intro:{fontFamily:fonts.serifLightItalic,fontSize:20,color:colors.textMuted,textAlign:"center",lineHeight:32,marginBottom:24},
  card:{backgroundColor:colors.white,borderRadius:8,padding:22,marginBottom:20,borderWidth:1,borderColor:"rgba(237,227,210,0.5)"},
  cardF:{borderColor:colors.gold},
  badge:{position:"absolute",top:-12,right:16,backgroundColor:colors.gold,paddingHorizontal:12,paddingVertical:5,borderRadius:10},
  badgeT:{fontFamily:fonts.sansMedium,fontSize:14,color:colors.ink,letterSpacing:2,textTransform:"uppercase",lineHeight:18},
  tierName:{fontFamily:fonts.serifLight,fontSize:34,color:colors.text,marginBottom:4,lineHeight:42},
  tierTag:{fontFamily:fonts.serifLightItalic,fontSize:18,color:colors.textMuted,marginBottom:16,lineHeight:28},
  priceRow:{flexDirection:"row",alignItems:"baseline",flexWrap:"wrap"},tierPrice:{fontFamily:fonts.serifLight,fontSize:48,color:colors.gold,lineHeight:58},
  tierTerm:{fontFamily:fonts.serifLightItalic,fontSize:18,color:colors.textMuted,marginLeft:6,lineHeight:26,flexShrink:1},
  tierSave:{fontFamily:fonts.serifLightItalic,fontSize:17,color:colors.gold,marginTop:4,marginBottom:10,lineHeight:24},
  div:{height:1,backgroundColor:"rgba(237,227,210,0.5)",marginVertical:16},
  featRow:{flexDirection:"row",alignItems:"flex-start",marginBottom:10},featDot:{fontSize:22,color:colors.gold,marginRight:10,lineHeight:28},
  featT:{fontFamily:fonts.sansLight,fontSize:17,color:colors.text,flex:1,lineHeight:28,flexShrink:1},
  addonBox:{backgroundColor:colors.creamDark,borderRadius:6,padding:14,marginTop:12,marginBottom:20},
  addonT:{fontFamily:fonts.serifLightItalic,fontSize:17,color:colors.textMuted,lineHeight:26},
  selBtn:{borderWidth:1,borderColor:colors.gold,paddingVertical:14,alignItems:"center",borderRadius:4},
  selBtnF:{backgroundColor:colors.gold},selBtnT:{fontFamily:fonts.sansMedium,fontSize:16,letterSpacing:4,color:colors.gold,textTransform:"uppercase",lineHeight:22},selBtnTF:{color:colors.ink},
  footer:{fontFamily:fonts.serifLightItalic,fontSize:18,color:colors.textMuted,textAlign:"center",lineHeight:28,marginTop:8},
});
