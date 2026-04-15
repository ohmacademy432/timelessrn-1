import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import DrawerMenu from "@/components/DrawerMenu";
import BottomNav from "@/components/BottomNav";
import { colors, fonts } from "@/lib/theme";
import { getService } from "@/lib/services";

export default function ServiceDetailScreen(){
  const router=useRouter();const{id}=useLocalSearchParams<{id:string}>();const[menuOpen,setMenuOpen]=useState(false);
  const service=id?getService(id):undefined;
  if(!service)return(
    <View style={s.container}><StatusBar style="light"/>
      <View style={s.header}><TouchableOpacity style={s.back} onPress={()=>router.back()}><Text style={s.backT}>{"\u2039"}</Text></TouchableOpacity><Text style={s.headerT}>Service</Text></View>
      <View style={s.emptyBody}><Text style={s.emptyT}>Service not found.</Text></View>
    </View>);
  return(
    <View style={s.container}><StatusBar style="light"/>
      <View style={s.header}>
        <TouchableOpacity style={s.back} onPress={()=>router.back()}><Text style={s.backT}>{"\u2039"}</Text></TouchableOpacity>
        <TouchableOpacity style={s.menuBtn} onPress={()=>setMenuOpen(true)}><View style={s.menuL}/><View style={s.menuL}/><View style={s.menuL}/></TouchableOpacity>
        <Text style={s.headerT}>{service.name}</Text><Text style={s.headerS}>{service.short}</Text>
      </View>
      <ScrollView style={s.body} contentContainerStyle={s.bodyC}>
        {service.price&&<View style={s.priceCard}><Text style={s.priceLbl}>STARTING AT</Text><Text style={s.price}>{service.price}</Text></View>}
        <Text style={s.secLbl}>OVERVIEW</Text><Text style={s.desc}>{service.description}</Text>
        <Text style={s.secLbl}>BENEFITS</Text>
        {service.benefits.map((b,i)=><View key={i} style={s.bRow}><Text style={s.bDot}>{"\u2022"}</Text><Text style={s.bT}>{b}</Text></View>)}
        <TouchableOpacity style={s.bookBtn} onPress={()=>router.push("/booking")} activeOpacity={0.85}><Text style={s.bookBtnT}>BOOK NOW</Text></TouchableOpacity>
        <Text style={s.disc}>All treatments are administered by a Registered Nurse under MD oversight.</Text>
      </ScrollView>
      <BottomNav onMenuPress={()=>setMenuOpen(true)}/><DrawerMenu isOpen={menuOpen} onClose={()=>setMenuOpen(false)}/>
    </View>);
}
const s=StyleSheet.create({
  container:{flex:1,backgroundColor:colors.cream},
  header:{backgroundColor:colors.warmDark,paddingTop:56,paddingBottom:24,paddingHorizontal:64,alignItems:"center"},
  back:{position:"absolute",top:56,left:20,zIndex:10,padding:8},backT:{fontSize:49,color:colors.gold,lineHeight:52},
  menuBtn:{position:"absolute",top:58,right:24,zIndex:10,padding:6},menuL:{width:20,height:1.5,backgroundColor:colors.gold,marginVertical:2.5,borderRadius:1},
  headerT:{fontFamily:fonts.serifLight,fontSize:32,color:colors.creamText,letterSpacing:1,textAlign:"center",marginBottom:6,lineHeight:40},
  headerS:{fontFamily:fonts.serifLightItalic,fontSize:19,color:colors.gold,letterSpacing:1,textAlign:"center",lineHeight:26},
  body:{flex:1},bodyC:{padding:20,paddingBottom:40},
  priceCard:{borderLeftWidth:3,borderLeftColor:colors.gold,backgroundColor:colors.white,padding:20,marginBottom:24,alignItems:"center"},
  priceLbl:{fontFamily:fonts.sans,fontSize:14,letterSpacing:3,color:colors.textMuted,textTransform:"uppercase",marginBottom:6,lineHeight:20},
  price:{fontFamily:fonts.serifLight,fontSize:48,color:colors.gold,lineHeight:58},
  secLbl:{fontFamily:fonts.sans,fontSize:14,letterSpacing:4,color:colors.gold,textTransform:"uppercase",marginTop:12,marginBottom:12,lineHeight:20},
  desc:{fontFamily:fonts.sansLight,fontSize:18,color:colors.text,lineHeight:30,marginBottom:24},
  bRow:{flexDirection:"row",alignItems:"flex-start",marginBottom:10},bDot:{fontSize:22,color:colors.gold,marginRight:10,lineHeight:30},
  bT:{fontFamily:fonts.sansLight,fontSize:18,color:colors.text,flex:1,lineHeight:30,flexShrink:1},
  bookBtn:{backgroundColor:colors.gold,paddingVertical:16,alignItems:"center",marginTop:24,marginBottom:20},
  bookBtnT:{fontFamily:fonts.sansMedium,fontSize:18,letterSpacing:5,color:colors.ink,textTransform:"uppercase"},
  disc:{fontFamily:fonts.serifLightItalic,fontSize:18,color:colors.textMuted,textAlign:"center",lineHeight:28},
  emptyBody:{flex:1,justifyContent:"center",alignItems:"center",paddingHorizontal:20},emptyT:{fontFamily:fonts.serifLightItalic,fontSize:24,color:colors.textMuted,lineHeight:32},
});
