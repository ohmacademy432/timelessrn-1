import { View, Text, TouchableOpacity, StyleSheet, Linking } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Svg, { Line, Circle } from "react-native-svg";
import { colors, fonts } from "@/lib/theme";

export default function WelcomeScreen() {
  const router = useRouter();
  return (
    <View style={s.bg}>
      <StatusBar style="light" />
      {/* Sacred geometry */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Svg width="100%" height="100%" viewBox="0 0 400 800" style={StyleSheet.absoluteFill}>
          <Line x1="200" y1="0" x2="200" y2="800" stroke="#B8895A" strokeWidth={0.5} opacity={0.07} />
          <Line x1="0" y1="400" x2="400" y2="400" stroke="#B8895A" strokeWidth={0.5} opacity={0.07} />
          <Circle cx="200" cy="400" r="80" stroke="#B8895A" strokeWidth={0.5} fill="none" opacity={0.07} />
          <Circle cx="200" cy="400" r="140" stroke="#B8895A" strokeWidth={0.5} fill="none" opacity={0.07} />
          <Circle cx="200" cy="400" r="200" stroke="#B8895A" strokeWidth={0.5} fill="none" opacity={0.07} />
          <Line x1="0" y1="0" x2="400" y2="800" stroke="#B8895A" strokeWidth={0.5} opacity={0.07} />
          <Line x1="400" y1="0" x2="0" y2="800" stroke="#B8895A" strokeWidth={0.5} opacity={0.07} />
        </Svg>
      </View>
      <View style={StyleSheet.absoluteFill} pointerEvents="none"><View style={{flex:1,backgroundColor:"rgba(184,137,90,0.06)"}}/></View>
      {/* Top bar */}
      <View style={s.topBar}>
        <Text style={s.topL}>TRN</Text>
        <TouchableOpacity onPress={() => router.push("/login")}><Text style={s.topR}>SIGN IN</Text></TouchableOpacity>
      </View>
      {/* Center */}
      <View style={s.center}>
        <Text style={s.eye}>WEST NASHVILLE · EST. 2017</Text>
        <Text style={s.brand}>Timeless RN</Text>
        <Text style={s.sub}>Wellness Spa</Text>
        <View style={s.div} />
        <View style={s.tagList}>
          {["Elevate your energy","Optimize your wellness","Renew your vitality"].map((t,i)=>(
            <View key={i} style={s.tagRow}>
              <Text style={s.tagCheck}>{"\u2713"}</Text>
              <Text style={s.tag}>{t}</Text>
            </View>
          ))}
        </View>
        <TouchableOpacity style={s.bookBtn} onPress={() => router.push("/login")} activeOpacity={0.85}>
          <Text style={s.bookBtnT}>SIGN IN</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/chat")}><Text style={s.signIn}>ASK TIMELESS RN</Text></TouchableOpacity>
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  bg:{flex:1,backgroundColor:colors.ink,justifyContent:"center",alignItems:"center"},
  topBar:{position:"absolute",top:52,left:24,right:24,flexDirection:"row",justifyContent:"space-between",alignItems:"center",zIndex:10},
  topL:{fontFamily:fonts.serifLight,fontSize:18,letterSpacing:4,color:"rgba(245,239,228,0.85)",textTransform:"uppercase",lineHeight:24},
  topR:{fontFamily:fonts.sansLight,fontSize:15,letterSpacing:2,color:"rgba(184,137,90,0.9)",textTransform:"uppercase",lineHeight:22},
  center:{alignItems:"center",paddingHorizontal:28},
  eye:{fontFamily:fonts.sans,fontSize:14,letterSpacing:5,color:colors.gold,textTransform:"uppercase",marginBottom:18,lineHeight:20},
  brand:{fontFamily:fonts.serifLight,fontSize:54,color:colors.creamText,letterSpacing:3,marginBottom:6,lineHeight:64,textAlign:"center"},
  sub:{fontFamily:fonts.serifLightItalic,fontSize:24,color:colors.gold,letterSpacing:3,marginBottom:28,lineHeight:32,textAlign:"center"},
  div:{width:36,height:1,backgroundColor:"rgba(184,137,90,0.4)",marginBottom:28},
  tagList:{alignItems:"flex-start",marginBottom:40},
  tagRow:{flexDirection:"row",alignItems:"center",marginBottom:14},
  tagCheck:{fontFamily:fonts.serifLight,fontSize:20,color:colors.gold,marginRight:14,opacity:0.7,lineHeight:28},
  tag:{fontFamily:fonts.serifLightItalic,fontSize:22,color:"rgba(245,239,228,0.4)",lineHeight:30,flexShrink:1},
  bookBtn:{backgroundColor:colors.gold,paddingVertical:16,paddingHorizontal:40,marginBottom:20},
  bookBtnT:{fontFamily:fonts.sansMedium,fontSize:16,letterSpacing:5,color:colors.ink,textTransform:"uppercase",lineHeight:22},
  signIn:{fontFamily:fonts.sansLight,fontSize:15,letterSpacing:3,color:"rgba(184,137,90,0.9)",textTransform:"uppercase",lineHeight:22},
});
