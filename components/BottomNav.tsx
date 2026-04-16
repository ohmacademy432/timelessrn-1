import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { colors, fonts } from "@/lib/theme";

type Props = { active?: "home" | "menu" | null; onMenuPress: () => void };

export default function BottomNav({ active = null, onMenuPress }: Props) {
  const router = useRouter();
  return (
    <View style={s.nav}>
      <TouchableOpacity style={s.item} onPress={() => router.push("/home")} activeOpacity={0.7}>
        <Text style={[s.icon, active === "home" && s.iconActive]}>{"\u2302"}</Text>
        <Text style={[s.lbl, active === "home" && s.lblActive]}>HOME</Text>
      </TouchableOpacity>
      <View style={s.centerWrap}>
        <TouchableOpacity onPress={() => router.push("/chat")} activeOpacity={0.85} style={s.centerBtn}>
          <Text style={s.centerT}>TIMELESS{"\n"}RN</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={s.item} onPress={onMenuPress} activeOpacity={0.7}>
        <View style={s.hamWrap}><View style={s.hamLine}/><View style={s.hamLine}/><View style={s.hamLine}/></View>
        <Text style={s.lbl}>MENU</Text>
      </TouchableOpacity>
    </View>
  );
}
const s = StyleSheet.create({
  nav:{flexDirection:"row",backgroundColor:colors.warmDark,paddingTop:14,paddingBottom:30,paddingHorizontal:16,borderTopWidth:1,borderTopColor:"rgba(184,137,90,0.1)",alignItems:"center"},
  item:{flex:1,alignItems:"center",gap:3},
  icon:{fontSize:39,color:colors.gold,textShadowColor:"rgba(255,255,255,0.6)",textShadowOffset:{width:0,height:0},textShadowRadius:2},iconActive:{color:colors.gold},
  lbl:{fontFamily:fonts.sans,fontSize:12,letterSpacing:1,color:colors.gold,textTransform:"uppercase",textShadowColor:"rgba(255,255,255,0.6)",textShadowOffset:{width:0,height:0},textShadowRadius:2},lblActive:{color:colors.gold},
  hamWrap:{width:22,height:22,justifyContent:"center",alignItems:"center"},
  hamLine:{width:18,height:1.5,backgroundColor:colors.gold,marginVertical:2,borderRadius:1},
  centerWrap:{flex:1,alignItems:"center"},
  centerBtn:{width:91,height:91,borderRadius:46,backgroundColor:colors.gold,alignItems:"center",justifyContent:"center",borderWidth:3,borderColor:"rgba(255,255,255,0.35)",boxShadow:"0px 2px 8px rgba(255,255,255,0.3), 0px 6px 24px rgba(184,137,90,0.5), inset 0px 1px 2px rgba(255,255,255,0.4)",elevation:8},
  centerT:{fontFamily:fonts.sansMedium,fontSize:12,letterSpacing:1.5,color:colors.ink,textAlign:"center",lineHeight:18,textTransform:"uppercase"},
});
