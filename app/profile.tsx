import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Switch, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import DrawerMenu from "@/components/DrawerMenu";
import BottomNav from "@/components/BottomNav";
import { colors, fonts } from "@/lib/theme";
import { supabase } from "@/lib/supabase";
import { enableNotifications, disableNotifications } from "@/lib/notifications";

export default function ProfileScreen(){
  const router=useRouter();const[menuOpen,setMenuOpen]=useState(false);
  const[loading,setLoading]=useState(true);const[saving,setSaving]=useState(false);
  const[userId,setUserId]=useState<string|null>(null);const[email,setEmail]=useState("");
  const[firstName,setFirstName]=useState("");const[lastName,setLastName]=useState("");
  const[phone,setPhone]=useState("");const[dob,setDob]=useState("");const[healthGoals,setHealthGoals]=useState("");
  const[notifEnabled,setNotifEnabled]=useState(false);const[notifTime,setNotifTime]=useState("08:00");

  useEffect(()=>{load();},[]);
  const load=async()=>{
    setLoading(true);try{
      const{data:{user}}=await supabase.auth.getUser();if(!user){setLoading(false);return;}
      setUserId(user.id);setEmail(user.email||"");
      const{data:p}=await supabase.from("profiles").select("*").eq("id",user.id).single();
      if(p){if(p.full_name){const pts=p.full_name.split(" ");setFirstName(pts[0]||"");setLastName(pts.slice(1).join(" ")||"");}
        setPhone(p.phone||"");setDob(p.date_of_birth||"");setHealthGoals(p.health_goals||"");setNotifEnabled(!!p.notifications_enabled);setNotifTime(p.notification_time||"08:00");}
    }catch(e){console.log("[Profile]",e);}setLoading(false);
  };
  const save=async()=>{if(!userId)return;setSaving(true);try{
    const{error}=await supabase.from("profiles").upsert({id:userId,full_name:`${firstName} ${lastName}`.trim(),phone,date_of_birth:dob,health_goals:healthGoals,notifications_enabled:notifEnabled,notification_time:notifTime});
    if(error)Alert.alert("Save failed",error.message);else Alert.alert("Saved","Your profile has been updated.");
  }catch(e:any){Alert.alert("Save failed",e.message||"Unknown error.");}setSaving(false);};
  const toggleNotif=async(v:boolean)=>{if(!userId)return;if(v){const ok=await enableNotifications(userId,notifTime);setNotifEnabled(ok);if(!ok)Alert.alert("Notifications not enabled","Please allow notifications in your device settings.");}else{await disableNotifications(userId);setNotifEnabled(false);}};

  if(loading)return<View style={s.loadWrap}><StatusBar style="light"/><ActivityIndicator size="large" color={colors.gold}/></View>;
  return(
    <View style={s.container}><StatusBar style="light"/>
      <View style={s.header}>
        <TouchableOpacity style={s.back} onPress={()=>router.back()}><Text style={s.backT}>{"\u2039"}</Text></TouchableOpacity>
        <TouchableOpacity style={s.menuBtn} onPress={()=>setMenuOpen(true)}><View style={s.menuL}/><View style={s.menuL}/><View style={s.menuL}/></TouchableOpacity>
        <Text style={s.headerT}>{firstName?`${firstName} ${lastName}`.trim():"My Profile"}</Text><Text style={s.headerS}>Timeless RN</Text>
      </View>
      <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==="ios"?"padding":undefined}>
        <ScrollView style={s.body} contentContainerStyle={s.bodyC} keyboardShouldPersistTaps="handled">
          <View style={s.row}>
            <View style={s.half}><Text style={s.lbl}>FIRST NAME</Text><TextInput style={s.inp} value={firstName} onChangeText={setFirstName} placeholder="First" placeholderTextColor={colors.textMuted}/></View>
            <View style={s.half}><Text style={s.lbl}>LAST NAME</Text><TextInput style={s.inp} value={lastName} onChangeText={setLastName} placeholder="Last" placeholderTextColor={colors.textMuted}/></View>
          </View>
          <Text style={s.lbl}>EMAIL</Text><TextInput style={[s.inp,s.inpDis]} value={email} editable={false}/>
          <Text style={s.lbl}>PHONE</Text><TextInput style={s.inp} value={phone} onChangeText={setPhone} placeholder="615-555-0100" placeholderTextColor={colors.textMuted} keyboardType="phone-pad"/>
          <Text style={s.lbl}>DATE OF BIRTH</Text><TextInput style={s.inp} value={dob} onChangeText={setDob} placeholder="MM/DD/YYYY" placeholderTextColor={colors.textMuted}/>
          <Text style={s.lbl}>HEALTH GOALS</Text><TextInput style={[s.inp,s.inpMulti]} value={healthGoals} onChangeText={setHealthGoals} placeholder="What would you like to work on?" placeholderTextColor={colors.textMuted} multiline numberOfLines={4} textAlignVertical="top"/>
          <View style={s.notifSec}><Text style={s.notifLbl}>NOTIFICATIONS</Text>
            <View style={s.togRow}><View style={{flex:1}}><Text style={s.togTitle}>Daily wellness reminders</Text><Text style={s.togSub}>Receive a tip each day at your preferred time</Text></View>
              <Switch value={notifEnabled} onValueChange={toggleNotif} trackColor={{false:"#D1D5DB",true:colors.gold}} thumbColor={colors.white}/></View>
            <Text style={s.lbl}>NOTIFICATION TIME (HH:MM)</Text><TextInput style={s.inp} value={notifTime} onChangeText={setNotifTime} placeholder="08:00" placeholderTextColor={colors.textMuted}/>
          </View>
          <TouchableOpacity style={[s.saveBtn,saving&&{opacity:0.6}]} onPress={save} disabled={saving} activeOpacity={0.85}>
            {saving?<ActivityIndicator color={colors.ink}/>:<Text style={s.saveBtnT}>SAVE</Text>}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
      <BottomNav onMenuPress={()=>setMenuOpen(true)}/><DrawerMenu isOpen={menuOpen} onClose={()=>setMenuOpen(false)}/>
    </View>);
}
const s=StyleSheet.create({
  container:{flex:1,backgroundColor:colors.cream},loadWrap:{flex:1,backgroundColor:colors.ink,justifyContent:"center",alignItems:"center"},
  header:{backgroundColor:colors.warmDark,paddingTop:56,paddingBottom:24,paddingHorizontal:64,alignItems:"center"},
  back:{position:"absolute",top:56,left:20,zIndex:10,padding:8},backT:{fontSize:49,color:colors.gold,lineHeight:52},
  menuBtn:{position:"absolute",top:58,right:24,zIndex:10,padding:6},menuL:{width:20,height:1.5,backgroundColor:colors.gold,marginVertical:2.5,borderRadius:1},
  headerT:{fontFamily:fonts.serifLight,fontSize:34,color:colors.creamText,letterSpacing:1,marginBottom:6,lineHeight:42,textAlign:"center"},
  headerS:{fontFamily:fonts.serifLightItalic,fontSize:20,color:colors.gold,letterSpacing:2,lineHeight:26,textAlign:"center"},
  body:{flex:1},bodyC:{padding:20,paddingBottom:40},row:{flexDirection:"row",gap:14},half:{flex:1,minWidth:0},
  lbl:{fontFamily:fonts.sans,fontSize:14,letterSpacing:4,color:colors.gold,textTransform:"uppercase",marginBottom:8,marginTop:20,lineHeight:20},
  inp:{borderBottomWidth:1,borderBottomColor:"rgba(184,137,90,0.35)",backgroundColor:"transparent",fontFamily:fonts.sansLight,fontSize:22,color:colors.text,paddingVertical:10,lineHeight:30},
  inpDis:{color:colors.textMuted},inpMulti:{minHeight:96,paddingTop:12,borderWidth:1,borderColor:"rgba(184,137,90,0.25)",borderRadius:6,paddingHorizontal:14},
  notifSec:{marginTop:24},notifLbl:{fontFamily:fonts.sans,fontSize:16,letterSpacing:4,color:colors.gold,textTransform:"uppercase",marginBottom:14,lineHeight:22},
  togRow:{flexDirection:"row",alignItems:"center",paddingVertical:10,gap:12},togTitle:{fontFamily:fonts.sansLight,fontSize:20,color:colors.text,lineHeight:28},
  togSub:{fontFamily:fonts.serifLightItalic,fontSize:17,color:colors.textMuted,marginTop:4,lineHeight:24},
  saveBtn:{backgroundColor:colors.gold,paddingVertical:16,alignItems:"center",marginTop:32},
  saveBtnT:{fontFamily:fonts.sansMedium,fontSize:18,letterSpacing:5,color:colors.ink,textTransform:"uppercase",lineHeight:24},
});
