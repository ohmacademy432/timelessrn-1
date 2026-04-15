import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { supabase } from "@/lib/supabase";
import { colors, fonts } from "@/lib/theme";

export default function SignUpScreen() {
  const router = useRouter();
  const [email,setEmail]=useState("");const [password,setPassword]=useState("");const [confirmPassword,setConfirmPassword]=useState("");
  const [loading,setLoading]=useState(false);const [errorMsg,setErrorMsg]=useState("");
  const [confirmed,setConfirmed]=useState(false);const [confirmedEmail,setConfirmedEmail]=useState("");

  const handleSignUp = async () => {
    setErrorMsg("");
    if(!email||!password||!confirmPassword){setErrorMsg("Please fill in all fields.");return;}
    if(password!==confirmPassword){setErrorMsg("Passwords do not match.");return;}
    if(password.length<6){setErrorMsg("Password must be at least 6 characters.");return;}
    setLoading(true);
    try{const{data,error}=await supabase.auth.signUp({email:email.trim().toLowerCase(),password});setLoading(false);
      if(error){setErrorMsg(error.message);return;}
      if(!data.session){setConfirmedEmail(email.trim().toLowerCase());setConfirmed(true);return;}
      if(data.user)await supabase.from("profiles").upsert({id:data.user.id});
      router.replace("/home");
    }catch(e:any){setLoading(false);setErrorMsg(e.message||"An unexpected error occurred.");}
  };

  if(confirmed){return(
    <View style={s.bg}><StatusBar style="light"/>
      <View style={s.confirmWrap}>
        <View style={s.goldLine}/><Text style={s.cTitle}>Check Your Email</Text>
        <Text style={s.cSub}>We sent a confirmation link to</Text><Text style={s.cEmail}>{confirmedEmail}</Text>
        <View style={s.div}/><Text style={s.cBody}>Tap the link to activate your account, then return here and sign in.</Text>
        <TouchableOpacity style={s.outBtn} onPress={()=>router.replace("/login")}><Text style={s.outBtnT}>GO TO SIGN IN</Text></TouchableOpacity>
        <View style={s.goldLine}/>
      </View>
    </View>);}

  return(
    <View style={s.bg}><StatusBar style="light"/>
      <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==="ios"?"padding":"height"}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
          <Text style={s.title}>Create Account</Text><Text style={s.sub}>Timeless RN</Text>
          {errorMsg!==""&&<View style={s.err}><Text style={s.errT}>{errorMsg}</Text></View>}
          <View style={s.form}>
            <Text style={s.label}>EMAIL</Text>
            <TextInput style={s.input} value={email} onChangeText={t=>{setEmail(t);setErrorMsg("");}} placeholder="your@email.com" placeholderTextColor="rgba(245,239,228,0.3)" keyboardType="email-address" autoCapitalize="none" autoCorrect={false}/>
            <Text style={s.label}>PASSWORD</Text>
            <TextInput style={s.input} value={password} onChangeText={t=>{setPassword(t);setErrorMsg("");}} placeholder="At least 6 characters" placeholderTextColor="rgba(245,239,228,0.3)" secureTextEntry/>
            <Text style={s.label}>CONFIRM PASSWORD</Text>
            <TextInput style={s.input} value={confirmPassword} onChangeText={t=>{setConfirmPassword(t);setErrorMsg("");}} placeholder="Re-enter password" placeholderTextColor="rgba(245,239,228,0.3)" secureTextEntry/>
          </View>
          <TouchableOpacity style={[s.goldBtn,loading&&{opacity:0.6}]} onPress={handleSignUp} disabled={loading} activeOpacity={0.85}>
            {loading?<ActivityIndicator color={colors.ink}/>:<Text style={s.goldBtnT}>SIGN UP</Text>}
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>router.push("/login")} style={{marginTop:16}}><Text style={s.link}>Already have an account? <Text style={s.linkG}>Log in</Text></Text></TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>);
}
const s=StyleSheet.create({
  bg:{flex:1,backgroundColor:colors.ink},scroll:{flexGrow:1,justifyContent:"center",paddingHorizontal:28,paddingVertical:60},
  title:{fontFamily:fonts.serifLight,fontSize:46,color:colors.creamText,marginBottom:6,textAlign:"center",lineHeight:56},
  sub:{fontFamily:fonts.serifLightItalic,fontSize:22,color:colors.gold,marginBottom:36,textAlign:"center",lineHeight:30},
  err:{backgroundColor:"rgba(220,80,80,0.12)",borderWidth:1,borderColor:"rgba(220,80,80,0.3)",borderRadius:8,padding:14,marginBottom:24},
  errT:{fontFamily:fonts.sansLight,color:"#F2A1A1",fontSize:18,textAlign:"center",lineHeight:26},
  form:{marginBottom:36},label:{fontFamily:fonts.sans,fontSize:14,letterSpacing:4,color:colors.gold,textTransform:"uppercase",marginBottom:10,lineHeight:20},
  input:{borderBottomWidth:1,borderBottomColor:"rgba(184,137,90,0.4)",backgroundColor:"transparent",fontFamily:fonts.sansLight,fontSize:22,color:colors.creamText,paddingVertical:12,marginBottom:26,lineHeight:30},
  goldBtn:{backgroundColor:colors.gold,paddingVertical:16,alignItems:"center",width:"100%"},
  goldBtnT:{fontFamily:fonts.sansMedium,fontSize:18,letterSpacing:5,color:colors.ink,textTransform:"uppercase",lineHeight:24},
  link:{fontFamily:fonts.sansLight,fontSize:18,color:"rgba(245,239,228,0.5)",textAlign:"center",lineHeight:26},linkG:{color:colors.gold},
  confirmWrap:{flex:1,justifyContent:"center",alignItems:"center",paddingHorizontal:28},
  goldLine:{width:1,height:48,backgroundColor:colors.gold,opacity:0.4},
  cTitle:{fontFamily:fonts.serifLight,fontSize:42,color:colors.creamText,marginTop:28,marginBottom:18,textAlign:"center",lineHeight:50},
  cSub:{fontFamily:fonts.serifLightItalic,fontSize:20,color:"rgba(245,239,228,0.6)",textAlign:"center",marginBottom:6,lineHeight:28},
  cEmail:{fontFamily:fonts.sans,fontSize:20,color:colors.gold,textAlign:"center",marginBottom:28,lineHeight:28},
  div:{width:36,height:1,backgroundColor:"rgba(184,137,90,0.3)",marginBottom:24},
  cBody:{fontFamily:fonts.sansLight,fontSize:18,color:"rgba(245,239,228,0.5)",lineHeight:30,textAlign:"center",marginBottom:36},
  outBtn:{borderWidth:1,borderColor:colors.gold,paddingVertical:16,paddingHorizontal:40,marginBottom:32},
  outBtnT:{fontFamily:fonts.sansMedium,fontSize:16,letterSpacing:5,color:colors.gold,textTransform:"uppercase",lineHeight:22},
});
