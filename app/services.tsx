import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import DrawerMenu from "@/components/DrawerMenu";
import BottomNav from "@/components/BottomNav";
import { colors, fonts } from "@/lib/theme";
import { SERVICES, CATEGORY_LABEL, type ServiceCategory } from "@/lib/services";

const ALL_CATEGORIES: ServiceCategory[] = ["IV", "PRP", "AESTHETIC"];

export default function ServicesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ category?: string }>();
  const [menuOpen, setMenuOpen] = useState(false);
  const activeCategory = params.category as ServiceCategory | undefined;
  const categoriesToShow = activeCategory && ALL_CATEGORIES.includes(activeCategory) ? [activeCategory] : ALL_CATEGORIES;
  let globalIdx = 0;

  return (
    <View style={s.container}><StatusBar style="light" />
      <View style={s.header}>
        <TouchableOpacity style={s.back} onPress={() => router.back()}><Text style={s.backT}>{"\u2039"}</Text></TouchableOpacity>
        <TouchableOpacity style={s.menuBtn} onPress={() => setMenuOpen(true)}><View style={s.menuL}/><View style={s.menuL}/><View style={s.menuL}/></TouchableOpacity>
        <Text style={s.headerT}>Our Services</Text><Text style={s.headerS}>Timeless RN Wellness Spa</Text>
      </View>
      <ScrollView style={s.body} contentContainerStyle={s.bodyC}>
        {categoriesToShow.map((cat) => {
          const items = SERVICES.filter((sv) => sv.category === cat);
          return (
            <View key={cat} style={s.section}>
              <Text style={s.secLbl}>{CATEGORY_LABEL[cat]}</Text>
              {items.map((svc) => { globalIdx++; const num = String(globalIdx).padStart(2, "0");
                return (
                  <TouchableOpacity key={svc.id} style={s.card} onPress={() => router.push({ pathname: "/service-detail", params: { id: svc.id } })} activeOpacity={0.9}>
                    <Text style={s.cardNum}>{num}</Text>
                    <View style={s.cardNameRow}><Text style={s.cardName}>{svc.name}</Text>{svc.price?<Text style={s.cardPrice}>{svc.price}</Text>:null}</View>
                    <Text style={s.cardDesc}>{svc.description}</Text>
                    <TouchableOpacity style={s.cardBtn} onPress={() => router.push("/booking")} activeOpacity={0.85}><Text style={s.cardBtnT}>BOOK NOW</Text></TouchableOpacity>
                  </TouchableOpacity>);
              })}
            </View>);
        })}
      </ScrollView>
      <BottomNav onMenuPress={() => setMenuOpen(true)} />
      <DrawerMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </View>
  );
}
const s = StyleSheet.create({
  container:{flex:1,backgroundColor:colors.cream},
  header:{backgroundColor:colors.warmDark,paddingTop:56,paddingBottom:24,paddingHorizontal:64,alignItems:"center"},
  back:{position:"absolute",top:56,left:20,zIndex:10,padding:8},backT:{fontSize:49,color:colors.gold,lineHeight:52},
  menuBtn:{position:"absolute",top:58,right:24,zIndex:10,padding:6},menuL:{width:20,height:1.5,backgroundColor:colors.gold,marginVertical:2.5,borderRadius:1},
  headerT:{fontFamily:fonts.serifLight,fontSize:42,color:colors.creamText,letterSpacing:2,marginBottom:6,lineHeight:50,textAlign:"center"},
  headerS:{fontFamily:fonts.serifLightItalic,fontSize:20,color:colors.gold,letterSpacing:2,lineHeight:26,textAlign:"center"},
  body:{flex:1},bodyC:{padding:20,paddingBottom:40},
  section:{marginBottom:28},secLbl:{fontFamily:fonts.sans,fontSize:16,letterSpacing:4,color:colors.gold,textTransform:"uppercase",marginBottom:16,textAlign:"center",lineHeight:22},
  card:{backgroundColor:colors.white,borderBottomWidth:1,borderBottomColor:"rgba(237,227,210,0.6)",paddingVertical:20,paddingHorizontal:8,marginBottom:10},
  cardNum:{fontFamily:fonts.serifLight,fontSize:18,color:"rgba(184,137,90,0.5)",letterSpacing:2,marginBottom:6,lineHeight:24},
  cardNameRow:{flexDirection:"row",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6,gap:10},
  cardName:{fontFamily:fonts.serifLight,fontSize:30,color:colors.text,flex:1,lineHeight:38,flexShrink:1},
  cardPrice:{fontFamily:fonts.serifLight,fontSize:24,color:colors.gold,lineHeight:32,flexShrink:0},
  cardDesc:{fontFamily:fonts.sansLight,fontSize:17,color:colors.textMuted,lineHeight:28,marginBottom:16},
  cardBtn:{backgroundColor:colors.gold,paddingVertical:12,alignItems:"center"},
  cardBtnT:{fontFamily:fonts.sansMedium,fontSize:16,letterSpacing:4,color:colors.ink,textTransform:"uppercase"},
});
