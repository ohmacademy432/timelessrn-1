import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { supabase } from "@/lib/supabase";
import { colors, fonts } from "@/lib/theme";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async () => {
    setErrorMsg(""); if (!email||!password){setErrorMsg("Please enter your email and password.");return;}
    setLoading(true);
    try { const{error}=await supabase.auth.signInWithPassword({email:email.trim().toLowerCase(),password}); setLoading(false); if(error){setErrorMsg(error.message);return;} router.replace("/home");
    } catch(e:any){setLoading(false);setErrorMsg(e.message||"An unexpected error occurred.");}
  };
  const handleForgot = async () => {
    if(!email){setErrorMsg("Enter your email first.");return;}
    const{error}=await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase());
    if(error){setErrorMsg(error.message);return;} Alert.alert("Check your email","We sent a password reset link.");
  };

  return (
    <View style={s.bg}><StatusBar style="light" />
      <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==="ios"?"padding":"height"}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
          <Text style={s.title}>Welcome Back</Text>
          <Text style={s.sub}>Timeless RN</Text>
          {errorMsg!==""&&<View style={s.err}><Text style={s.errT}>{errorMsg}</Text></View>}
          <View style={s.form}>
            <Text style={s.label}>EMAIL</Text>
            <TextInput style={s.input} value={email} onChangeText={t=>{setEmail(t);setErrorMsg("");}} placeholder="your@email.com" placeholderTextColor="rgba(245,239,228,0.3)" keyboardType="email-address" autoCapitalize="none" autoCorrect={false}/>
            <Text style={s.label}>PASSWORD</Text>
            <TextInput style={s.input} value={password} onChangeText={t=>{setPassword(t);setErrorMsg("");}} placeholder="Your password" placeholderTextColor="rgba(245,239,228,0.3)" secureTextEntry/>
            <TouchableOpacity onPress={handleForgot} style={s.forgotBtn}><Text style={s.forgot}>Forgot password?</Text></TouchableOpacity>
          </View>
          <TouchableOpacity style={[s.goldBtn,loading&&{opacity:0.6}]} onPress={handleLogin} disabled={loading} activeOpacity={0.85}>
            {loading?<ActivityIndicator color={colors.ink}/>:<Text style={s.goldBtnT}>SIGN IN</Text>}
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>router.push("/signup")} style={{marginTop:16}}><Text style={s.link}>New here? <Text style={s.linkG}>Create an account</Text></Text></TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
const s = StyleSheet.create({
  bg:{flex:1,backgroundColor:colors.ink},
  scroll:{flexGrow:1,justifyContent:"center",paddingHorizontal:28,paddingVertical:60},
  title:{fontFamily:fonts.serifLight,fontSize:48,color:colors.creamText,marginBottom:6,textAlign:"center",lineHeight:58},
  sub:{fontFamily:fonts.serifLightItalic,fontSize:22,color:colors.gold,marginBottom:36,textAlign:"center",lineHeight:30},
  err:{backgroundColor:"rgba(220,80,80,0.12)",borderWidth:1,borderColor:"rgba(220,80,80,0.3)",borderRadius:8,padding:14,marginBottom:24},
  errT:{fontFamily:fonts.sansLight,color:"#F2A1A1",fontSize:18,textAlign:"center",lineHeight:26},
  form:{marginBottom:36},
  label:{fontFamily:fonts.sans,fontSize:14,letterSpacing:4,color:colors.gold,textTransform:"uppercase",marginBottom:10,lineHeight:20},
  input:{borderBottomWidth:1,borderBottomColor:"rgba(184,137,90,0.4)",backgroundColor:"transparent",fontFamily:fonts.sansLight,fontSize:22,color:colors.creamText,paddingVertical:12,marginBottom:26,lineHeight:30},
  forgotBtn:{alignSelf:"flex-end",paddingVertical:4},forgot:{fontFamily:fonts.sansLight,fontSize:17,color:colors.gold,lineHeight:24},
  goldBtn:{backgroundColor:colors.gold,paddingVertical:16,alignItems:"center",width:"100%"},
  goldBtnT:{fontFamily:fonts.sansMedium,fontSize:18,letterSpacing:5,color:colors.ink,textTransform:"uppercase",lineHeight:24},
  link:{fontFamily:fonts.sansLight,fontSize:18,color:"rgba(245,239,228,0.5)",textAlign:"center",lineHeight:26},
  linkG:{color:colors.gold},
});
